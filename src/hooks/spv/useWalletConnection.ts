import { useCallback } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { ethers } from 'ethers';

export const useWalletConnection = () => {
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { data: walletClient } = useWalletClient();
  
  const connectorName = activeConnector?.name?.toLowerCase() || '';
  const connectorId = activeConnector?.id?.toLowerCase() || '';
  
  // Only support MetaMask
  const isMetaMaskConnected = connectorId === 'metamask' || connectorName.includes('metamask');
  
  const getProvider = useCallback(async () => {
    if (!isConnected || !address) {
      throw new Error("Please connect your MetaMask wallet first");
    }

    // Log connection info for debugging
    console.log('Wallet connection info:', {
      address,
      connectorName,
      connectorId,
      isMetaMaskConnected,
      hasWalletClient: !!walletClient,
      hasEthereum: !!(window as any).ethereum,
    });

    let provider: ethers.providers.Web3Provider;
    let signer: ethers.Signer;
    let signerAddress: string;

    try {
      // Priority 1: Use walletClient if available (most reliable)
      if (walletClient) {
        provider = new ethers.providers.Web3Provider(walletClient.transport, "any");
      } 
      // Priority 2: Use MetaMask
      else if (isMetaMaskConnected && (window as any).ethereum?.isMetaMask) {
        provider = new ethers.providers.Web3Provider((window as any).ethereum, "any");
        await provider.send("eth_requestAccounts", []);
      } 
      else {
        throw new Error("MetaMask wallet not found. Please install MetaMask.");
      }

      // Get signer and verify address
      signer = provider.getSigner();
      signerAddress = await signer.getAddress();

      // Verify the signer address matches the connected address
      if (signerAddress.toLowerCase() !== address.toLowerCase()) {
        console.error('Address mismatch:', {
          signerAddress,
          connectedAddress: address,
          connectorName,
          isMetaMask: isMetaMaskConnected
        });
        throw new Error("Wallet address mismatch. Please reconnect your MetaMask wallet.");
      }

      console.log('Wallet connection successful:', {
        signerAddress,
        connectedAddress: address,
        connectorName,
        network: await provider.getNetwork(),
        isMetaMask: isMetaMaskConnected
      });

      return { provider, signer, signerAddress };
    } catch (error) {
      console.error('Error in wallet connection:', error);
      throw error;
    }
  }, [address, isConnected, isMetaMaskConnected, walletClient, connectorName, connectorId]);

  return {
    address,
    isConnected,
    connectorName,
    connectorId,
    isMetaMaskConnected,
    getProvider
  };
};