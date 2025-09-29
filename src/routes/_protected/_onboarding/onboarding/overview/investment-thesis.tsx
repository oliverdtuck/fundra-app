import { Checkbox } from '@base-ui-components/react/checkbox';
import { CheckboxGroup } from '@base-ui-components/react/checkbox-group';
import { Field } from '@base-ui-components/react/field';
import { Fieldset } from '@base-ui-components/react/fieldset';
import { Form } from '@base-ui-components/react/form';
import { ScrollArea } from '@base-ui-components/react/scroll-area';
import { Tooltip } from '@base-ui-components/react/tooltip';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { ArrowRight, Check } from 'lucide-react';
import { type FC, type FormEventHandler, useRef, useState } from 'react';
import * as z from 'zod';

import { BackLink } from '../../../../../components/BackLink';
import { Button } from '../../../../../components/Button';
import { Card } from '../../../../../components/Card';
import { Heading } from '../../../../../components/Heading';
import { Spinner } from '../../../../../components/Spinner';
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
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);

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
      <div className="flex flex-col gap-6 rounded-lg border border-gray-300 bg-white">
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
            <Fieldset.Legend className="px-[1.9375rem] pt-[1.9375rem] text-gray-500">
              What is your investment thesis?
            </Fieldset.Legend>
            <ScrollArea.Root>
              <ScrollArea.Viewport
                className="h-80 overscroll-contain px-[1.9375rem] py-0.5"
                ref={scrollAreaViewportRef}
              >
                <CheckboxGroup
                  className="flex flex-col gap-2"
                  onValueChange={setThesisIds}
                  value={thesisIds}
                >
                  {thesesSuspenseQuery.data.map((thesis) => (
                    // eslint-disable-next-line react-x/no-context-provider
                    <Tooltip.Provider key={thesis.id}>
                      <Tooltip.Root delay={0}>
                        <Tooltip.Trigger
                          render={
                            <Field.Label className="flex items-center justify-between rounded-lg border border-gray-300 p-[0.8125rem] text-sm has-[:checked]:border-black has-[:checked]:bg-gray-100 has-[:checked]:ring-2 has-[:checked]:ring-gray-300">
                              <span>{thesis.name}</span>
                              <Checkbox.Root value={thesis.id}>
                                <Checkbox.Indicator>
                                  <Check size={16} />
                                </Checkbox.Indicator>
                              </Checkbox.Root>
                            </Field.Label>
                          }
                        />
                        <Tooltip.Portal
                          container={scrollAreaViewportRef.current}
                        >
                          <Tooltip.Positioner sideOffset={8}>
                            <Tooltip.Popup className="w-[var(--anchor-width)] rounded-lg bg-black/90 p-3.5 text-sm text-white">
                              {thesis.description}
                            </Tooltip.Popup>
                          </Tooltip.Positioner>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  ))}
                </CheckboxGroup>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar className="mr-[13px] ml-3.5 w-1 rounded bg-gray-200 opacity-0 transition-opacity delay-300 data-[hovering]:opacity-100 data-[hovering]:delay-0 data-[hovering]:duration-75 data-[scrolling]:opacity-100 data-[scrolling]:delay-0 data-[scrolling]:duration-75">
                <ScrollArea.Thumb className="w-full rounded bg-gray-500" />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
            <Field.Error className="px-[1.9375rem] text-sm text-red-500" />
          </Field.Root>
          <div className="grid grid-cols-3 items-center gap-2 px-[1.9375rem] pb-[1.9375rem]">
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
      </div>
    </div>
  );
};

export const Route = createFileRoute(
  '/_protected/_onboarding/onboarding/overview/investment-thesis'
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

    const [
      { fundingRound, id, productsAndServices, subSector, targetCustomers }
    ] = companies;

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

    await queryClient.ensureQueryData(companyThesesSuspenseQueryOptions(id));
    await queryClient.ensureQueryData(thesesSuspenseQueryOptions());
  },
  pendingComponent: () => (
    <Card>
      <Spinner className="self-center" />
    </Card>
  )
});
