import crypto from "crypto";

export const generatOTP = () => {
  return crypto.randomInt(10000, 9999999).toString();
};

export const generateSecureToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// OTP storage
const otpStore = new Map<string, { otp: string; expiresAt: Date }>();

export const storeOTP = (
  email: string,
  otp: string,
  minutesValid: number = 5,
) => {
  const expiresAt = new Date(Date.now() + minutesValid * 60 * 1000);
  otpStore.set(email, { otp, expiresAt });
};

// OTP VERIFICATION
export const verifyOTP = (email: string, otp: string) => {
  const stored = otpStore.get(email);

  if (!stored) {
    return false;
  }

  if (stored.expiresAt < new Date()) {
    otpStore.delete(email);
    return false;
  }

  const valid = stored.otp === otp;
  if (valid) {
    otpStore.delete(email);
    return valid;
  }
};


// TOKEN STORAGE
const tokenStore = new Map<string, { email: string; expiresAt: Date }>();

export const storeToken = (
  email: string,
  token: string,
  hoursValid: number = 1,
) => {
  const expiresAt = new Date(Date.now() + hoursValid * 60 * 60 * 1000);
  tokenStore.set(token, { email, expiresAt });
};

export const verifySecureToken = (token: string): string | null => {
  const stored = tokenStore.get(token);
  if (!stored) {
    return null;
  }

  if (stored.expiresAt < new Date()) {
    tokenStore.delete(token);
    return null;
  }
  const email = stored.email;
  tokenStore.delete(token);
  return email;
};


