import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia, mainnet, sepolia } from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'CarbonChain',
  projectId: 'c108c90ea0dfb8efb4819d9b7e090df3', // standard 32-char hex placeholder for local WalletConnect v2 config
  chains: [baseSepolia, mainnet, sepolia],
  transports: {
    [mainnet.id]: http('https://cloudflare-eth.com'),
    [baseSepolia.id]: http('https://sepolia.base.org'),
    [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
  },
  ssr: false, // SPA Client-only configuration
});
