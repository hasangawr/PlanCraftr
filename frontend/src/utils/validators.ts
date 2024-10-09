export const emailValidator = (value: string): string | boolean => {
  if (!/^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/.test(value))
    return 'Invalid email address';
  return false;
};

export const passwordValidator = (password: string): string | boolean => {
  const minLength = 6;
  const hasNumber = /\d/.test(password);

  if (password.length < minLength) {
    console.log('test git hooks'); //reomve
    return `Password must be at least ${minLength} characters long`;
  }

  if (!hasNumber) {
    return 'Password must contain at least one number';
  }

  return false;
};
