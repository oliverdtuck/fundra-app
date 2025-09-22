import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use(async (config) => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
