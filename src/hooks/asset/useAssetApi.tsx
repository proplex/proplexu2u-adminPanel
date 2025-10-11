import { useState, useCallback, useTransition, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/httpClient";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import { BigNumber } from "ethers";
import useSpvNames from "@/hooks/spv/useSpvNames";
import useIPFSUpload from "@/hooks/useIPFSUpload";
import { OwnmaliSDK } from "@/lib/ownmali";

// Import the wallet connection hook
import { useWalletConnection } from "@/hooks/spv/useWalletConnection";

export interface AssetPayload {
  class: string;
  category: string;
  stage: string;
  style: string;
  name: string;
  about: string;
  currency: string;
  instrumentType: string;
}

type Status = "idle" | "loading" | "success" | "error";

export const useAssetApi = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [asset, setAsset] = useState<any>({
    class: "real-estate",
    category: "commercial",
    stage: "fully-rented",
  });

  const { uploadProjectFiles, loading: ipfsLoading } = useIPFSUpload();

  const [assetOverview, setAssetOverview] = useState<any>();
  const [isPending, startTransition] = useTransition();
  const [assetList, setAssetList] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const navigate = useNavigate();

  // Get wallet connection using the custom hook instead of raw wagmi hooks
  const {
    address,
    isConnected,
    connectorName,
    isMetaMaskConnected,
    getProvider
  } = useWalletConnection();

  console.log(
    "wallet data in asset section:",
    address,
    isConnected
  );

  const initializeSDK = useCallback(async () => {
    try {
      if (!isConnected || !address) {
        throw new Error("Please connect your MetaMask wallet first");
      }

      // Get provider and signer from the wallet connection
      const { provider, signer, signerAddress } = await getProvider();
      
      // Verify the signer address matches the connected address
      if (signerAddress.toLowerCase() !== address.toLowerCase()) {
        console.error("Address mismatch:", {
          signerAddress,
          connectedAddress: address,
          connectorName,
          isMetaMask: isMetaMaskConnected
        });
        throw new Error("Wallet address mismatch. Please reconnect your MetaMask wallet.");
      }

      const sdk = new OwnmaliSDK(provider, signer);
      
      // Log successful initialization
      console.log("SDK initialized successfully:", {
        signerAddress,
        connectedAddress: address,
        connectorName,
        isMetaMask: isMetaMaskConnected
      });
      
      return { provider, signer, sdk, address: signerAddress };
    } catch (error) {
      console.error('Failed to initialize SDK:', error);
      throw error;
    }
  }, [isConnected, address, getProvider, connectorName, isMetaMaskConnected]);
  
  // Log wallet connection status for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("Wallet connection status:", {
        isConnected,
        address,
        connectorName,
        isMetaMaskConnected
      });
    }
  }, [isConnected, address, connectorName, isMetaMaskConnected]);

  const { spvNames, fetchSpvNames } = useSpvNames();

  // Check if wallet is connected
  useEffect(() => {
    if (!isConnected) {
      console.warn(
        "Wallet not connected. Blockchain functionality will be limited."
      );
    }
  }, [isConnected]);

  const createAsset = useCallback(
    async (data: AssetPayload) => {
      setStatus("loading");
      setError(null);

      try {
        // 1. First create the asset in our backend
        const res = await api.post("/assets/real-estate", data);
        const assetId = res.data.data._id;
        console.log(assetId);
        console.log(data);
        // 2. Set up the provider and wallet using private key

        // 5. Navigate to the edit page
        navigate(
          `/edit-asset/${assetId}?step=asset-information&tab=asset-type`
        );

        setStatus("success");
        toast.success("Asset created and deployed on blockchain successfully");

        return {
          ...res.data,
        };
      } catch (err: any) {
        console.error("Error creating asset:", err);
        const errorMessage =
          err.reason ||
          err.data?.message ||
          err.response?.data?.message ||
          err.message ||
          "Failed to create asset";

        setStatus("error");
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      }
    },
    [navigate]
  );
  const getAsset = async (id: string) => {
    setStatus("loading");
    setError(null);
    try {
      const res = await api.get(`/assets/real-estate/admin-get/${id}`);
      setStatus("success");
      setAsset(res.data.data);
      return res.data.data;
    } catch (err: any) {
      setStatus("error");
      setError(
        err.response?.data?.message || err.message || "Failed to fetch asset"
      );
      throw err;
    }
  };

  const updateAsset = useCallback(
    async (id: string, data: AssetPayload) => {
      console.log("daat is here @@@@", data);
      setStatus("loading");
      setError(null);
      try {
        const res = await api.put(`/assets/real-estate/${id}`, data);
        console.log("res is here @@@@", res);
        const assetId = res?.data?.data?._id;
        const companyId = res?.data?.data?.companyId;
        console.log("companyId", companyId);
        const assetOwner = res?.data?.data?.company?.walletAddress;
        console.log("asset owenr is here:", assetOwner);

        // Check if asset is already deployed to blockchain
        const isAlreadyDeployed = !!(res?.data?.data?.tokenInformation?.blockchainProjectAddress);
        
        // Only deploy to blockchain if token information is complete AND not already deployed
        const tokenInfo = res?.data?.data?.tokenInformation;
        const hasCompleteTokenInfo = !!(
          tokenInfo?.tokenSupply && tokenInfo?.tokenSymbol
        );

        console.log("Blockchain deployment check:", {
          isAlreadyDeployed,
          hasCompleteTokenInfo,
          tokenSupply: tokenInfo?.tokenSupply,
          tokenSymbol: tokenInfo?.tokenSymbol,
          blockchainStatus: res.data.data.blockchain?.status,
          isConnected,
          hasAddress: !!address,
          companyId,
        });

        // Only proceed with deployment if:
        // 1. Token info is complete
        // 2. Wallet is connected
        // 3. Asset is not already deployed
        if (hasCompleteTokenInfo && isConnected && address && !isAlreadyDeployed) {
          try {
            toast.loading("Deploying asset on blockchain...");

            // Initialize SDK for blockchain operations
            const { sdk } = await initializeSDK();

            if (!companyId) {
              throw new Error(
                "No company available. Please create a company first."
              );
            }

            console.log("Using company ID as SPV:", companyId);

            // Extract token information from response
            const tokenSupply = tokenInfo.tokenSupply;
            const assetSymbol = tokenInfo.tokenSymbol;
            console.log("tokenSupply", tokenSupply);
            console.log("assetSymbol", assetSymbol);
            console.log(
              "Complete token info available - proceeding with blockchain deployment"
            );

            const assetName = data.name || res.data.data.name;
            const decimals = 18; // Standard ERC20 decimals

            // Create project metadata for IPFS upload
            const projectMetadata = {
              name: res.data.data.name,
              assetStyle: res.data.data.style,
              currency: res.data.data.currency,
              instrumentType: res.data.data.instrumentType,
              country: res.data.data.country,
              state: res.data.data.state || "",
              city: res.data.data.city,
              landmark: res.data.data.landmark,
              description: res.data.data.about,
              companyName: res.data.data.company?.name || "",
              tokenInformation: {
                tokenSupply: res.data.data.tokenInformation.tokenSupply,
                tokenSymbol: res.data.data.tokenInformation.tokenSymbol,
                minimumTokensToBuy:
                  res.data.data.tokenInformation.minimumTokensToBuy,
                maximumTokensToBuy:
                  res.data.data.tokenInformation.maximumTokensToBuy,
                availableTokensToBuy:
                  res.data.data.tokenInformation.availableTokensToBuy,
                tokenPrice: res.data.data.tokenInformation.tokenPrice,
              },
            };

            console.log("Project metadata for IPFS:", projectMetadata);

            // Upload metadata to IPFS
            toast.loading("Uploading metadata to IPFS...");
            const ipfsResult = await uploadProjectFiles(projectMetadata);
            const metadataCID = ipfsResult.metadata;

            if (!metadataCID) {
              throw new Error("Failed to upload metadata to IPFS");
            }

            console.log("Metadata uploaded to IPFS with CID:", metadataCID);

            // Convert token supply to proper format
            const maxSupply = ethers.utils.parseUnits(
              tokenSupply.toString(),
              decimals
            );

            // Call prepareDeploy from SDK (new two-step deployment)
            toast.loading("Preparing asset deployment on blockchain...");
            console.log(
              "final preparedeploy parasm is ehre:",
              companyId,
              assetName,
              assetSymbol,
              decimals,
              maxSupply,
              assetId,
              metadataCID
            );
            const prepareTx = await sdk.prepareDeploy(
              companyId, // spvId (using company ID)
              assetName, // name
              assetSymbol, // symbol
              decimals, // decimals
              maxSupply, // maxSupply from tokenInformation.tokenSupply
              assetId, // assetId (using the database ID)
              metadataCID // metaCID from IPFS upload
            );

            // Wait for deployment transaction to be mined
            const deployReceipt = await prepareTx.wait();
            console.log("Deployment transaction mined:", deployReceipt);

            const identityRegistry =
              "0x1bfE79c579c72f43D07F5F43878afdBD09a2726a";
            const compliance = "0xe42eE8C6ca221b582fd8Fb93476DB1c47E08e244";
            const issuerRegistry = "0xEAFaF64aDbc6a626261B4dC5aAED112cC6844bE5";
            const claimRegistry = "0x5Efdfa516F4F8Bac356f2eb6c0d8F9424A629f47";
            const spv = res?.data?.data?.company?.spvAddress || "0x"; // Dynamic SPV address from company data
            const assetOwnerAddress = assetOwner || "0x"; // Asset owner wallet address from company data

            console.log("SPV Address:", spv);
            console.log("Asset Owner Address:", assetOwnerAddress);
            console.log(
              "all final execute deploy params is here:",
              identityRegistry,
              compliance,
              issuerRegistry,
              claimRegistry,
              spv,
              assetOwnerAddress
            );

            const executeTx = await sdk.executeDeploy(
              identityRegistry,
              compliance,
              issuerRegistry,
              claimRegistry,
              spv,
              assetOwnerAddress
            );

            const executeReceipt = await executeTx.wait();
            console.log("Execute receipt:", executeReceipt);

            // Listen for AssetSuiteDeployed event
            const assetSuiteDeployedEvent = executeReceipt.events?.find(
              (event: any) => event.event === "AssetSuiteDeployed"
            ) as ethers.Event | undefined;

            if (!assetSuiteDeployedEvent?.args) {
              throw new Error(
                "Failed to deploy asset: No AssetSuiteDeployed event found"
              );
            }

            const eventArgs = assetSuiteDeployedEvent.args as any;
            const deployedAssetAddress = eventArgs.asset as string;
            const assetManagerAddress = eventArgs.assetManager as string;
            const orderManagerAddress = eventArgs.orderManager as string;
            const spvIdHash = eventArgs.spvIdHash as string;
            const assetIdFromEvent = eventArgs.assetId as string;

            console.log("Asset Suite deployed:", {
              asset: deployedAssetAddress,
              assetManager: assetManagerAddress,
              orderManager: orderManagerAddress,
              spvIdHash,
              assetId: assetIdFromEvent,
            });

            const approvetx = await sdk.approve(
              deployedAssetAddress,
              assetManagerAddress,
              ethers.constants.MaxUint256
            );
            const receipt = await approvetx.wait();
            console.log("Approve tx:", approvetx);
            console.log("Approve receipt:", receipt); //@note

            // Update the asset in the backend with blockchain deployment info
            const response = await api.put(
              `/assets/real-estate/admin-put/${id}`,
              {
                tokenInformation: {
                  ...res.data.data.tokenInformation, // Preserve existing tokenInformation
                  blockchainProjectAddress: deployedAssetAddress,
                  blockchainOrderManagerAddress: orderManagerAddress,
                  assetManagerAddress: assetManagerAddress,
                },
                assetAddress: deployedAssetAddress,
                status: "draft",
              }
            );
            console.log("response is here:", response);

            toast.success("Asset deployed on blockchain successfully");
          } catch (deployError: any) {
            toast.error(
              deployError.data?.message ||
                deployError.message ||
                "Asset was updated, but deployment on blockchain failed. Please contact support."
            );
            // Don't throw here - the asset update was successful even if deployment failed
          }
        } else if (isAlreadyDeployed) {
          console.log("Asset already deployed to blockchain, skipping deployment");
          toast.success("Asset updated successfully (already deployed to blockchain)");
        }

        setStatus("success");
        if (!isAlreadyDeployed) {
          toast.success("Asset updated successfully");
        }
        setAsset(res.data.data);
        return res.data.data;
      } catch (err: any) {
        setStatus("error");
        setError(
          err.response?.data?.message || err.message || "Failed to update asset"
        );
        toast.error(
          err.response?.data?.message || err.message || "Failed to update asset"
        );
        throw err;
      }
    },
    [initializeSDK, address]
  );

  const getAssetList = async ({
    page = 1,
    limit = 10,
    search = "",
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    setStatus("loading");
    setError(null);
    try {
      const res = await api.get(
        `/assets/real-estate/admin-list?page=${page}&limit=${limit}&search=${search}`
      );
      setStatus("success");
      setAssetList(res.data.data);
      setPagination(res.data.pagination);
      return res.data;
    } catch (err: any) {
      setStatus("error");
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch Asset list"
      );
      throw err;
    }
  };

  const getAssetOverview = async (id: string) => {
    setStatus("loading");
    setError(null);
    try {
      const res = await api.get(
        `/assets/real-estate/asset-overview?assetId=${id}`
      );
      setStatus("success");
      setAssetOverview(res.data.data);
      return res.data;
    } catch (err: any) {
      setStatus("error");
      setError(
        err.response?.data?.message || err.message || "Failed to fetch asset"
      );
      throw err;
    }
  };

  const updateAssetStatus = async (id: string, status: string) => {
    setStatus("loading");
    setError(null);
    try {
      const res = await api.put(`/assets/real-estate/${id}`, { status });
      setStatus("success");
      toast.success("Asset status updated successfully");
      setAssetList((prev) =>
        prev.map((asset) => {
          if (asset._id === id) {
            return { ...asset, status };
          }
          return asset;
        })
      );
      return res.data.data;
    } catch (err: any) {
      setStatus("error");
      setError(
        err.response?.data?.message || err.message || "Failed to update asset"
      );
      toast.error(
        err.response?.data?.message || err.message || "Failed to update asset"
      );
      throw err;
    }
  };

  return {
    createAsset,
    getAsset,
    updateAsset,
    status,
    error,
    asset,
    isPending,
    assetList,
    pagination,
    getAssetList,
    assetOverview,
    getAssetOverview,
    updateAssetStatus,
    spvNames,
    fetchSpvNames,
  };
};