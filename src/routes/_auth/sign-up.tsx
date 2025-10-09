import { Form } from '@base-ui-components/react/form';
import { createFileRoute, Link } from '@tanstack/react-router';
import { type FC, type FormEventHandler, useState } from 'react';
import * as z from 'zod';

import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Heading } from '../../components/Heading';
import { TextField } from '../../components/TextField';
import { useAuth } from '../../hooks/useAuth';
import { signUpSchema } from '../../schemas/signUpSchema';

const Component: FC = () => {
  const { isSigningUp, signUp } = useAuth();
  const [errors, setErrors] = useState({});

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    try {
      const { email, name, password } = signUpSchema.parse(
        Object.fromEntries(formData)
      );

      void signUp({
        options: {
          userAttributes: {
            name
          }
        },
        password,
        username: email
      });
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
        <Heading level={1}>Sign Up</Heading>
        <p className="text-lg text-gray-500">Create an account to continue</p>
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
            label="Name"
            name="name"
            placeholder="Name"
            required
            type="text"
          />
          <TextField
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
          <Button loading={isSigningUp} type="submit">
            Sign Up
          </Button>
        </Form>
        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link className="text-blue-500" to="/log-in">
            Log In
          </Link>
        </p>
      </Card>
    </>
  );
};

export const Route = createFileRoute('/_auth/sign-up')({
  component: Component
});
