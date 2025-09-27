import { Form } from '@base-ui-components/react/form';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { ArrowRightIcon } from 'lucide-react';
import { type FC, type FormEventHandler, useMemo, useState } from 'react';
import * as z from 'zod';

import { BackLink } from '../../../../components/BackLink';
import { Button } from '../../../../components/Button';
import { Card } from '../../../../components/Card';
import {
  ComboboxField,
  type ComboboxFieldItem
} from '../../../../components/ComboboxField';
import { Heading } from '../../../../components/Heading';
import {
  companiesSuspenseQueryOptions,
  useCompaniesSuspenseQuery
} from '../../../../hooks/useCompaniesSuspenseQuery';
import { useUpdateCompanyMutation } from '../../../../hooks/useUpdateCompanyMutation';
import { updateCompanySchema } from '../../../../schemas/updateCompanySchema';

const Component: FC = () => {
  const navigate = useNavigate();
  const { isPending, mutate } = useUpdateCompanyMutation({
    onSuccess: async () => {
      await navigate({
        to: '/onboarding/overview'
      });
    }
  });
  const companiesSuspenseQuery = useCompaniesSuspenseQuery();
  const [errors, setErrors] = useState({});
  const fundingRoundItems = useMemo<ComboboxFieldItem[]>(
    () => [
      {
        label: 'Pre-Seed',
        value: 'pre_seed'
      },
      {
        label: 'Seed',
        value: 'seed'
      },
      {
        label: 'Series A',
        value: 'series_a'
      }
    ],
    []
  );
  let defaultFundingRoundValue: ComboboxFieldItem | null = null;
  const selectedFundingRoundItem = fundingRoundItems.find(
    (item) => item.value === companiesSuspenseQuery.data[0].fundingRound
  );

  if (selectedFundingRoundItem) {
    defaultFundingRoundValue = selectedFundingRoundItem;
  }

  const [fundingRoundValue, setFundingRoundValue] =
    useState<ComboboxFieldItem | null>(defaultFundingRoundValue);
  const [fundingRoundInputValue, setFundingRoundInputValue] = useState(
    defaultFundingRoundValue?.label ?? ''
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    try {
      const variables = updateCompanySchema.parse({
        fundingRound: fundingRoundValue?.value
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

  return (
    <Card>
      <div className="flex flex-col gap-2">
        <Heading level={1}>Funding Stage</Heading>
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
          inputValue={fundingRoundInputValue}
          items={fundingRoundItems}
          label="Funding Round"
          name="fundingRound"
          onInputValueChange={setFundingRoundInputValue}
          onValueChange={setFundingRoundValue}
          placeholder="Funding Round"
          required
          value={fundingRoundValue}
        />
        <div className="flex items-center justify-between">
          <BackLink to="/onboarding/sector" />
          <Button EndIcon={ArrowRightIcon} loading={isPending} type="submit">
            Continue
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export const Route = createFileRoute(
  '/_protected/_onboarding/onboarding/funding-stage'
)({
  component: Component,
  loader: async ({ context }) => {
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

    const [{ subSector }] = companies;

    if (!subSector) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: '/onboarding/sector'
      });
    }
  },
  pendingComponent: () => <Card>Loading...</Card>
});
