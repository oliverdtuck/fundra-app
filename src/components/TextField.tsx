import type { ChangeEventHandler, FC } from 'react';

import { Field } from '@base-ui-components/react/field';

interface TextFieldProps {
  autoFocus?: boolean;
  label: string;
  name: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
  required?: boolean;
  type: 'email' | 'password' | 'text' | 'url';
  value?: string;
}

export const TextField: FC<TextFieldProps> = ({
  autoFocus,
  label,
  name,
  onChange,
  placeholder,
  required,
  type,
  value
}) => (
  <Field.Root className="flex flex-col gap-2" name={name}>
    <Field.Label className="text-sm">{label}</Field.Label>
    <Field.Control
      autoFocus={autoFocus}
      className="rounded-lg border border-gray-300 px-[0.9375rem] py-[0.4375rem] data-[focused]:border-black data-[focused]:ring-2 data-[focused]:ring-gray-300 data-[focused]:outline-none data-[invalid]:border-red-500 data-[invalid]:ring-2 data-[invalid]:ring-red-200"
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      type={type}
      value={value}
    />
    <Field.Error className="text-sm text-red-500" />
  </Field.Root>
);
