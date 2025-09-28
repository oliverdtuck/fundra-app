import { Checkbox } from '@base-ui-components/react/checkbox';
import { CheckboxGroup } from '@base-ui-components/react/checkbox-group';
import { Field } from '@base-ui-components/react/field';
import { Fieldset } from '@base-ui-components/react/fieldset';
import { Form } from '@base-ui-components/react/form';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { type FC, type FormEventHandler, useState } from 'react';
import * as z from 'zod';

import { BackLink } from '../../../../../components/BackLink';
import { Button } from '../../../../../components/Button';
import { Card } from '../../../../../components/Card';
import { Heading } from '../../../../../components/Heading';
import {
  companiesSuspenseQueryOptions,
  useCompaniesSuspenseQuery
} from '../../../../../hooks/useCompaniesSuspenseQuery';
import {
  companyThesesSuspenseQueryOptions,
  useCompanyThesesSuspenseQuery
} from '../../../../../hooks/useCompanyThesesSuspenseQuery';
import {
  thesesSuspenseQueryOptions,
  useThesesSuspenseQuery
} from '../../../../../hooks/useThesesSuspenseQuery';
import { useUpdateCompanyThesesMutation } from '../../../../../hooks/useUpdateCompanyThesesMutation';
import { updateCompanyThesesSchema } from '../../../../../schemas/updateCompanyThesesSchema';

const Component: FC = () => {
  const { data } = useCompaniesSuspenseQuery();
  const [{ id }] = data;
  const navigate = useNavigate();
  const updateCompanyThesesMutation = useUpdateCompanyThesesMutation({
    onSuccess: async () => {
      await navigate({
        to: `/companies/${id}`
      });
    }
  });
  const [errors, setErrors] = useState({});
  const thesesSuspenseQuery = useThesesSuspenseQuery();
  const companyThesesSuspenseQuery = useCompanyThesesSuspenseQuery(id);
  const [thesisIds, setThesisIds] = useState<string[]>(
    companyThesesSuspenseQuery.data.map((thesis) => thesis.id)
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    try {
      const variables = updateCompanyThesesSchema.parse({
        thesisIds
      });

      updateCompanyThesesMutation.mutate({
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
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <div className="flex flex-col gap-2">
          <Heading level={1}>Investment Thesis</Heading>
          <p className="text-gray-500">
            Help us find the best investors for your company
          </p>
        </div>
      </Card>
      <Card>
        <Form
          className="flex flex-col gap-6"
          errors={errors}
          onClearErrors={setErrors}
          onSubmit={handleSubmit}
        >
          <Field.Root
            className="flex flex-col gap-6"
            name="thesisIds"
            render={<Fieldset.Root />}
          >
            <Fieldset.Legend className="text-gray-500">
              What is your investment thesis?
            </Fieldset.Legend>
            <CheckboxGroup
              className="flex flex-col gap-2"
              onValueChange={setThesisIds}
              value={thesisIds}
            >
              {thesesSuspenseQuery.data.map((thesis) => (
                <Field.Label
                  className="rounded-lg border border-gray-300 p-[0.8125rem] text-sm has-[:checked]:border-black has-[:checked]:bg-gray-100"
                  key={thesis.id}
                >
                  {thesis.name}
                  <Checkbox.Root className="sr-only" value={thesis.id} />
                </Field.Label>
              ))}
            </CheckboxGroup>
            <Field.Error className="text-sm text-red-500" />
          </Field.Root>
          <div className="grid grid-cols-3 items-center gap-2">
            <BackLink to="/onboarding/overview/target-customers" />
            <span className="text-center text-sm text-gray-500">
              Step 3 of 3
            </span>
            <Button
              EndIcon={ArrowRight}
              loading={updateCompanyThesesMutation.isPending}
              type="submit"
            >
              Next
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export const Route = createFileRoute(
  '/_protected/_onboarding/onboarding/overview/investment-thesis'
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

    const [{ fundingRound, productsAndServices, subSector, targetCustomers }] =
      companies;

    if (!subSector) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: '/onboarding/sector'
      });
    }

    if (!fundingRound) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: '/onboarding/funding-stage'
      });
    }

    if (!productsAndServices) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: '/onboarding/overview/products-and-services'
      });
    }

    if (!targetCustomers) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({
        to: '/onboarding/overview/target-customers'
      });
    }
  },
  component: Component,
  loader: async ({ context }) => {
    const { queryClient } = context;
    const [{ id }] = await queryClient.ensureQueryData(
      companiesSuspenseQueryOptions()
    );

    await queryClient.ensureQueryData(companyThesesSuspenseQueryOptions(id));
    await queryClient.ensureQueryData(thesesSuspenseQueryOptions());
  },
  pendingComponent: () => <Card>Loading...</Card>
});
