import { createContext } from 'react';

import type { AuthState } from '../types/AuthState';

export const AuthContext = createContext<AuthState | undefined>(undefined);
