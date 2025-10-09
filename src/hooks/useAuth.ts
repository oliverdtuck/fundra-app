import { useNavigate, useRouter } from '@tanstack/react-router';
import {
  confirmSignUp,
  type ConfirmSignUpInput,
  signIn,
  type SignInInput,
  signOut,
  signUp,
  type SignUpInput
} from 'aws-amplify/auth';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [isConfirmingSignUp, setIsConfirmingSignUp] = useState(false);
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const router = useRouter();

  return {
    confirmSignUp: async (confirmSignUpInput: ConfirmSignUpInput) => {
      try {
        setIsConfirmingSignUp(true);
        await confirmSignUp(confirmSignUpInput);
        toast.success('Account confirmed successfully! You can now log in');
        await navigate({
          to: '/log-in'
        });
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
        setIsConfirmingSignUp(false);
      }
    },
    isConfirmingSignUp,
    isSigningIn,
    isSigningUp,
    signIn: async (signInInput: SignInInput) => {
      try {
        setIsSigningIn(true);
        await signIn(signInInput);
        await router.invalidate();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
        setIsSigningIn(false);
      }
    },
    signOut: async () => {
      try {
        await signOut();
        await router.invalidate();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    },
    signUp: async (signUpInput: SignUpInput) => {
      try {
        setIsSigningUp(true);
        await signUp(signUpInput);
        toast.success(
          'Account created successfully! Please check your email for verification code'
        );

        const { username } = signUpInput;

        await navigate({
          search: {
            email: username
          },
          to: '/confirm'
        });
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      } finally {
        setIsSigningUp(false);
      }
    }
  };
};
