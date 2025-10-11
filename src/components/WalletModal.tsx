import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, X, Loader2, ExternalLink } from "lucide-react";
import { WALLET_IDS } from "@/providers/Web3Provider";
import { Connector } from 'wagmi';
import { useState, useEffect } from 'react';

interface WalletIcon {
  src: string;
  alt: string;
  className?: string;
}

type WalletConnector = {
  id: string;
  name: string;
  icon: WalletIcon;
  connector: Connector;
};

// Simple component to render wallet icons with fallback
const WalletIcon = ({ src, alt, className = '' }: { src: string; alt: string; className?: string }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Preload image
    const img = new window.Image();
    img.src = src;
    img.onload = () => setIsLoading(false);
    img.onerror = () => {
      // Fallback to a simple wallet icon if image fails to load
      setImgSrc('');
      setIsLoading(false);
    };
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (isLoading) {
    return <div className={`w-6 h-6 animate-pulse bg-gray-200 rounded ${className}`} />;
  }

  if (!imgSrc) {
    return <Wallet className={`w-5 h-5 text-gray-400 ${className}`} />;
  }

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={`w-6 h-6 object-contain ${className}`}
      onError={() => setImgSrc('')}
    />
  );
};

type WalletConfig = {
  name: string;
  icon: WalletIcon;
};

type WalletConfigs = {
  [key: string]: WalletConfig;
};

// Only support MetaMask
const WALLET_CONFIGS: WalletConfigs = {
  [WALLET_IDS.METAMASK]: {
    name: 'MetaMask',
    icon: {
      src: 'https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/SVG_MetaMask_Horizontal_Color.svg',
      alt: 'MetaMask',
      className: 'h-6 w-auto'
    }
  }
} as const;


interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (walletId: string) => void;
  isLoading?: boolean;
}

function WalletModal({ isOpen, onClose, onSelect, isLoading }: WalletModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Connect Wallet</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-gray-500 text-center">
            Connect your MetaMask wallet to the application.
          </p>
          
          <div className="space-y-3">
            <Button
              key={WALLET_IDS.METAMASK}
              variant="outline"
              className="w-full justify-start gap-3 h-14 hover:bg-gray-50 transition-colors"
              onClick={() => onSelect(WALLET_IDS.METAMASK)}
              disabled={isLoading}
            >
              <WalletIcon {...WALLET_CONFIGS[WALLET_IDS.METAMASK].icon} />
              <span className="font-medium">{WALLET_CONFIGS[WALLET_IDS.METAMASK].name}</span>
              {isLoading && (
                <Loader2 className="ml-auto h-4 w-4 animate-spin" />
              )}
            </Button>
          </div>
          
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>By connecting your wallet, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </p>
            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400">
              <ExternalLink className="h-3 w-3" />
              <span>Learn how we manage your data</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default WalletModal;