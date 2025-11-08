import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useWalletStore } from '@/stores/walletStore';
import { useEffect, useCallback } from 'react';

export const useWallet = () => {
  const { 
    address, 
    isConnected, 
    chainId, 
    status,
    connector
  } = useAccount();
  
  const { 
    connect, 
    connectors, 
    isPending, 
    error: connectError 
  } = useConnect();
  
  const { 
    disconnect: wagmiDisconnect,
    error: disconnectError 
  } = useDisconnect();
  
  const isConnecting = status === 'connecting' || isPending;
  
  const { 
    setAddress, 
    setIsConnected, 
    setChainId, 
    disconnect: storeDisconnect 
  } = useWalletStore();

  // Update store when wallet state changes
  useEffect(() => {
    console.log('Wallet state changed:', { address, isConnected, chainId, status });
    setAddress(address || null);
    setIsConnected(isConnected);
    if (chainId) {
      setChainId(chainId);
    }
  }, [address, isConnected, chainId, status, setAddress, setIsConnected, setChainId]);

  // Log connector status
  useEffect(() => {
    if (connector) {
      console.log('Active connector:', connector.name);
    }
  }, [connector]);

  // Log connection errors
  useEffect(() => {
    if (connectError) {
      console.error('Connection error:', connectError);
    }
    if (disconnectError) {
      console.error('Disconnection error:', disconnectError);
    }
  }, [connectError, disconnectError]);

  const connectWallet = useCallback(async () => {
    try {
      console.log('Available connectors:', connectors.map(c => ({ id: c.id, name: c.name })));
      const metaMaskConnector = connectors.find(c => c.id === 'metaMask' || c.name === 'MetaMask');
      
      if (!metaMaskConnector) {
        const errorMsg = 'MetaMask connector not found in available connectors';
        console.error(errorMsg, { connectors });
        throw new Error(errorMsg);
      }
      
      console.log('Initiating connection with MetaMask...');
      await connect({ 
        connector: metaMaskConnector
        // Removed hardcoded chainId: 1 to allow connection to Arbitrum Sepolia network
      });
      
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }, [connect, connectors]);

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

  const disconnect = useCallback(() => {
    console.log('Disconnecting wallet...');
    try {
      wagmiDisconnect();
      storeDisconnect();
      console.log('Wallet disconnected successfully');
    } catch (error) {
      console.error('Error during disconnection:', error);
      throw error;
    }
  }, [wagmiDisconnect, storeDisconnect]);

  return {
    address,
    isConnected,
    chainId,
    connect: connectWallet,
    disconnect,
    switchToArbitrumSepolia, // Add the new function to the return object
    isConnecting,
    error: connectError || disconnectError,
    connector: connector?.name
  };
};

// Export the hook as default for backward compatibility
export default useWallet;