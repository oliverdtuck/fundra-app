import { Form } from '@base-ui-components/react/form';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { type FC, type FormEventHandler, useState } from 'react';
import * as z from 'zod';

import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Heading } from '../../components/Heading';
import { TextField } from '../../components/TextField';
import { useAuth } from '../../hooks/useAuth';
import { confirmSignUpSchema } from '../../schemas/confirmSignUpSchema';

const Component: FC = () => {
  const auth = useAuth();
  const { isConfirmingSignUp } = auth;
  const { email } = Route.useSearch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const confirmSignUp = async (code: string) => {
    await auth.confirmSignUp(email, code);
    await navigate({
      to: '/log-in'
    });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    try {
      const { code } = confirmSignUpSchema.parse(Object.fromEntries(formData));

      void confirmSignUp(code);
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
        <Heading level={1}>Confirm Sign Up</Heading>
        <p className="text-lg text-gray-500">
          Enter the code sent to your email to confirm your account
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
            label="Code"
            name="code"
            placeholder="Code"
            required
            type="text"
          />
          <Button loading={isConfirmingSignUp} type="submit">
            Confirm
          </Button>
        </Form>
      </Card>
    </>
  );
};

export const Route = createFileRoute('/_auth/confirm')({
  component: Component,
  validateSearch: z.object({
    email: z.email()
  })
});
