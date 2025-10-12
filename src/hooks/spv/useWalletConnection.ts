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

      // Verify we're connected to the correct network (U2U testnet or mainnet)
      const network = await provider.getNetwork();
      console.log('Connected network:', network);
      
      // U2U Testnet = 2484, U2U Mainnet = 39
      if (network.chainId !== 2484 && network.chainId !== 39) {
        console.error('Incorrect network detected:', network);
        throw new Error(`Please switch to U2U Network (Testnet ID: 2484 or Mainnet ID: 39). Currently connected to chain ID: ${network.chainId}`);
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
  
  // Function to switch to U2U network
  const switchToU2UNetwork = useCallback(async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      throw new Error('MetaMask is not installed!');
    }

    try {
      // First, try to switch to U2U Testnet (2484)
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x9b4' }], // 2484 in hex
      });
      return { success: true, message: 'Switched to U2U Testnet' };
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          // Add U2U Testnet network
          await (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x9b4', // 2484 in hex
                chainName: 'U2U Nebulas Testnet',
                nativeCurrency: {
                  name: 'U2U',
                  symbol: 'U2U',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc-nebulas-testnet.u2u.xyz'],
                blockExplorerUrls: ['https://testnet.u2uscan.xyz'],
              },
            ],
          });
          return { success: true, message: 'Added and switched to U2U Testnet' };
        } catch (addError) {
          console.error('Failed to add U2U Testnet network:', addError);
          throw new Error('Failed to add U2U Testnet network. Please add it manually in MetaMask.');
        }
      } else {
        console.error('Failed to switch to U2U Testnet network:', switchError);
        throw new Error('Failed to switch to U2U Testnet network. Please switch manually in MetaMask.');
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
    switchToU2UNetwork // Add the new function to the return object
  };
};