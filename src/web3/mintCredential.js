/**
 * CarbonChain Smart Contract Integration Helpers
 */
import ESGCredentialAbi from '../contracts/ESGCredential.json';

// Deployed Soulbound ESGCredential token contract address on Base Sepolia
// This address will be updated once deployment is triggered by the user
export const ESG_CREDENTIAL_ADDRESS = '0x4132865a8D9364c527Ec94679f640Fa02616Df48';

export const esgContractConfig = {
  address: ESG_CREDENTIAL_ADDRESS,
  abi: ESGCredentialAbi,
};
