const SPONSOR_BALANCE_KEY = 'cc_sponsor_balance';
const GAS_SAVED_KEY = 'cc_gas_saved';
const GASLESS_TX_COUNT_KEY = 'cc_gasless_tx_count';
const TELEMETRY_LOGS_KEY = 'cc_telemetry_logs';

const INITIAL_LOGS = [
  `[UGF-CONSENSUS] Active sponsorship pipeline initialized on Base Sepolia`,
  `[UGF-RELAY] Spawning gas sponsor pool: $1,250.00 USD provisioned`,
  `[UGF-ACCOUNTING] Active gas efficiency rating: 99.4%`,
  `[UGF-ROUTING] Live relay status: ONLINE (Latency: 14ms)`
];

/**
 * Gets the current telemetry metrics from localStorage or defaults.
 */
export function getTelemetryMetrics() {
  const balance = localStorage.getItem(SPONSOR_BALANCE_KEY) || '1250.00';
  const gasSaved = localStorage.getItem(GAS_SAVED_KEY) || '148.52';
  const txCount = localStorage.getItem(GASLESS_TX_COUNT_KEY) || '120';
  
  let logs = [];
  try {
    logs = JSON.parse(localStorage.getItem(TELEMETRY_LOGS_KEY) || '[]');
  } catch (e) {
    logs = [];
  }
  if (logs.length === 0) {
    logs = [...INITIAL_LOGS];
    localStorage.setItem(TELEMETRY_LOGS_KEY, JSON.stringify(logs));
  }
  
  return {
    sponsorBalance: parseFloat(balance),
    totalGasSaved: parseFloat(gasSaved),
    gaslessTxCount: parseInt(txCount, 10),
    logs
  };
}

/**
 * Updates telemetry metrics and pushes logs to localStorage.
 */
export function recordGaslessMint({ txHash, tokenId }) {
  const metrics = getTelemetryMetrics();
  
  const nextBalance = Math.max(0, metrics.sponsorBalance - 0.05).toFixed(2);
  const nextGasSaved = (metrics.totalGasSaved + 1.24).toFixed(2);
  const nextTxCount = metrics.gaslessTxCount + 1;
  
  const shortHash = txHash ? `${txHash.slice(0, 10)}...` : '0x...';
  const newLogs = [
    `[UGF-QUOTE] Generated quote for mint: 0.05 Mock USD`,
    `[UGF-SPONSOR] Relayer signature secured for digest ${shortHash}`,
    `[UGF-BROADCAST] Tx pushed to Base Sepolia (Token ID #${tokenId}): hash ${shortHash}`,
    `[UGF-SETTLED] Sponsored 0.0003 ETH gas. Settled via UGF contract relayer.`,
    ...metrics.logs
  ].slice(0, 40); // Keep last 40 logs
  
  localStorage.setItem(SPONSOR_BALANCE_KEY, nextBalance);
  localStorage.setItem(GAS_SAVED_KEY, nextGasSaved);
  localStorage.setItem(GASLESS_TX_COUNT_KEY, nextTxCount.toString());
  localStorage.setItem(TELEMETRY_LOGS_KEY, JSON.stringify(newLogs));
  
  // Dispatch custom window event so listeners update immediately
  window.dispatchEvent(new Event('cc-telemetry-update'));
}

/**
 * Triggers a custom log line to append live telemetry simulation records.
 */
export function appendTelemetryLog(logMessage) {
  const metrics = getTelemetryMetrics();
  const nextLogs = [logMessage, ...metrics.logs].slice(0, 40);
  localStorage.setItem(TELEMETRY_LOGS_KEY, JSON.stringify(nextLogs));
  window.dispatchEvent(new Event('cc-telemetry-update'));
}
