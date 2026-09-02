import React, { createContext, useContext, useState, useEffect } from 'react';
import { EIP6963ProviderDetail } from '../types';

interface WalletContextType {
  address: string | null;
  provider: any | null;
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
  switchChain: (providerInstance?: any) => Promise<void>;
}

const STUDIONET_CHAIN_ID = '0xf1ef'; // 61999 in hex (Studionet)

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<any | null>(null);
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
    const p = providerInstance || provider || (typeof window !== 'undefined' ? (window as any).ethereum : null);
    if (!p || typeof p.request !== 'function') return;
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
          console.error('Failed to add Studionet chain to wallet:', addError);
        }
      }
    }
  };

  const connectWallet = async (detail?: EIP6963ProviderDetail) => {
    setIsConnecting(true);
    try {
      let selectedP = detail?.provider;
      let name = detail?.info?.name || 'Injected Wallet';

      if (!selectedP && typeof window !== 'undefined' && (window as any).ethereum) {
        selectedP = (window as any).ethereum;
        name = 'Browser Injected (MetaMask/OKX/Rabby)';
      }

      if (!selectedP) {
        // Fallback demo account if no browser extension is present
        const demoAddr = '0x71C83637e127394E9684C558F2e68449D0d7b21e';
        setAddress(demoAddr);
        setProvider(null);
        setSelectedProviderName('Demo Session (No Injected Wallet)');
        setChainId(STUDIONET_CHAIN_ID);
        setIsModalOpen(false);
        setIsConnecting(false);
        return;
      }

      const accounts = await selectedP.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setProvider(selectedP);
        setSelectedProviderName(name);
        await switchChain(selectedP);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.warn('Wallet connection note:', err);
      // Demo session fallback
      setAddress('0x71C83637e127394E9684C558F2e68449D0d7b21e');
      setProvider(null);
      setSelectedProviderName('Demo Session');
      setChainId(STUDIONET_CHAIN_ID);
      setIsModalOpen(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setProvider(null);
    setSelectedProviderName(null);
    setIsAccountDrawerOpen(false);
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        provider,
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
