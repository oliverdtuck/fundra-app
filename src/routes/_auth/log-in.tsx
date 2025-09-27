import { Form } from '@base-ui-components/react/form';
import { createFileRoute, Link } from '@tanstack/react-router';
import { type FC, type FormEventHandler, useState } from 'react';
import toast from 'react-hot-toast';
import * as z from 'zod';

import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Heading } from '../../components/Heading';
import { TextField } from '../../components/TextField';
import { useAuth } from '../../hooks/useAuth';
import { logInSchema } from '../../schemas/logInSchema';

const Component: FC = () => {
  const auth = useAuth();
  const { isSigningIn } = auth;
  const [errors, setErrors] = useState({});

  const signIn = async (email: string, password: string) => {
    try {
      await auth.signIn(email, password);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    try {
      const { email, password } = logInSchema.parse(
        Object.fromEntries(formData)
      );

      void signIn(email, password);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const { fieldErrors } = z.flattenError(error);

        setErrors(fieldErrors);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 text-center">
        <Heading level={1}>Log In</Heading>
        <p className="text-lg text-gray-500">
          Log in to your account to continue
        </p>
      </div>
      <Card>
        <Form
          className="flex flex-col gap-6"
          errors={errors}
          onClearErrors={setErrors}
          onSubmit={handleSubmit}
        >
          <TextField
            autoFocus
            label="Email"
            name="email"
            placeholder="Email"
            required
            type="email"
          />
          <TextField
            label="Password"
            name="password"
            placeholder="Password"
            required
            type="password"
          />
          <Button loading={isSigningIn} type="submit">
            Log In
          </Button>
        </Form>
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link className="text-blue-500" to="/sign-up">
            Sign Up
          </Link>
        </p>
      </Card>
    </>
  );
};

export const Route = createFileRoute('/_auth/log-in')({
  component: Component
});
