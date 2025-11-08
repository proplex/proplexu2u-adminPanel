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

      // Verify we're connected to the correct network (Arbitrum Sepolia)
      const network = await provider.getNetwork();
      console.log('Connected network:', network);
      
      // Arbitrum Sepolia = 421614
      if (network.chainId !== 421614) {
        console.error('Incorrect network detected:', network);
        throw new Error(`Please switch to Arbitrum Sepolia Network (ID: 421614). Currently connected to chain ID: ${network.chainId}`);
      }

      console.log('Wallet connection successful:', {
        signerAddress,
        connectedAddress: address,
        connectorName,
        network,
        isMetaMask: isMetaMaskConnected
      });

      return { provider, signer, signerAddress };
    } catch (error) {
      console.error('Error in wallet connection:', error);
      throw error;
    }
  }, [address, isConnected, isMetaMaskConnected, walletClient, connectorName, connectorId]);
  
  // Function to switch to Arbitrum Sepolia network
  const switchToArbitrumSepolia = useCallback(async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      throw new Error('MetaMask is not installed!');
    }

    try {
      // First, try to switch to Arbitrum Sepolia (421614)
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x66eee' }], // 421614 in hex
      });
      return { success: true, message: 'Switched to Arbitrum Sepolia' };
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          // Add Arbitrum Sepolia network
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x66eee', // 421614 in hex
                chainName: 'Arbitrum Sepolia',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
                blockExplorerUrls: ['https://sepolia.arbiscan.io'],
              },
            ],
          });
          return { success: true, message: 'Added and switched to Arbitrum Sepolia' };
        } catch (addError) {
          console.error('Failed to add Arbitrum Sepolia network:', addError);
          throw new Error('Failed to add Arbitrum Sepolia network. Please add it manually in MetaMask.');
        }
      } else {
        console.error('Failed to switch to Arbitrum Sepolia network:', switchError);
        throw new Error('Failed to switch to Arbitrum Sepolia network. Please switch manually in MetaMask.');
      }
    }
  }, []);

  return {
    address,
    isConnected,
    connectorName,
    connectorId,
    isMetaMaskConnected,
    getProvider,
    switchToArbitrumSepolia // Add the new function to the return object
  };
};