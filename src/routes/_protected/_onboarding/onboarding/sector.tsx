import { Form } from '@base-ui-components/react/form';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import {
  type FC,
  type FormEventHandler,
  useEffect,
  useMemo,
  useState
} from 'react';
import * as z from 'zod';

import { BackLink } from '../../../../components/BackLink';
import { Button } from '../../../../components/Button';
import { Card } from '../../../../components/Card';
import {
  ComboboxField,
  type ComboboxFieldItem
} from '../../../../components/ComboboxField';
import { Heading } from '../../../../components/Heading';
import { Spinner } from '../../../../components/Spinner';
import {
  companiesSuspenseQueryOptions,
  useCompaniesSuspenseQuery
} from '../../../../hooks/useCompaniesSuspenseQuery';
import {
  primarySectorsSuspenseQueryOptions,
  usePrimarySectorsSuspenseQuery
} from '../../../../hooks/usePrimarySectorsSuspenseQuery';
import { useSubSectorsQuery } from '../../../../hooks/useSubSectorsQuery';
import { useUpdateCompanyMutation } from '../../../../hooks/useUpdateCompanyMutation';
import { updateCompanySchema } from '../../../../schemas/updateCompanySchema';

const Component: FC = () => {
  const navigate = useNavigate();
  const { isPending, mutate } = useUpdateCompanyMutation({
    onSuccess: async () => {
      await navigate({
        to: '/onboarding/funding-stage'
      });
    }
  });
  const companiesSuspenseQuery = useCompaniesSuspenseQuery();
  const [errors, setErrors] = useState({});
  const primarySectorsSuspenseQuery = usePrimarySectorsSuspenseQuery();
  const primarySectorItems = useMemo<ComboboxFieldItem[]>(
    () =>
      primarySectorsSuspenseQuery.data.map((primarySector) => ({
        label: primarySector.name,
        value: primarySector.id
      })),
    [primarySectorsSuspenseQuery.data]
  );
  let defaultPrimarySectorValue: ComboboxFieldItem | null = null;
  const selectedPrimarySectorItem = primarySectorItems.find(
    (item) => item.value === companiesSuspenseQuery.data[0].primarySector?.id
  );

  if (selectedPrimarySectorItem) {
    defaultPrimarySectorValue = selectedPrimarySectorItem;
  }

  const [primarySectorValue, setPrimarySectorValue] =
    useState<ComboboxFieldItem | null>(defaultPrimarySectorValue);
  const [primarySectorInputValue, setPrimarySectorInputValue] = useState(
    defaultPrimarySectorValue?.label ?? ''
  );
  const subSectorsQuery = useSubSectorsQuery(primarySectorValue?.value ?? '', {
    enabled: primarySectorValue !== null
  });
  const subSectorItems = useMemo<ComboboxFieldItem[]>(
    () =>
      subSectorsQuery.data?.map((subSector) => ({
        label: subSector.name,
        value: subSector.id
      })) ?? [],
    [subSectorsQuery.data]
  );
  let defaultSubSectorValue: ComboboxFieldItem | null = null;
  const selectedSubSectorItem = subSectorItems.find(
    (item) => item.value === companiesSuspenseQuery.data[0].subSector?.id
  );

  if (selectedSubSectorItem) {
    defaultSubSectorValue = selectedSubSectorItem;
  }

  const [subSectorValue, setSubSectorValue] =
    useState<ComboboxFieldItem | null>(null);
  const [subSectorInputValue, setSubSectorInputValue] = useState('');

  useEffect(() => {
    if (defaultSubSectorValue) {
      setSubSectorValue(defaultSubSectorValue);
      setSubSectorInputValue(defaultSubSectorValue.label);
    }
  }, [defaultSubSectorValue]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    try {
      const variables = updateCompanySchema.parse({
        primarySectorId: primarySectorValue?.value,
        subSectorId: subSectorValue?.value
      });
      const [{ id }] = companiesSuspenseQuery.data;

      mutate({
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

  const handlePrimarySectorValueChange = (value: ComboboxFieldItem | null) => {
    setPrimarySectorValue(value);
    setSubSectorValue(null);
    setSubSectorInputValue('');
  };

  return (
    <Card>
      <div className="flex flex-col gap-2">
        <Heading level={1}>Sector</Heading>
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
        <ComboboxField
          autoFocus
          inputValue={primarySectorInputValue}
          items={primarySectorItems}
          label="Primary Sector"
          name="primarySectorId"
          onInputValueChange={setPrimarySectorInputValue}
          onValueChange={handlePrimarySectorValueChange}
          placeholder="Primary Sector"
          required
          value={primarySectorValue}
        />
        {subSectorsQuery.data && (
          <ComboboxField
            inputValue={subSectorInputValue}
            items={subSectorItems}
            label="Sub Sector"
            name="subSectorId"
            onInputValueChange={setSubSectorInputValue}
            onValueChange={setSubSectorValue}
            placeholder="Sub Sector"
            required
            value={subSectorValue}
          />
        )}
        {subSectorsQuery.isLoading && <Spinner className="self-center" />}
        <div className="flex items-center justify-between">
          <BackLink to="/onboarding/company-information" />
          <Button EndIcon={ArrowRight} loading={isPending} type="submit">
            Continue
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export const Route = createFileRoute(
  '/_protected/_onboarding/onboarding/sector'
)({
  beforeLoad: async ({ context }) => {
    const { queryClient } = context;
    const companies = await queryClient.ensureQueryData(
      companiesSuspenseQueryOptions()
    );

    if (companies.length === 0) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: '/onboarding/company-information'
      });
    }
  },
  component: Component,
  loader: async ({ context }) => {
    const { queryClient } = context;

    await queryClient.ensureQueryData(primarySectorsSuspenseQueryOptions());
  },
  pendingComponent: () => (
    <Card>
      <Spinner className="self-center" />
    </Card>
  )
});
