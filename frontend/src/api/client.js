const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const AUTH_KEY = 'excalidraw-clone.auth';

export const getStoredAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY)) || null;
  } catch {
    return null;
  }
};

export const setStoredAuth = (auth) => {
  if (auth) localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  else localStorage.removeItem(AUTH_KEY);
};

const flattenError = (data) => {
  if (!data) return 'Request failed.';
  if (typeof data === 'string') return data;
  if (typeof data.detail === 'string') return data.detail;
  if (typeof data.message === 'string') return data.message;
  const first = Object.values(data)[0];
  if (Array.isArray(first)) return first[0] || 'Request failed.';
  return 'Request failed.';
};

export const apiFetch = async (path, { method = 'GET', body, auth = true } = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getStoredAuth()?.access;
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) throw new Error(flattenError(data));
  return data;
};