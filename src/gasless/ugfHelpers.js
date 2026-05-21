import { useMemo } from 'react';
import { useConnectorClient } from 'wagmi';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { encodeFunctionData } from 'viem';
import ESGCredentialAbi from '../contracts/ESGCredential.json';

/**
 * Encodes the mintCredential function call parameters into transaction data bytes using Viem.
 */
export function encodeMintData({ recipient, companyName, category, description, metric }) {
  return encodeFunctionData({
    abi: ESGCredentialAbi,
    functionName: 'mintCredential',
    args: [recipient, companyName, category, description, metric],
  });
}

/**
 * Converts a Viem Client (from Wagmi) into an ethers.js Signer.
 */
export function clientToSigner(client) {
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new BrowserProvider(transport, network);
  return new JsonRpcSigner(provider, account.address);
}

/**
 * Hook to retrieve and memoize the connected wallet client converted to an ethers.js Signer.
 */
export function useEthersSigner({ chainId } = {}) {
  const { data: client } = useConnectorClient({ chainId });
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client]);
}

/**
 * Simulates estimated gas saved calculations.
 */
export function calculateGasSaved() {
  // Returns a random but premium looking gas saving estimate for simulated UI telemetry
  return parseFloat((Math.random() * 0.45 + 0.85).toFixed(2));
}
