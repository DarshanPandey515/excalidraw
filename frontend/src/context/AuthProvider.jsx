import { useState } from 'react';
import { apiLogin, apiSignup } from '../api/auth';
import { getStoredAuth, setStoredAuth } from '../api/client';
import { AuthContext } from './authContext';

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getStoredAuth);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    const value = { access: data.access, refresh: data.refresh, user: data.user };
    setStoredAuth(value);
    setAuth(value);
    return value;
  };

  const signup = async (name, email, password) => {
    await apiSignup(name, email, password);
    return login(email, password);
  };

  const logout = () => {
    setStoredAuth(null);
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};