import { getCurrentUser } from 'aws-amplify/auth';

export const checkAuth = async () => {
  try {
    return await getCurrentUser();
  } catch {
    return null;
  }
};
