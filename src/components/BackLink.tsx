import type { FC } from 'react';

import { Link, type LinkProps } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';

export const BackLink: FC<Pick<LinkProps, 'to'>> = ({ to }) => (
  <Link className="flex items-center justify-center gap-2" to={to}>
    <ArrowLeftIcon size={16} />
    <span className="font-medium">Back</span>
  </Link>
);
