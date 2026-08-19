import { useState, useCallback } from 'react';

const NETWORK_BALANCES = {
  Ethereum: { eth: 2.48, adg: 18420 },
  Polygon: { eth: 125.4, adg: 32000 },
  Arbitrum: { eth: 8.92, adg: 21500 },
  Solana: { eth: 45.2, adg: 15400 }
};

export function useWallet() {
  const [status, setStatus] = useState('disconnected'); // disconnected, connecting, connected
  const [address, setAddress] = useState(null);
  const [network, setNetwork] = useState('Ethereum');
  const [walletType, setWalletType] = useState(null); // MetaMask, Coinbase
  const [balance, setBalance] = useState({ eth: 0, adg: 0 });

  const connect = useCallback((type = 'MetaMask') => {
    setStatus('connecting');
    setWalletType(type);
    
    // Simulate connection delay
    setTimeout(() => {
      const mockAddress = type === 'MetaMask' 
        ? '0x7A9B92c011eD25bF1c7C22eDe8110D830D1192F1'
        : '0xcB59D718c89b4f97e20340b15eef110825B92c1F';
      
      setAddress(mockAddress);
      setNetwork('Ethereum');
      setBalance(NETWORK_BALANCES['Ethereum']);
      setStatus('connected');
    }, 1500);
  }, []);

  const disconnect = useCallback(() => {
    setStatus('disconnected');
    setAddress(null);
    setWalletType(null);
    setBalance({ eth: 0, adg: 0 });
  }, []);

  const switchNetwork = useCallback((newNetwork) => {
    if (status !== 'connected') return;
    setNetwork(newNetwork);
    setBalance(NETWORK_BALANCES[newNetwork] || { eth: 0, adg: 0 });
  }, [status]);

  const deductADG = useCallback((amount) => {
    if (status !== 'connected') return false;
    if (balance.adg < amount) return false;
    
    setBalance((prev) => ({
      ...prev,
      adg: prev.adg - amount
    }));
    return true;
  }, [status, balance]);

  const deductETH = useCallback((amount) => {
    if (status !== 'connected') return false;
    if (balance.eth < amount) return false;

    setBalance((prev) => ({
      ...prev,
      eth: prev.eth - amount
    }));
    return true;
  }, [status, balance]);

  const addADG = useCallback((amount) => {
    if (status !== 'connected') return;
    setBalance((prev) => ({
      ...prev,
      adg: prev.adg + amount
    }));
  }, [status]);

  return {
    status,
    address,
    network,
    walletType,
    balance,
    connect,
    disconnect,
    switchNetwork,
    deductADG,
    deductETH,
    addADG
  };
}
