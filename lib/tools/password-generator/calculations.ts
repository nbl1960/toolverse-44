import type { PasswordOptions, PasswordResult, PasswordStrength } from "./types";

const UPPERCASE = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // no I/O to avoid visual ambiguity
const LOWERCASE = "abcdefghijkmnpqrstuvwxyz"; // no l/o
const NUMBERS = "23456789"; // no 0/1
const SYMBOLS = "!@#$%^&*()-_=+[]{}";

/**
 * Generates a password using the browser's cryptographically secure RNG
 * (crypto.getRandomValues), not Math.random() — Math.random() is not
 * suitable for anything security-relevant, and a password generator is
 * exactly that. Excludes visually ambiguous characters (0/O, 1/l/I) by
 * default for readability.
 */
export function generatePassword(options: PasswordOptions): PasswordResult | null {
  const pools: string[] = [];
  if (options.useUppercase) pools.push(UPPERCASE);
  if (options.useLowercase) pools.push(LOWERCASE);
  if (options.useNumbers) pools.push(NUMBERS);
  if (options.useSymbols) pools.push(SYMBOLS);

  if (pools.length === 0) return null;

  const fullPool = pools.join("");
  const randomValues = new Uint32Array(options.length);
  crypto.getRandomValues(randomValues);

  // Guarantee at least one character from each selected pool, then fill
  // the rest randomly, then shuffle — avoids the common bug where a
  // long password could theoretically miss a required character class.
  const passwordChars: string[] = pools.map((pool, i) => {
    const idx = randomValues[i % randomValues.length]! % pool.length;
    return pool[idx]!;
  });

  for (let i = passwordChars.length; i < options.length; i++) {
    const idx = randomValues[i]! % fullPool.length;
    passwordChars.push(fullPool[idx]!);
  }

  // Fisher-Yates shuffle using fresh crypto-random values.
  const shuffleValues = new Uint32Array(passwordChars.length);
  crypto.getRandomValues(shuffleValues);
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = shuffleValues[i]! % (i + 1);
    const temp = passwordChars[i]!;
    passwordChars[i] = passwordChars[j]!;
    passwordChars[j] = temp;
  }

  const password = passwordChars.slice(0, options.length).join("");
  return { password, strength: rateStrength(options) };
}

function rateStrength(options: PasswordOptions): PasswordStrength {
  const poolCount = [options.useUppercase, options.useLowercase, options.useNumbers, options.useSymbols].filter(
    Boolean
  ).length;

  if (options.length < 8 || poolCount <= 1) return "Weak";
  if (options.length < 12 || poolCount === 2) return "Fair";
  if (options.length < 16 || poolCount === 3) return "Strong";
  return "Very strong";
}
