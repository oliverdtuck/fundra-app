import type { FC } from 'react';

import { Link, type LinkProps } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

export const BackLink: FC<Pick<LinkProps, 'to'>> = ({ to }) => (
  <Link
    className="flex items-center justify-center gap-2 rounded-lg bg-gray-200 px-4 py-2"
    to={to}
  >
    <ArrowLeft size={16} />
    <span className="font-medium">Back</span>
  </Link>
);
