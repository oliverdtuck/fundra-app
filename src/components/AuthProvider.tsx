import {
  type AuthUser,
  confirmSignUp,
  getCurrentUser,
  signIn,
  signOut,
  signUp
} from 'aws-amplify/auth';
import {
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

import type { AuthState } from '../types/AuthState';

import { AuthContext } from '../contexts/AuthContext';
import { Loader } from './Loader';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [isConfirmingSignUp, setIsConfirmingSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();

      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void checkAuthState();
  }, []);

  const handleConfirmSignUp = useCallback(
    async (email: string, confirmationCode: string) => {
      try {
        setIsConfirmingSignUp(true);
        await confirmSignUp({
          confirmationCode,
          username: email
        });
      } finally {
        setIsConfirmingSignUp(false);
      }
    },
    []
  );

  const handleSignIn = useCallback(async (email: string, password: string) => {
    try {
      setIsSigningIn(true);
      await signIn({
        password,
        username: email
      });
      await checkAuthState();
    } finally {
      setIsSigningIn(false);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
    setUser(null);
  }, []);

  const handleSignUp = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        setIsSigningUp(true);
        await signUp({
          options: {
            userAttributes: {
              email,
              name
            }
          },
          password,
          username: email
        });
      } finally {
        setIsSigningUp(false);
      }
    },
    []
  );

  const value = useMemo<AuthState>(
    () => ({
      confirmSignUp: handleConfirmSignUp,
      isConfirmingSignUp,
      isLoading,
      isSigningIn,
      isSigningOut,
      isSigningUp,
      signIn: handleSignIn,
      signOut: handleSignOut,
      signUp: handleSignUp,
      user
    }),
    [
      handleConfirmSignUp,
      handleSignIn,
      handleSignOut,
      handleSignUp,
      isConfirmingSignUp,
      isLoading,
      isSigningIn,
      isSigningOut,
      isSigningUp,
      user
    ]
  );

  if (isLoading) {
    return <Loader />;
  }

  return <AuthContext value={value}>{children}</AuthContext>;
};
