// Ontario HST. Applied to (subtotal - discount + shipping), matching CRA
// guidance that shipping charges bundled with taxable goods are taxable
// at the same rate as the goods themselves.
export const HST_RATE = 0.13;

export function calculateHst(taxableAmount: number): number {
  return Math.round(taxableAmount * HST_RATE * 100) / 100;
}
