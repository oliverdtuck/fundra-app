import { Checkbox } from '@base-ui-components/react/checkbox';
import { CheckboxGroup } from '@base-ui-components/react/checkbox-group';
import { Field } from '@base-ui-components/react/field';
import { Fieldset } from '@base-ui-components/react/fieldset';
import { Form } from '@base-ui-components/react/form';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from 'lucide-react';
import {
  type ChangeEventHandler,
  type FC,
  type FormEventHandler,
  useState
} from 'react';
import * as z from 'zod';

import { BackLink } from '../../../../components/BackLink';
import { Button } from '../../../../components/Button';
import { Card } from '../../../../components/Card';
import { Heading } from '../../../../components/Heading';
import { TextareaField } from '../../../../components/TextareaField';
import {
  companiesSuspenseQueryOptions,
  useCompaniesSuspenseQuery
} from '../../../../hooks/useCompaniesSuspenseQuery';
import {
  companyThesesSuspenseQueryOptions,
  useCompanyThesesSuspenseQuery
} from '../../../../hooks/useCompanyThesesSuspenseQuery';
import {
  thesesSuspenseQueryOptions,
  useThesesSuspenseQuery
} from '../../../../hooks/useThesesSuspenseQuery';
import { useUpdateCompanyMutation } from '../../../../hooks/useUpdateCompanyMutation';
import { useUpdateCompanyThesesMutation } from '../../../../hooks/useUpdateCompanyThesesMutation';
import { updateCompanySchema } from '../../../../schemas/updateCompanySchema';
import { updateCompanyThesesSchema } from '../../../../schemas/updateCompanyThesesSchema';

type CurrentStep =
  | 'INVESTMENT_THESIS'
  | 'PRODUCTS_AND_SERVICES'
  | 'TARGET_CUSTOMERS';

const Component: FC = () => {
  const { data } = useCompaniesSuspenseQuery();
  const [company] = data;
  const [productsAndServices, setProductsAndServices] = useState(
    company.productsAndServices ?? ''
  );
  const [targetCustomers, setTargetCustomers] = useState(
    company.targetCustomers ?? ''
  );
  const navigate = useNavigate();
  const updateCompanyMutation = useUpdateCompanyMutation();
  const updateCompanyThesesMutation = useUpdateCompanyThesesMutation({
    onSuccess: async () => {
      await navigate({
        to: `/companies/${id}`
      });
    }
  });
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState<CurrentStep>(() => {
    if (!company.productsAndServices) {
      return 'PRODUCTS_AND_SERVICES';
    }

    if (!company.targetCustomers) {
      return 'TARGET_CUSTOMERS';
    }

    return 'INVESTMENT_THESIS';
  });
  const { id } = company;
  const thesesSuspenseQuery = useThesesSuspenseQuery();
  const companyThesesSuspenseQuery = useCompanyThesesSuspenseQuery(id);
  const [thesisIds, setThesisIds] = useState<string[]>(
    companyThesesSuspenseQuery.data.map((thesis) => thesis.id)
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    try {
      if (currentStep === 'PRODUCTS_AND_SERVICES') {
        const variables = updateCompanySchema.parse({
          productsAndServices
        });

        updateCompanyMutation.mutate(
          {
            ...variables,
            companyId: id
          },
          {
            onSuccess: () => {
              setCurrentStep('TARGET_CUSTOMERS');
            }
          }
        );
      }

      if (currentStep === 'TARGET_CUSTOMERS') {
        const variables = updateCompanySchema.parse({
          targetCustomers
        });

        updateCompanyMutation.mutate(
          {
            ...variables,
            companyId: id
          },
          {
            onSuccess: () => {
              setCurrentStep('INVESTMENT_THESIS');
            }
          }
        );
      }

      if (currentStep === 'INVESTMENT_THESIS') {
        const variables = updateCompanyThesesSchema.parse({
          thesisIds
        });

        updateCompanyThesesMutation.mutate({
          ...variables,
          companyId: id
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const { fieldErrors } = z.flattenError(error);

        setErrors(fieldErrors);
      }
    }
  };

  const renderTitle = () => {
    switch (currentStep) {
      case 'INVESTMENT_THESIS':
        return 'Investment Thesis';
      case 'PRODUCTS_AND_SERVICES':
        return 'Products & Services';
      case 'TARGET_CUSTOMERS':
        return 'Target Customers';
    }
  };

  const renderDescription = () => {
    switch (currentStep) {
      case 'PRODUCTS_AND_SERVICES':
        return 'What products or services does your company offer?';
      case 'TARGET_CUSTOMERS':
        return 'Who are your target customers?';
    }
  };

  const handleProductsAndServicesChange: ChangeEventHandler<
    HTMLTextAreaElement
  > = (event) => {
    setProductsAndServices(event.target.value);
  };

  const handleTargetCustomersChange: ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    setTargetCustomers(event.target.value);
  };

  const handleBackClick = () => {
    switch (currentStep) {
      case 'INVESTMENT_THESIS':
        setCurrentStep('TARGET_CUSTOMERS');

        break;
      case 'TARGET_CUSTOMERS':
        setCurrentStep('PRODUCTS_AND_SERVICES');
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <Card>
        <div className="flex flex-col gap-2">
          <Heading level={1}>{renderTitle()}</Heading>
          <p className="text-gray-500">
            Help us find the best investors for your company
          </p>
        </div>
      </Card>
      <Card>
        {currentStep !== 'INVESTMENT_THESIS' && (
          <p className="text-gray-500">{renderDescription()}</p>
        )}
        <Form
          className="flex flex-col gap-6"
          errors={errors}
          onClearErrors={setErrors}
          onSubmit={handleSubmit}
        >
          {currentStep === 'PRODUCTS_AND_SERVICES' && (
            <TextareaField
              label="Products & Services"
              name="productsAndServices"
              onChange={handleProductsAndServicesChange}
              placeholder="Products & Services"
              required
              value={productsAndServices}
            />
          )}
          {currentStep === 'TARGET_CUSTOMERS' && (
            <TextareaField
              label="Target Customers"
              name="targetCustomers"
              onChange={handleTargetCustomersChange}
              placeholder="Target Customers"
              required
              value={targetCustomers}
            />
          )}
          {currentStep === 'INVESTMENT_THESIS' && (
            <Field.Root
              className="flex flex-col gap-6"
              name="companyTheses"
              render={<Fieldset.Root />}
            >
              <Fieldset.Legend className="text-gray-500">
                What is your investment thesis?
              </Fieldset.Legend>
              <CheckboxGroup
                className="flex flex-col gap-3"
                onValueChange={setThesisIds}
                value={thesisIds}
              >
                {thesesSuspenseQuery.data.map((thesis) => (
                  <Field.Label className="flex justify-between" key={thesis.id}>
                    {thesis.name}
                    <Checkbox.Root
                      className="flex size-6 items-center justify-center rounded-sm border data-[checked]:border-black data-[checked]:bg-black data-[checked]:text-white data-[unchecked]:border-gray-300"
                      value={thesis.id}
                    >
                      <Checkbox.Indicator>
                        <CheckIcon size={16} />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                  </Field.Label>
                ))}
              </CheckboxGroup>
            </Field.Root>
          )}
          <div className="flex justify-between">
            {currentStep === 'PRODUCTS_AND_SERVICES' ? (
              <BackLink to="/onboarding/funding-stage" />
            ) : (
              <Button
                onClick={handleBackClick}
                StartIcon={ArrowLeftIcon}
                type="button"
                variant="link"
              >
                Back
              </Button>
            )}
            <Button
              EndIcon={ArrowRightIcon}
              loading={
                updateCompanyMutation.isPending ||
                updateCompanyThesesMutation.isPending
              }
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
  '/_protected/_onboarding/onboarding/overview'
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

    const [{ fundingRound, subSector }] = companies;

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
