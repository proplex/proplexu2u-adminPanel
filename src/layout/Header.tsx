import { useState, useCallback } from "react";
import { CircleUserRound, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWalletConnect } from "@/providers/Web3Provider";
import { Loader2 } from "lucide-react";
import WalletModal from "@/components/WalletModal";

function Header() {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  
  const {
    address,
    isConnected,
    chainId,
    connector,
    connect,
    disconnect,
    error,
    isConnecting,
  } = useWalletConnect();

  // Format address for display
  const formatAddress = useCallback((addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }, []);

  // Handle wallet selection - only MetaMask
  const handleSelectWallet = useCallback(async (walletId: string) => {
    try {
      setIsConnectingWallet(true);
      const result = await connect(walletId);
      
      if (result.success) {
        setIsWalletModalOpen(false);
      } else {
        console.error('Failed to connect MetaMask wallet:', result.error);
      }
    } catch (error) {
      console.error('Error connecting to MetaMask wallet:', error);
    } finally {
      setIsConnectingWallet(false);
    }
  }, [connect]);

  // Disconnect wallet handler
const handleDisconnectWallet = useCallback(async () => {
  try {
    setIsConnectingWallet(true);
    console.log('Disconnect button clicked');
    
    // Call the disconnect function from useWalletConnect
    await disconnect();
    console.log('Disconnect completed');
    
    // Small delay before reload to ensure clean state
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    setIsConnectingWallet(false);
    
    // Prompt for reload
    if (window.confirm('Failed to disconnect. Would you like to refresh the page?')) {
      window.location.reload();
    }
  }
}, [disconnect]);
  
  // Open wallet modal
  const openWalletModal = useCallback(() => {
    setIsWalletModalOpen(true);
  }, []);

  // Logout Handler: Clear Storage and Redirect
  const handleLogout = () => {
    try {
      // Disconnect wallet if connected
      if (isConnected) {
        disconnect();
      }
      // Clear auth tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // Redirect to login
      window.location.href = "/sign-in";
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <header className="flex items-center w-full justify-between p-4 bg-gray-100">
      <div>
        <img src="/proplex.png" alt="Logo" className="h-8" />
      </div>
      <div />
      <div className="flex items-center gap-4">
        {isConnected && address ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <div className="text-gray-700 font-medium">
              <span className="text-sm">Connected:</span> {formatAddress(address)}
              {connector?.name && (
                <span className="text-xs text-gray-500 ml-2">
                  ({connector.name})
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-500">Not connected</span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isConnecting}>
                  <CircleUserRound className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled className="text-xs opacity-70">
                  {address}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDisconnectWallet}
                  className="text-red-500"
                  disabled={isConnecting}
                >
                  Disconnect Wallet
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={openWalletModal}
              disabled={isConnecting || isConnectingWallet}
              className="flex items-center gap-2 min-w-[120px]"
            >
              {isConnecting || isConnectingWallet ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isConnectingWallet ? 'Connecting...' : 'Loading...'}
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </>
              )}
            </Button>
          )}
          
          {error && (
            <div className="text-red-500 text-xs max-w-[200px] truncate">
              {error.message}
            </div>
          )}
        </div>
      </div>
      <WalletModal 
        isOpen={isWalletModalOpen} 
        onClose={() => !isConnectingWallet && setIsWalletModalOpen(false)}
        onSelect={handleSelectWallet}
        isLoading={isConnectingWallet}
      />
    </header>
  );
}

export default Header;