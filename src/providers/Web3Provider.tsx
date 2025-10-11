import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http, useAccount, useConnect, useDisconnect } from 'wagmi';
import { ethers } from 'ethers';
import { mainnet, sepolia, bsc, polygon, arbitrum, optimism ,polygonAmoy} from 'wagmi/chains';
import { 
  metaMask,
} from 'wagmi/connectors';
import { ReactNode, useEffect, useCallback } from 'react';
import { Connector } from 'wagmi';

interface WalletConnectHookReturnType {
  address: string | undefined;
  isConnected: boolean;
  chainId: number | undefined;
  connector: any;
  connect: (connectorId: string) => Promise<{ success: boolean; error?: string }>;
  disconnect: () => Promise<void>;
  error: Error | null;
  isConnecting: boolean;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const WALLET_IDS = {
  METAMASK: 'metaMask',
} as const;

// List of supported chains
export const supportedChains = [mainnet, sepolia, bsc, polygon, arbitrum, optimism, polygonAmoy] as const;

// Configure RPC endpoints
export const config = createConfig({
  chains: supportedChains,
  transports: {
    [mainnet.id]: http('https://eth.llamarpc.com'),
    [sepolia.id]: http('https://rpc.sepolia.org'),
    [bsc.id]: http('https://bsc-dataseed.binance.org/'),
    [polygon.id]: http('https://polygon-rpc.com/'),
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
    [optimism.id]: http('https://mainnet.optimism.io'),
    [polygonAmoy.id]: http('https://rpc-amoy.polygon.technology/'),

  },
  connectors: [
    // MetaMask
    metaMask({
      dappMetadata: {
        name: 'Ownmali Admin',
        url: window.location.hostname,
      },
    }),
  ],
});

export function useWalletConnect(): WalletConnectHookReturnType {
  const { connect, connectors, error: connectError, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected, chainId, connector: activeConnector } = useAccount();
  
  // Only determine wallet type based on active connector
  const walletType = activeConnector?.id?.toLowerCase() || 
                   activeConnector?.name?.toLowerCase() || '';
  
  const isMetaMask = walletType.includes('metamask');
  
  const handleDisconnect = useCallback(async () => {
    try {
      console.log('Initiating wallet disconnect...');
      
      // Call wagmi's disconnect
      console.log('Disconnecting from wagmi...');
      await disconnect();
      
      // Clear wagmi's persistent storage
      if (typeof window !== 'undefined') {
        console.log('Clearing wagmi storage...');
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('wagmi.') || key.startsWith('wc@2:') || key.startsWith('walletconnect')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      console.log('Disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw error;
    }
  }, [disconnect]);
  
  // Log wallet status for debugging
  useEffect(() => {
    console.log("Wallet status:", { 
      address, 
      isConnected, 
      chainId, 
      connector: activeConnector?.name,
      connectors: connectors.map((c: any) => c.name) 
    });
  }, [address, isConnected, chainId, activeConnector, connectors]);

  const connectWallet = useCallback(async (connectorId: string) => {
    try {
      const connector = connectors.find(
        (c: Connector) => c.id === connectorId || c.name?.toLowerCase() === connectorId.toLowerCase()
      );
  
      if (!connector) {
        throw new Error(`MetaMask wallet not found`);
      }
  
      // Clear any previous connections
      if (isConnected) {
        await handleDisconnect();
        // Add a small delay to ensure proper disconnection
        await new Promise(resolve => setTimeout(resolve, 300));
      }
  
      // For MetaMask, ensure we're using the correct provider
      if (connectorId === WALLET_IDS.METAMASK) {
        if (!window.ethereum?.isMetaMask) {
          throw new Error('Please install MetaMask');
        }
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      }
  
      // Connect using the wagmi connector
      const result = await connect({ connector });
      
      // If we get here, connection was successful
      return { success: true, result };
    } catch (error) {
      console.error('Connection error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect MetaMask wallet' 
      };
    }
  }, [connect, connectors, isConnected, handleDisconnect]);

  return {
    address,
    isConnected: !!isConnected,
    chainId: chainId || undefined,
    connector: activeConnector || undefined,
    connect: connectWallet,
    disconnect: handleDisconnect,
    error: connectError || null,
    isConnecting: isPending,
  };
}

// Debug component to log connection status
function ConnectionLogger() {
  const { address, isConnected, chainId, connector } = useAccount();
  
  useEffect(() => {
    console.log('Connection status:', {
      isConnected,
      address,
      chainId,
      connector: connector?.name,
    });
  }, [address, isConnected, chainId, connector]);
  
  return null;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectionLogger />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}