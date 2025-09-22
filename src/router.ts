import { createRouter } from '@tanstack/react-router';

import { queryClient } from './queryClient';
import { routeTree } from './routeTree.gen';

export const router = createRouter({
  context: {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    auth: undefined!,
    queryClient
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  routeTree,
  scrollRestoration: true
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
