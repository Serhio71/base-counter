'use client';

import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';

const CONTRACT_ADDRESS = '0x17Ce38B8A73e2967B2B4F458dafaA5FaD5c02590';

export default function BaseCounter() {
  const { isConnected, address } = useAccount();
  const { writeContract } = useWriteContract();
  const [count, setCount] = useState(0);
  const [isClicking, setIsClicking] = useState(false);

  // Builder Code bc_hxdiqjk1
  const BUILDER_SUFFIX = '0x' + 'bc_hxdiqjk1'.slice(3).padEnd(64, '0');

  const { data: currentCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: [{
      inputs: [{ internalType: "address", name: "player", type: "address" }],
      name: "getCurrentVibes",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function"
    }],
    functionName: 'getCurrentVibes',
    args: [address!],
    query: { enabled: !!address },
  });

  useEffect(() => {
    if (currentCount !== undefined) {
      setCount(Number(currentCount));
    }
  }, [currentCount]);

  const handleClick = () => {
    setIsClicking(true);
    
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: [{
        inputs: [],
        name: "click",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      }],
      functionName: 'click',
      dataSuffix: BUILDER_SUFFIX,
    });

    setTimeout(() => setIsClicking(false), 200);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4c1d95, #1e3a8a)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '52px', fontWeight: '900', letterSpacing: '-2px' }}>
          BASE COUNTER
        </h1>
        <p style={{ opacity: 0.8, fontSize: '20px' }}>on Base • bc_hxdiqjk1</p>
      </div>

      <ConnectButton />

      {isConnected ? (
        <div style={{ marginTop: '80px', textAlign: 'center' }}>
          <div 
            onClick={handleClick}
            style={{
              width: '380px',
              height: '380px',
              margin: '0 auto 40px',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '140px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
              cursor: 'pointer',
              border: '14px solid rgba(255,255,255,0.6)',
              transform: isClicking ? 'scale(0.92)' : 'scale(1)',
              transition: 'transform 0.1s ease'
            }}
          >
            ✨
          </div>

          <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '10px' }}>
            {count.toLocaleString()}
          </div>
          <p style={{ fontSize: '24px', opacity: 0.9 }}>Ваши клики</p>

          <p style={{ marginTop: '50px', opacity: 0.7 }}>
            Кликни по шару, чтобы увеличить счёт
          </p>
        </div>
      ) : (
        <div style={{ marginTop: '100px', textAlign: 'center' }}>
          <p style={{ fontSize: '32px' }}>Подключи MetaMask</p>
          <p style={{ fontSize: '20px', opacity: 0.8 }}>на сети Base Sepolia</p>
        </div>
      )}
    </div>
  );
}