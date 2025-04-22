
/** Utility field validation used by auth forms. */
export const validateEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const validateFullName = (value: string) => value.trim().length >= 2;
