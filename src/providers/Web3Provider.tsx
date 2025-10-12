import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http, useAccount, useConnect, useDisconnect } from 'wagmi';
import { ethers } from 'ethers';
import { 
  metaMask,
} from 'wagmi/connectors';
import { ReactNode, useEffect, useCallback } from 'react';
import { Connector } from 'wagmi';

// Define U2U testnet chain
const u2uTestnet = {
  id: 2484,
  name: 'U2U Nebulas Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'U2U',
    symbol: 'U2U',
  },
  rpcUrls: {
    default: { http: ['https://rpc-nebulas-testnet.u2u.xyz'] },
  },
  blockExplorers: {
    default: { name: 'U2U Explorer', url: 'https://testnet.u2uscan.xyz' },
  },
  testnet: true,
} as const;

// Define U2U mainnet chain
const u2uMainnet = {
  id: 39,
  name: 'U2U Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'U2U',
    symbol: 'U2U',
  },
  rpcUrls: {
    default: { http: ['https://rpc-mainnet.u2u.xyz'] },
  },
  blockExplorers: {
    default: { name: 'U2U Explorer', url: 'https://u2uscan.xyz' },
  },
  testnet: false,
} as const;

interface WalletConnectHookReturnType {
  address: string | undefined;
  isConnected: boolean;
  chainId: number | undefined;
  connector: any;
  connect: (connectorId: string) => Promise<{ success: boolean; error?: string }>;
  disconnect: () => Promise<void>;
  switchToU2UNetwork: () => Promise<{ success: boolean; message: string }>;
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

// List of supported chains - only U2U chains
export const supportedChains = [u2uTestnet, u2uMainnet] as const;

// Configure RPC endpoints - only U2U RPC endpoints
export const config = createConfig({
  chains: supportedChains,
  transports: {
    [u2uTestnet.id]: http('https://rpc-nebulas-testnet.u2u.xyz'), // U2U Testnet RPC endpoint
    [u2uMainnet.id]: http('https://rpc-mainnet.u2u.xyz'), // U2U Mainnet RPC endpoint
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
  
  // Function to switch to U2U network
  const switchToU2UNetwork = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask is not installed!');
    }

    try {
      // First, try to switch to U2U Testnet (2484)
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x9b4' }], // 2484 in hex
      });
      return { success: true, message: 'Switched to U2U Testnet' };
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          // Add U2U Testnet network
          await window.ethereum.request({
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
    switchToU2UNetwork, // Add the new function to the return object
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
      // Add more detailed network information
      isU2UNetwork: chainId === 2484 || chainId === 39,
      networkName: chainId === 2484 ? 'U2U Nebulas Testnet' : 
                  chainId === 39 ? 'U2U Mainnet' : 
                  chainId === 1 ? 'Ethereum Mainnet' : 
                  chainId === 137 ? 'Polygon Mainnet' : 
                  chainId === 80001 ? 'Polygon Mumbai Testnet' : 
                  chainId === 80002 ? 'Polygon Amoy Testnet' : 
                  `Unknown Network (${chainId})`
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