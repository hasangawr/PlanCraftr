export const emailValidator = (value: string): string | boolean => {
  if (!/^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/.test(value))
    return 'Invalid email address';
  return false;
};

export const passwordValidator = (password: string): string | boolean => {
  const minLength = 6;
  const hasNumber = /\d/.test(password);

  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters long`;
  }

  if (!hasNumber) {
    return 'Password must contain at least one number';
  }

  return false;
};

export const nonEmptyValidator = (value: string): string | boolean => {
  return value.length === 0 ? 'Password is required' : '';
};

export const nameValidator = (name: string): string | boolean => {
  const minLength = 2;
  const trimmedName = name.trim();

  if (trimmedName.length < minLength) {
    return `Name must be at least ${minLength} characters long`;
  }

  return false;
};
