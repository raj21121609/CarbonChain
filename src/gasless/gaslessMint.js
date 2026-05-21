import { ESG_CREDENTIAL_ADDRESS, esgContractConfig } from '../web3/mintCredential';
import { encodeMintData } from './ugfHelpers';

/**
 * Executes a standard mint transaction requiring user-paid native gas (ETH).
 * Uses Wagmi v2 writeContractAsync method.
 */
export async function standardMintCredential(writeContractAsync, { recipient, companyName, category, description, metric }) {
  return writeContractAsync({
    ...esgContractConfig,
    functionName: 'mintCredential',
    args: [recipient, companyName, category, description, metric]
  });
}

/**
 * Prepares the parameter inputs and calls the UGF modal to execute a sponsored gasless transaction.
 * Requires an ethers.js signer.
 */
export async function gaslessMintCredential({ openUGF, signer, recipient, companyName, category, description, metric }) {
  const data = encodeMintData({ recipient, companyName, category, description, metric });
  
  return openUGF({
    signer,
    tx: {
      to: ESG_CREDENTIAL_ADDRESS,
      data,
      value: 0n // Minting credentials is a non-value-transfer transaction
    },
    destChainId: '84532' // Base Sepolia testnet ID
  });
}
