/**
 * CarbonChain Blockchain Utility Helpers
 */

/**
 * Shorten an Ethereum address for frontend rendering (e.g. 0x1234...abcd)
 * @param {string} address - Hex-encoded Ethereum address
 * @returns {string} Shortened address
 */
export function shortenAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Get the Basescan explorer URL for a given transaction hash
 * @param {string} txHash - Transaction hash
 * @returns {string} URL string
 */
export function getTxExplorerUrl(txHash) {
  if (!txHash) return '#';
  return `https://sepolia.basescan.org/tx/${txHash}`;
}

/**
 * Get the Basescan explorer URL for a Soulbound ESG token ID
 * @param {string} contractAddress - Deployed token contract address
 * @param {string|number} tokenId - Credential Token ID
 * @returns {string} URL string
 */
export function getTokenExplorerUrl(contractAddress, tokenId) {
  if (!contractAddress || tokenId === undefined) return '#';
  return `https://sepolia.basescan.org/token/${contractAddress}?a=${tokenId}`;
}
