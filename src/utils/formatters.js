/**
 * Formats a hex address to truncated form (e.g. 0x7A...92F1)
 */
export function formatAddress(address) {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Formats a number of ADG or ETH currency (e.g. 18,420 ADG)
 */
export function formatNumber(num, fractionDigits = 0) {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(num);
}

/**
 * Formats date into MMM dd, yyyy format
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }).format(date);
}
