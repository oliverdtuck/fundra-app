import type { FC } from 'react';

import { Progress } from '@base-ui-components/react/progress';

interface ProgressBarProps {
  value: number;
}

export const ProgressBar: FC<ProgressBarProps> = ({ value }) => (
  <Progress.Root value={value}>
    <Progress.Track className="h-2 rounded-full bg-gray-300">
      <Progress.Indicator className="rounded-full bg-black transition-all duration-300" />
    </Progress.Track>
  </Progress.Root>
);
