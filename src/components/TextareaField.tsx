import type { ChangeEventHandler } from 'react';

import { Field } from '@base-ui-components/react/field';

interface TextareaFieldProps {
  label: string;
  name: string;
  onChange?: ChangeEventHandler;
  placeholder: string;
  required?: boolean;
  value?: string;
}

export const TextareaField = ({
  label,
  name,
  onChange,
  placeholder,
  required,
  value
}: TextareaFieldProps) => (
  <Field.Root className="flex flex-col gap-2" name={name}>
    <Field.Label className="text-sm">{label}</Field.Label>
    <Field.Control
      className="rounded-lg border border-gray-300 px-[0.9375rem] py-[0.4375rem] data-[focused]:border-black data-[focused]:ring-2 data-[focused]:ring-gray-300 data-[focused]:outline-none data-[invalid]:border-red-500 data-[invalid]:ring-2 data-[invalid]:ring-red-200"
      onChange={onChange}
      placeholder={placeholder}
      render={(props) => <textarea {...props} rows={4} />}
      required={required}
      value={value}
    />
    <Field.Error className="text-sm text-red-500" />
  </Field.Root>
);
