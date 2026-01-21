// Format numbers to K/M/B (e.g., 1.2K, 3.4M, 5.6B)
export function formatNumberShort(n: number): string {
  if (n === null || n === undefined) return '0';
  if (Math.abs(n) >= 1_000_000_000)
    return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  if (Math.abs(n) >= 1_000_000)
    return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (Math.abs(n) >= 1_000)
    return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
}
