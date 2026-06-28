export const MAX_DEPOSIT_XP = 500;

/** 5 XP per dollar deposited, capped at 500 XP. */
export function getDepositXp(amount: number): number {
  return Math.min(MAX_DEPOSIT_XP, Math.round(amount * 5));
}
