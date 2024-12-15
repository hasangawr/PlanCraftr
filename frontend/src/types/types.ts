export interface EmailContextType {
  forgotPasswordEmail: string | null;
  setForgotPasswordEmail: (email: string | null) => void;
}
