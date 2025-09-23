import type { FC } from 'react';

import { Field } from '@base-ui-components/react/field';

interface TextFieldProps {
  label: string;
  name: string;
  placeholder: string;
  required: boolean;
  type: 'email' | 'password' | 'text';
}

export const TextField: FC<TextFieldProps> = ({
  label,
  name,
  placeholder,
  required,
  type
}) => (
  <Field.Root className="flex flex-col gap-2" name={name}>
    <Field.Label className="text-sm">{label}</Field.Label>
    <Field.Control
      className="rounded-lg border border-gray-300 px-[0.9375rem] py-[0.4375rem] focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
      placeholder={placeholder}
      required={required}
      type={type}
    />
    <Field.Error className="text-sm text-red-500" />
  </Field.Root>
);
