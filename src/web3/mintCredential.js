/**
 * CarbonChain Smart Contract Integration Helpers
 */
import ESGCredentialAbi from '../contracts/ESGCredential.json';

// Deployed Soulbound ESGCredential token contract address on Base Sepolia
// This address will be updated once deployment is triggered by the user
export const ESG_CREDENTIAL_ADDRESS = '0x1B2b51FA4942F595b894AA54F0f8c25816500b0F';

export const esgContractConfig = {
  address: ESG_CREDENTIAL_ADDRESS,
  abi: ESGCredentialAbi,
};
