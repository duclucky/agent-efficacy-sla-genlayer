import React, { createContext, useContext, useState, useEffect } from 'react';
import { EIP6963ProviderDetail } from '../types';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  selectedProviderName: string | null;
  availableProviders: EIP6963ProviderDetail[];
  isModalOpen: boolean;
  isAccountDrawerOpen: boolean;
  isConnecting: boolean;
  chainId: string | null;
  openWalletModal: () => void;
  closeWalletModal: () => void;
  openAccountDrawer: () => void;
  closeAccountDrawer: () => void;
  connectWallet: (detail?: EIP6963ProviderDetail) => Promise<void>;
  disconnectWallet: () => void;
  switchChain: () => Promise<void>;
}

const STUDIONET_CHAIN_ID = '0xf1ef'; // 61999 in hex

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [selectedProviderName, setSelectedProviderName] = useState<string | null>(null);
  const [availableProviders, setAvailableProviders] = useState<EIP6963ProviderDetail[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<string | null>(null);

  // EIP-6963 event listener
  useEffect(() => {
    const handleAnnounceProvider = (event: any) => {
      const detail: EIP6963ProviderDetail = event.detail;
      if (detail && detail.info && detail.provider) {
        setAvailableProviders((prev) => {
          if (prev.some((p) => p.info.uuid === detail.info.uuid)) {
            return prev;
          }
          return [...prev, detail];
        });
      }
    };

    window.addEventListener('eip6963:announceProvider', handleAnnounceProvider);
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    return () => {
      window.removeEventListener('eip6963:announceProvider', handleAnnounceProvider);
    };
  }, []);

  const openWalletModal = () => setIsModalOpen(true);
  const closeWalletModal = () => setIsModalOpen(false);
  const openAccountDrawer = () => setIsAccountDrawerOpen(true);
  const closeAccountDrawer = () => setIsAccountDrawerOpen(false);

  const switchChain = async (providerInstance?: any) => {
    const p = providerInstance || (window as any).ethereum;
    if (!p) return;
    try {
      await p.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: STUDIONET_CHAIN_ID }],
      });
      setChainId(STUDIONET_CHAIN_ID);
    } catch (switchError: any) {
      if (switchError.code === 4902 || switchError.code === -32603) {
        try {
          await p.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: STUDIONET_CHAIN_ID,
                chainName: 'GenLayer Studionet',
                nativeCurrency: {
                  name: 'GEN',
                  symbol: 'GEN',
                  decimals: 18,
                },
                rpcUrls: ['https://studio.genlayer.com/api'],
                blockExplorerUrls: ['https://explorer-studio.genlayer.com'],
              },
            ],
          });
          setChainId(STUDIONET_CHAIN_ID);
        } catch (addError) {
          console.error('Failed to add Studionet chain:', addError);
        }
      }
    }
  };

  const connectWallet = async (detail?: EIP6963ProviderDetail) => {
    setIsConnecting(true);
    try {
      let provider = detail?.provider;
      let name = detail?.info?.name || 'Injected Wallet';

      if (!provider && typeof window !== 'undefined' && (window as any).ethereum) {
        provider = (window as any).ethereum;
        name = 'Browser Injected (MetaMask/OKX/Rabby)';
      }

      if (!provider) {
        // Fallback demo account if no browser extension is detected
        const demoAddr = '0x71C83637e127394E9684C558F2e68449D0d7b21e';
        setAddress(demoAddr);
        setSelectedProviderName('Simulated Web3 Session');
        setChainId(STUDIONET_CHAIN_ID);
        setIsModalOpen(false);
        setIsConnecting(false);
        return;
      }

      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setSelectedProviderName(name);
        await switchChain(provider);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.warn('Wallet connection note:', err);
      // Demo fallback on user rejection
      setAddress('0x71C83637e127394E9684C558F2e68449D0d7b21e');
      setSelectedProviderName('Demo Connected');
      setChainId(STUDIONET_CHAIN_ID);
      setIsModalOpen(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setSelectedProviderName(null);
    setIsAccountDrawerOpen(false);
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        selectedProviderName,
        availableProviders,
        isModalOpen,
        isAccountDrawerOpen,
        isConnecting,
        chainId,
        openWalletModal,
        closeWalletModal,
        openAccountDrawer,
        closeAccountDrawer,
        connectWallet,
        disconnectWallet,
        switchChain,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
