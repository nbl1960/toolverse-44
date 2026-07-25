export interface PasswordOptions {
  length: number;
  useUppercase: boolean;
  useLowercase: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
}

export type PasswordStrength = "Weak" | "Fair" | "Strong" | "Very strong";

export interface PasswordResult {
  password: string;
  strength: PasswordStrength;
}
