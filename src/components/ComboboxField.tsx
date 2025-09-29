import { Combobox } from '@base-ui-components/react/combobox';
import { Field } from '@base-ui-components/react/field';
import { Check, ChevronDown } from 'lucide-react';
import { type FC, useId } from 'react';

export interface ComboboxFieldItem {
  label: string;
  value: string;
}

interface ComboboxFieldProps {
  autoFocus?: boolean;
  inputValue?: string;
  items: ComboboxFieldItem[];
  label: string;
  name: string;
  onInputValueChange?: (value: string) => void;
  onValueChange?: (value: ComboboxFieldItem | null) => void;
  placeholder: string;
  required?: boolean;
  value?: ComboboxFieldItem | null;
}

export const ComboboxField: FC<ComboboxFieldProps> = ({
  autoFocus,
  inputValue,
  items,
  label,
  name,
  onInputValueChange,
  onValueChange,
  placeholder,
  required,
  value
}) => {
  const id = useId();

  return (
    <Field.Root className="flex flex-col gap-2">
      <label className="text-sm" htmlFor={id}>
        {label}
      </label>
      <Combobox.Root
        inputValue={inputValue}
        items={items}
        itemToStringLabel={(item: ComboboxFieldItem) => item.label}
        itemToStringValue={(item: ComboboxFieldItem) => item.value}
        name={name}
        onInputValueChange={onInputValueChange}
        onValueChange={onValueChange}
        required={required}
        value={value}
      >
        <div className="relative">
          <Combobox.Input
            autoFocus={autoFocus}
            className="w-full rounded-lg border border-gray-300 px-[0.9375rem] py-[0.4375rem] data-[focused]:border-black data-[focused]:ring-2 data-[focused]:ring-gray-300 data-[focused]:outline-none data-[invalid]:border-red-500 data-[invalid]:ring-2 data-[invalid]:ring-red-200"
            id={id}
            placeholder={placeholder}
          />
          <Combobox.Trigger className="absolute top-3 right-4 text-gray-500">
            <Combobox.Icon>
              <ChevronDown size={16} />
            </Combobox.Icon>
          </Combobox.Trigger>
        </div>
        <Combobox.Portal>
          <Combobox.Positioner sideOffset={8}>
            <Combobox.Popup className="w-[var(--anchor-width)] rounded-lg border border-gray-300 bg-white p-[0.4375rem] shadow-sm">
              <Combobox.Status />
              <Combobox.Empty>
                <p className="p-2 text-gray-500">No items found</p>
              </Combobox.Empty>
              <Combobox.List>
                {(item: ComboboxFieldItem, index: number) => (
                  <Combobox.Item
                    className="flex items-center justify-between p-2 data-[highlighted]:rounded-lg data-[highlighted]:bg-gray-100 data-[selected]:rounded-lg data-[selected]:bg-gray-100"
                    index={index}
                    key={item.value}
                    value={item}
                  >
                    <div>{item.label}</div>
                    <Combobox.ItemIndicator>
                      <Check size={16} />
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
      <Field.Error className="text-sm text-red-500" />
    </Field.Root>
  );
};
