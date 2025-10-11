import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/useWalletConnect';
import { Loader2 } from 'lucide-react';

export function WalletConnectButton() {
  const { 
    address, 
    isConnected, 
    connect, 
    disconnect, 
    isConnecting
  } = useWallet();

  if (isConnecting) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </span>
        <Button variant="outline" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={() => connect()}>
      Connect Wallet
    </Button>
  );
}
