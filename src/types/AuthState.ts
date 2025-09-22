import type { AuthUser } from 'aws-amplify/auth';

export interface AuthState {
  confirmSignUp: (email: string, code: string) => Promise<void>;
  isConfirmingSignUp: boolean;
  isLoading: boolean;
  isSigningIn: boolean;
  isSigningOut: boolean;
  isSigningUp: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  user: AuthUser | null;
}
