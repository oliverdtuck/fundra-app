import { Form } from '@base-ui-components/react/form';
import { createFileRoute, Link } from '@tanstack/react-router';
import { type FC, type FormEventHandler, useState } from 'react';
import * as z from 'zod';

import { Button } from '../../components/Button';
import { Heading } from '../../components/Heading';
import { TextField } from '../../components/TextField';
import { useAuth } from '../../hooks/useAuth';

const schema = z.object({
  email: z.email(),
  password: z.string()
});

const Component: FC = () => {
  const { signIn } = useAuth();
  const [errors, setErrors] = useState({});

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    try {
      const { email, password } = schema.parse(Object.fromEntries(formData));

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
      <div className="flex flex-col items-center gap-2">
        <Heading level={1}>Log In</Heading>
        <p className="text-lg text-gray-500">
          Log in to your account to continue
        </p>
      </div>
      <div className="flex flex-col gap-6 rounded-lg border border-gray-300 bg-white p-[1.9375rem]">
        <Form
          className="flex flex-col gap-6"
          errors={errors}
          onClearErrors={setErrors}
          onSubmit={handleSubmit}
        >
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
          <Button type="submit">Log In</Button>
        </Form>
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link className="text-blue-500" to="/sign-up">
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
};

export const Route = createFileRoute('/_auth/log-in')({
  component: Component
});
