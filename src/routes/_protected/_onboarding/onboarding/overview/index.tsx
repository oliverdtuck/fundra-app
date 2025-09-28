import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_protected/_onboarding/onboarding/overview/'
)({
  beforeLoad: () => {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({
      to: '/onboarding/overview/products-and-services'
    });
  }
});
