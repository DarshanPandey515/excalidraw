import { apiFetch } from './client';

export const apiLogin = (email, password) =>
  apiFetch('/auth/login/', { method: 'POST', body: { email, password }, auth: false });

export const apiSignup = (name, email, password) =>
  apiFetch('/auth/signup/', { method: 'POST', body: { name, email, password }, auth: false });