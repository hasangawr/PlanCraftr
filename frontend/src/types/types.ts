export interface EmailContextType {
  forgotPasswordEmail: string | null;
  setForgotPasswordEmail: (email: string | null) => void;
}

export interface AuthContextType {
  isLoggedIn: boolean | null;
  checkAuthStatus: () => Promise<void>;
  logout: () => void;
  checkUserVerified: (user: string) => void;
  isVerified: boolean | null;
}
