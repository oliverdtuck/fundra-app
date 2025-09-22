import { use } from 'react';

import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const authState = use(AuthContext);

  if (!authState) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return authState;
};
