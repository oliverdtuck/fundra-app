import { Amplify } from 'aws-amplify';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';

Amplify.configure({
  Auth: {
    Cognito: {
      signUpVerificationMethod: 'code',
      userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID
    }
  }
});

const root = document.getElementById('root');

if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
