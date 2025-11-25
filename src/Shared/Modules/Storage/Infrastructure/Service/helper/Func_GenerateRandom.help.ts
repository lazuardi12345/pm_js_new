export function generateRandomFolder(): string {
  // Generate random 6 char alphanumeric (misal: GH871S, KLL891)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ro-${result}`;
}
