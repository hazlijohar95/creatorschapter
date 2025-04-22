
/**
 * Returns an object indicating validity and a message about password strength.
 * Basic requirements: min 8 chars, at least 1 number, 1 uppercase, 1 lowercase.
 */
export function validatePasswordStrength(password: string) {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!minLength)
    return { valid: false, message: "Password must be at least 8 characters." };
  if (!hasUpper)
    return { valid: false, message: "Include at least 1 uppercase letter." };
  if (!hasLower)
    return { valid: false, message: "Include at least 1 lowercase letter." };
  if (!hasNumber)
    return { valid: false, message: "Include at least 1 number." };

  return { valid: true, message: "" };
}
