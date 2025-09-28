import { Form } from '@base-ui-components/react/form';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import {
  type ChangeEventHandler,
  type FC,
  type FormEventHandler,
  useState
} from 'react';
import * as z from 'zod';

import { BackLink } from '../../../../../components/BackLink';
import { Button } from '../../../../../components/Button';
import { Card } from '../../../../../components/Card';
import { Heading } from '../../../../../components/Heading';
import { TextareaField } from '../../../../../components/TextareaField';
import {
  companiesSuspenseQueryOptions,
  useCompaniesSuspenseQuery
} from '../../../../../hooks/useCompaniesSuspenseQuery';
import { useUpdateCompanyMutation } from '../../../../../hooks/useUpdateCompanyMutation';
import { updateCompanySchema } from '../../../../../schemas/updateCompanySchema';

const Component: FC = () => {
  const { data } = useCompaniesSuspenseQuery();
  const [company] = data;
  const [targetCustomers, setTargetCustomers] = useState(
    company.targetCustomers ?? ''
  );
  const navigate = useNavigate();
  const updateCompanyMutation = useUpdateCompanyMutation({
    onSuccess: async () => {
      await navigate({
        to: '/onboarding/overview/investment-thesis'
      });
    }
  });
  const [errors, setErrors] = useState({});

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    try {
      const variables = updateCompanySchema.parse({
        targetCustomers
      });
      const { id } = company;

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

  const handleTargetCustomersChange: ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    setTargetCustomers(event.target.value);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <div className="flex flex-col gap-2">
          <Heading level={1}>Target Customers</Heading>
          <p className="text-gray-500">
            Help us find the best investors for your company
          </p>
        </div>
      </Card>
      <Card>
        <p className="text-gray-500">Who are your target customers?</p>
        <Form
          className="flex flex-col gap-6"
          errors={errors}
          onClearErrors={setErrors}
          onSubmit={handleSubmit}
        >
          <TextareaField
            autoFocus
            label="Target Customers"
            name="targetCustomers"
            onChange={handleTargetCustomersChange}
            placeholder="Target Customers"
            required
            value={targetCustomers}
          />
          <div className="grid grid-cols-3 items-center gap-2">
            <BackLink to="/onboarding/overview/products-and-services" />
            <span className="text-center text-sm text-gray-500">
              Step 2 of 3
            </span>
            <Button
              EndIcon={ArrowRight}
              loading={updateCompanyMutation.isPending}
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
  '/_protected/_onboarding/onboarding/overview/target-customers'
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

    const [{ fundingRound, productsAndServices, subSector }] = companies;

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
  },
  component: Component,
  pendingComponent: () => <Card>Loading...</Card>
});
