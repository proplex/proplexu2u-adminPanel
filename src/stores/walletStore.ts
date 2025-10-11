import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';

type WalletState = {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  balance: string;
  setAddress: (address: string | null) => void;
  setIsConnected: (isConnected: boolean) => void;
  setChainId: (chainId: number | null) => void;
  updateBalance: (newBalance: string) => void;
  disconnect: () => void;
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      address: null,
      isConnected: false,
      chainId: null,
      balance: '0',
      setAddress: (address) => set({ address }),
      setIsConnected: (isConnected) => set({ isConnected }),
      setChainId: (chainId) => set({ chainId }),
      updateBalance: (balance) => set({ balance }),
      disconnect: () => set({ 
        address: null, 
        isConnected: false, 
        chainId: null, 
        balance: '0' 
      }),
    }),
    {
      name: 'wallet-storage',
      storage: {
        getItem: (name: string) => {
          const str = sessionStorage.getItem(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name: string, value: unknown) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name: string) => {
          sessionStorage.removeItem(name);
        },
      } as PersistStorage<WalletState>
    }
  )
);

// Helper hook to get the wallet store state
export const useWallet = () => {
  const { 
    address, 
    isConnected, 
    chainId, 
    balance,
    setAddress,
    setIsConnected,
    setChainId,
    updateBalance,
    disconnect 
  } = useWalletStore();

  return {
    address,
    isConnected,
    chainId,
    balance,
    setAddress,
    setIsConnected,
    setChainId,
    updateBalance,
    disconnect,
    shortAddress: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '',
  };
};
