import { useState, useTransition, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import api from "@/lib/httpClient";
import toast from "react-hot-toast";
// Changed from OwnmaliSDK to proplex functions
import { deploySPV, DeploySPVParams } from "@/lib/proplex";
import useIPFSUpload from "@/hooks/useIPFSUpload";
import { useWalletConnection } from "./useWalletConnection";

export interface SpvPayload {
  name: string;
  jurisdiction: string;
  currency: string;
  type: string;
  formationDate: string;
  businessPurpose: string;
  completedSteps: string[];
  // Legacy fields for backward compatibility
  class?: string;
  category?: string;
  stage?: string;
  style?: string;
  about?: string;
  instrumentType?: string;
}

type Status = "idle" | "loading" | "success" | "error";

export const useSpvApi = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [statusUpdate, setStatusUpdate] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [spvList, setSpvList] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [spv, setSpv] = useState<any>(null);
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  // here i m calling pinata hooks :--- JAY SHREE RAM
  const { uploadSpaFiles, loading: ipfsLoading } = useIPFSUpload();

  // Use the wallet connection hook
  const {
    address,
    isConnected,
    connectorName,
    isMetaMaskConnected,
    getProvider,
    switchToArbitrumSepolia // Add this new function
  } = useWalletConnection();

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

      // Verify we're connected to the correct network (Arbitrum Sepolia)
      const network = await provider.getNetwork();
      console.log('Connected network:', network);
      
      // Arbitrum Sepolia = 421614
      if (network.chainId !== 421614) {
        console.error('Incorrect network detected:', network);
        throw new Error(`Please switch to Arbitrum Sepolia Network (ID: 421614). Currently connected to chain ID: ${network.chainId}`);
      }

      // For proplex, we'll return the provider and signer directly
      // Log successful initialization
      console.log("Provider and signer initialized successfully:", {
        signerAddress,
        connectedAddress: address,
        connectorName,
        isMetaMask: isMetaMaskConnected,
        network
      });
      
      return { provider, signer, signerAddress };
    } catch (error) {
      console.error('Failed to initialize provider:', error);
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

  const createSpv = async (data: SpvPayload) => {
    setStatus("loading");
    setError(null);

    try {
      console.log("Creating SPV with data:", data);

      // Validate required fields
      if (!data.name) {
        throw new Error("SPV name is required");
      }

      // 1. Check wallet connection first
      if (!isConnected || !address) {
        throw new Error("Please connect your MetaMask wallet first");
      }

      // 2. Check if user is on the correct Arbitrum Sepolia network
      // Note: We can't directly access chainId here, so we'll check during provider initialization
      console.log("Wallet connected:", { address, isConnected });

      // 2. Initialize provider and signer
      console.log("Initializing provider and signer...");
      const { provider, signer } = await initializeSDK();
      console.log("Provider and signer initialized successfully");
      
      // Verify we're connected to the correct network (Arbitrum Sepolia)
      const network = await provider.getNetwork();
      console.log('Connected network:', network);
      
      // Arbitrum Sepolia = 421614
      if (network.chainId !== 421614) {
        console.error('Incorrect network detected:', network);
        throw new Error(`Please switch to Arbitrum Sepolia Network (ID: 421614). Currently connected to chain ID: ${network.chainId}`);
      }

      // 3. First create the company in our backend
      const res = await api.post("/company", {
        ...data,
      });
      console.log("res is here in web2 side :", res);
      // const companyId =  res.data.data._id;

      const spaMetadata = {
        name: data.name,
        spa_type: data.type,
        currency: data.currency,
        jurisdiction: data.jurisdiction,
        businessPurpose: data.businessPurpose,
      };

      const spvMetaCID = await uploadSpaFiles(spaMetadata);
      console.log("Metadata uploaded to IPFS:", spvMetaCID);

      // Extract the actual CID string from the response object
      const metadataCID = spvMetaCID.metadata;
      console.log("Extracted CID for blockchain:", metadataCID);

      const backendCompanyId = res.data.data._id;
      console.log("Backend company created with ID:", backendCompanyId);

      const spvName = data.name || "Unnamed SPV";

      console.log("Registering SPV on blockchain:", { spvName, metadataCID });

      // 5. Register SPV on blockchain using the new proplex deploySPV function
      const spvId = backendCompanyId; // Generate a unique SPV ID
      console.log("blockchain params is here ::", spvId, spvName,address, metadataCID);
      
      // Prepare parameters for deploySPV
      const deployParams: DeploySPVParams = {
        spvId: spvId,
        name: spvName,
        admin: address,
        metaCID: metadataCID
      };

      console.log("Calling proplex deploySPV with params:", deployParams);

      // Call the new deploySPV function from proplex.ts
      const receipt = await deploySPV(provider, deployParams);
      

      console.log("Transaction receipt:", receipt);

      // Get the SPV suite addresses from the SPVSuiteDeployed event
      // Note: The event name might be different in the new contract, let's look for the right event
      const spvSuiteDeployedEvent = receipt.events?.find(
        (e: any) => e.event === "SPVSuiteDeployed"
      ) as ethers.Event | undefined;

      // If we can't find the SPVSuiteDeployed event, let's log all events to see what we have
      if (!spvSuiteDeployedEvent) {
        console.log("All events in receipt:", receipt.events);
      }

      if (!spvSuiteDeployedEvent?.args) {
        throw new Error(
          "Failed to deploy SPV: No SPVSuiteDeployed event found"
        );
      }

      const eventArgs = spvSuiteDeployedEvent.args as any;
      const spvAddress = eventArgs.spv as string;
      const daoAddress = eventArgs.dao as string;
      const ledgerAddress = eventArgs.ledger as string;
      const idHash = eventArgs.idHash as string;

      console.log("SPV Suite deployed:", {
        spv: spvAddress,
        dao: daoAddress,
        ledger: ledgerAddress,
        idHash,
      });

      // 6. Update the company in our backend with blockchain info
      console.log("Updating company with blockchain info...");
      // First update with just the blockchain info, keep status as draft
      const updateResponse = await api.put(`/company/${backendCompanyId}`, {
        OnchainAddress: spvAddress,
        spvAddress: spvAddress,
        daoAddress: daoAddress,
        ledgerAddress: ledgerAddress,
        blockchainCompanyId: spvId,
        blockchainSpvId: spvId,
        idHash: idHash,
        walletAddress: address,
        transactionHash: receipt.transactionHash,
        metadata: metadataCID,
      });

      console.log("Company updated with blockchain info:", updateResponse.data);

      // 7. Navigate to the edit page
      navigate(`/edit-spv/${backendCompanyId}`);
      setStatus("success");
      toast.success("SPV created and deployed successfully on blockchain");

      return {
        ...res.data,
        blockchain: {
          contractAddress: spvAddress,
          spvId: backendCompanyId,
          owner: address,
        },
      };
    } catch (err: any) {
      console.error("Error creating SPV:", err);
      const errorMessage =
        err.reason ||
        err.data?.message ||
        err.response?.data?.message ||
        err.message ||
        "Failed to create SPV";

      toast.error(errorMessage);
      setStatus("error");
      setError(errorMessage);
      throw err;
    }
  };

  const getSpv = async (id: string) => {
    setStatus("loading");
    setError(null);
    try {
      const res = await api.get(`/company/${id}`);
      setStatus("success");
      setSpv(res.data.data);
      return res.data;
    } catch (err: any) {
      setStatus("error");
      toast.error(
        err.response?.data?.message || err.message || "Failed to fetch SPV"
      );
      setError(
        err.response?.data?.message || err.message || "Failed to fetch SPV"
      );
      throw err;
    }
  };

  const updateSpv = async (id: string, data: SpvPayload) => {
    setStatus("loading");
    setError(null);
    try {
      const res = await api.put(`/company/${id}`, data);

      setStatus("success");
      toast.success("SPV updated successfully");
      setSpv(res.data.data);
      return res.data;
    } catch (err: any) {
      setStatus("error");
      toast.error(
        err.response?.data?.message || err.message || "Failed to update SPV"
      );
      setError(
        err.response?.data?.message || err.message || "Failed to update SPV"
      );
      throw err;
    }
  };

  const getSpvList = async ({
    page = 1,
    limit = 10,
    status = "active",
    type,
    search,
  }: {
    page?: number;
    limit?: number;
    status?: string;
    type: string[];
    search?: string;
  }) => {
    setStatus("loading");
    setError(null);
    try {
      const params = new URLSearchParams();
      if (type) {
        type.forEach((t) => {
          params.append("type", t);
        });
      }
      if (status) {
        params.append("status", status);
      }
      if (page) {
        params.append("page", page.toString());
      }
      if (limit) {
        params.append("limit", limit.toString());
      }
      if (search) {
        params.append("search", search);
      }
      const queryString = params.toString();
      const res = await api.get(`/company/company-list?${queryString}`);

      // Enrich SPV list with complete data to ensure blockchain addresses are always visible
      const enrichedSpvs = await Promise.all(
        res.data.data.map(async (spv: any) => {
          console.log(`Fetching complete details for SPV ${spv._id}`);
          try {
            // Always fetch complete details for every SPV
            const detailRes = await api.get(`/company/${spv._id}`);
            console.log(`Complete SPV data for ${spv._id}:`, {
              hasOnchainAddress: !!detailRes.data.data.OnchainAddress,
              OnchainAddress: detailRes.data.data.OnchainAddress,
              blockchainSpvId: detailRes.data.data.blockchainSpvId,
              status: detailRes.data.data.status,
            });

            // Merge complete data with list data
            return {
              ...spv, // Keep list data as base
              ...detailRes.data.data, // Override with complete detail data
              // Ensure key fields are preserved from detail response
              OnchainAddress: detailRes.data.data.OnchainAddress,
              blockchainSpvId: detailRes.data.data.blockchainSpvId,
              status: detailRes.data.data.status,
            };
          } catch (err) {
            console.warn(`Failed to fetch details for SPV ${spv._id}:`, err);
            return spv; // Return original SPV if detail fetch fails
          }
        })
      );

      setStatus("success");
      setSpvList(enrichedSpvs);
      setPagination(res.data.pagination);
      return {
        ...res.data,
        data: enrichedSpvs,
      };
    } catch (err: any) {
      setStatus("error");
      toast.error(
        err.response?.data?.message || err.message || "Failed to fetch SPV list"
      );
      setError(
        err.response?.data?.message || err.message || "Failed to fetch SPV list"
      );
      throw err;
    }
  };

  const updateSpvStatus = async (id: string, status: string) => {
    setStatusUpdate("loading");
    setError(null);
    try {
      const res = await api.put(`/company/${id}/toggle-status`);

      console.log("SPV Status Toggle Response:", res.data);

      // Extract the company data from the response
      // The response has both top-level and nested company data
      const updatedCompany = {
        ...res.data.data.company, // Get the nested company data
        OnchainAddress: res.data.data.OnchainAddress, // Get blockchain address from top level
        blockchainSpvId: res.data.data.blockchainSpvId, // Get blockchain ID from top level
      };

      console.log("Updated Company Data:", updatedCompany);

      setSpvList((prev) =>
        prev.map((item) => {
          if (item._id === id) {
            // Merge the complete updated data
            return {
              ...item,
              ...updatedCompany,
              status: updatedCompany.status,
            };
          }
          return item;
        })
      );

      setStatusUpdate("success");
      toast.success("SPV status updated successfully");
      setSpv(updatedCompany);
      return res.data;
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to update SPV status"
      );
      setStatusUpdate("error");
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update SPV status"
      );
      throw err;
    }
  };

  return {
    createSpv,
    getSpv,
    updateSpv,
    getSpvList,
    status,
    error,
    spv,
    isPending,
    spvList,
    pagination,
    updateSpvStatus,
    statusUpdate,
    setStatusUpdate,
  };
};