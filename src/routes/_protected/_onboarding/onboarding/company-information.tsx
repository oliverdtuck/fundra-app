import { Form } from '@base-ui-components/react/form';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import {
  type ChangeEventHandler,
  type FC,
  type FormEventHandler,
  useMemo,
  useState
} from 'react';
import * as z from 'zod';

import { Button } from '../../../../components/Button';
import { Card } from '../../../../components/Card';
import {
  ComboboxField,
  type ComboboxFieldItem
} from '../../../../components/ComboboxField';
import { Heading } from '../../../../components/Heading';
import { Spinner } from '../../../../components/Spinner';
import { TextField } from '../../../../components/TextField';
import { useCompaniesSuspenseQuery } from '../../../../hooks/useCompaniesSuspenseQuery';
import {
  countriesSuspenseQueryOptions,
  useCountriesSuspenseQuery
} from '../../../../hooks/useCountriesSuspenseQuery';
import { useCreateCompanyMutation } from '../../../../hooks/useCreateCompanyMutation';
import { useUpdateCompanyMutation } from '../../../../hooks/useUpdateCompanyMutation';
import { createCompanySchema } from '../../../../schemas/createCompanySchema';

const Component: FC = () => {
  const companiesSuspenseQuery = useCompaniesSuspenseQuery();
  const navigate = useNavigate();
  const createCompanyMutation = useCreateCompanyMutation({
    onSuccess: async () => {
      await navigate({
        to: '/onboarding/sector'
      });
    }
  });
  const updateCompanyMutation = useUpdateCompanyMutation({
    onSuccess: async () => {
      await navigate({
        to: '/onboarding/sector'
      });
    }
  });
  const [errors, setErrors] = useState({});
  const [name, setName] = useState(companiesSuspenseQuery.data[0]?.name ?? '');
  const countriesSuspenseQuery = useCountriesSuspenseQuery();
  const countryItems = useMemo<ComboboxFieldItem[]>(
    () =>
      countriesSuspenseQuery.data.map((country) => ({
        label: country.name,
        value: country.code
      })),
    [countriesSuspenseQuery.data]
  );
  let defaultCountryValue: ComboboxFieldItem | null = null;
  const selectedCountryItem = countryItems.find(
    (item) => item.value === companiesSuspenseQuery.data[0]?.country.code
  );

  if (selectedCountryItem) {
    defaultCountryValue = selectedCountryItem;
  }

  const [countryValue, setCountryValue] = useState<ComboboxFieldItem | null>(
    defaultCountryValue
  );
  const [countryInputValue, setCountryInputValue] = useState(
    defaultCountryValue?.label ?? ''
  );
  const [website, setWebsite] = useState(
    companiesSuspenseQuery.data[0]?.website ?? ''
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    try {
      const { data } = companiesSuspenseQuery;
      const variables = createCompanySchema.parse({
        countryCode: countryValue?.value,
        name,
        website
      });

      if (data.length === 0) {
        createCompanyMutation.mutate(variables);

        return;
      }

      const [{ id }] = data;

      // TODO: If there are no changes we can navigate to the next step
      updateCompanyMutation.mutate({
        ...variables,
        companyId: id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const { fieldErrors } = z.flattenError(error);

        setErrors(fieldErrors);
      }
    }
  };

  const handleNameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setName(event.target.value);
  };

  const handleWebsiteChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setWebsite(event.target.value);
  };

  return (
    <Card>
      <div className="flex flex-col gap-2">
        <Heading level={1}>Company Information</Heading>
        <p className="text-gray-500">
          Help us find the best investors for your company
        </p>
      </div>
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
          onChange={handleNameChange}
          placeholder="Name"
          required
          type="text"
          value={name}
        />
        <ComboboxField
          inputValue={countryInputValue}
          items={countryItems}
          label="Country"
          name="countryCode"
          onInputValueChange={setCountryInputValue}
          onValueChange={setCountryValue}
          placeholder="Country"
          required
          value={countryValue}
        />
        <TextField
          label="Website"
          name="website"
          onChange={handleWebsiteChange}
          placeholder="Website"
          type="url"
          value={website}
        />
        <Button
          EndIcon={ArrowRight}
          loading={
            createCompanyMutation.isPending || updateCompanyMutation.isPending
          }
          type="submit"
        >
          Continue
        </Button>
      </Form>
    </Card>
  );
};

export const Route = createFileRoute(
  '/_protected/_onboarding/onboarding/company-information'
)({
  component: Component,
  loader: async ({ context }) => {
    const { queryClient } = context;

    await queryClient.ensureQueryData(countriesSuspenseQueryOptions());
  },
  pendingComponent: () => (
    <Card>
      <Spinner className="self-center" />
    </Card>
  )
});
