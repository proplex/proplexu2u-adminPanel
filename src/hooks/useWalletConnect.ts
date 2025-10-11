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
        connector: metaMaskConnector,
        chainId: 1 // Optional: Force mainnet
      });
      
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }, [connect, connectors]);

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
    isConnecting,
    error: connectError || disconnectError,
    connector: connector?.name
  };
};

// Export the hook as default for backward compatibility
export default useWallet;
