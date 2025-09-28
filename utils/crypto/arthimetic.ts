// utils/crypto.ts
import Decimal from "decimal.js";

/**
 * Safely adds two crypto amounts with arbitrary decimal precision
 * @param a - first amount
 * @param b - second amount
 * @param asString - if true, returns string (default), otherwise number
 */
export function safeAddCrypto(
  a: number | string,
  b: number | string,
  asString = true
): string | number {
  const result = new Decimal(a).plus(new Decimal(b));
  return asString ? result.toString() : result.toNumber();
}

/**
 * You can also add safeSubtractCrypto if needed
 */
export function safeSubtractCrypto(
  a: number | string,
  b: number | string,
  asString = true
): string | number {
  const result = new Decimal(a).minus(new Decimal(b));
  return asString ? result.toString() : result.toNumber();
}
