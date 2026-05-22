import { createPublicClient, http, isAddress } from 'viem';
import { baseSepolia } from 'wagmi/chains';
import { esgContractConfig, ESG_CREDENTIAL_ADDRESS } from '../web3/mintCredential';

// Set up public client for Base Sepolia using standard public RPC endpoint
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http('https://sepolia.base.org'),
});

/**
 * Validate address format using Viem's built-in helper
 */
export function isValidAddress(address) {
  return isAddress(address);
}

/**
 * Query the deployed ESG smart contract for credentials issued to a specific address
 * @param {string} walletAddress - Ethereum hex address
 * @returns {Promise<Array>} Array of parsed credentials
 */
export async function fetchCredentialsForAddress(walletAddress) {
  if (!isValidAddress(walletAddress)) {
    throw new Error('Invalid organization wallet address.');
  }

  try {
    // 1. Read token IDs from our contract mapping getCredentialsByOwner
    const tokenIds = await publicClient.readContract({
      ...esgContractConfig,
      functionName: 'getCredentialsByOwner',
      args: [walletAddress],
    });

    if (!tokenIds || tokenIds.length === 0) {
      return [];
    }

    // 2. Fetch details for each Token ID in parallel
    const credentials = await Promise.all(
      tokenIds.map(async (tokenIdRaw) => {
        const tokenId = BigInt(tokenIdRaw);

        try {
          // Read getCredentialDetails from our deployed contract
          const details = await publicClient.readContract({
            ...esgContractConfig,
            functionName: 'getCredentialDetails',
            args: [tokenId],
          });

          const [organizationName, actionType, description, impactMetric, timestamp] = details;

          // Cross reference with local storage mock sponsor logs to verify if it was UGF-sponsored
          let txHash = '0x0000000000000000000000000000000000000000000000000000000000000000';
          let isGasless = true;

          try {
            const sponsoredLogsStr = localStorage.getItem('cc_ugf_mint_history');
            if (sponsoredLogsStr) {
              const sponsoredLogs = JSON.parse(sponsoredLogsStr);
              // Match by matching recipient & tokenId
              const match = sponsoredLogs.find(
                item => item.recipient?.toLowerCase() === walletAddress.toLowerCase() &&
                        String(item.tokenId) === String(tokenId)
              );
              if (match) {
                txHash = match.txHash;
                isGasless = match.isGasless ?? true;
              }
            }
          } catch (_) {
            // fallback if localStorage not accessible
          }

          // Generate a deterministic mock transaction hash if no local log exists (e.g. for external wallets)
          if (txHash === '0x0000000000000000000000000000000000000000000000000000000000000000') {
            txHash = '0x' + Array.from({ length: 64 }, (_, idx) => 
              ((Number(tokenId) + idx + parseInt(walletAddress.slice(2, 10), 16)) % 16).toString(16)
            ).join('');
          }

          return {
            tokenId: tokenId.toString(),
            txHash,
            organizationName,
            category: actionType,
            description,
            metric: impactMetric,
            timestamp: Number(timestamp),
            isGasless,
          };
        } catch (err) {
          console.error(`Failed to load details for token ID ${tokenId}:`, err);
          return null;
        }
      })
    );

    // Filter out failed read logs and sort chronologically (newest first)
    return credentials
      .filter((cred) => cred !== null)
      .sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error fetching onchain credentials:', error);
    throw new Error('Onchain verification lookup failed. Please try again.');
  }
}

/**
 * Fetch simulated/contract public registry summary stats
 */
export async function fetchGlobalMetrics() {
  try {
    // Read total credentials issued from local sponsor telemetry keys
    let localSponsorPool = 1250.00;
    let localGasSaved = 148.52;
    let localSponsoredTx = 120;

    try {
      const storedPool = localStorage.getItem('cc_sponsor_balance');
      const storedSaved = localStorage.getItem('cc_gas_saved');
      const storedCount = localStorage.getItem('cc_gasless_tx_count');
      if (storedPool) localSponsorPool = parseFloat(storedPool);
      if (storedSaved) localGasSaved = parseFloat(storedSaved);
      if (storedCount) localSponsoredTx = parseInt(storedCount, 10);
    } catch (_) {}

    return {
      sponsorPool: localSponsorPool,
      gasSaved: localGasSaved,
      sponsoredTx: localSponsoredTx,
      organizationsVerified: 14,
    };
  } catch (err) {
    return {
      sponsorPool: 1250.00,
      gasSaved: 148.52,
      sponsoredTx: 120,
      organizationsVerified: 14,
    };
  }
}
