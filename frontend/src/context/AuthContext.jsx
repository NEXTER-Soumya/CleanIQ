import { createContext, useContext, useEffect, useState } from 'react';
import { getMe } from '../api/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth status on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('cleaniq_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getMe();
        setUser(data.user);
      } catch {
        // Token is invalid/expired — clean up
        localStorage.removeItem('cleaniq_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('cleaniq_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('cleaniq_token');
    setUser(null);
  };

  const updateUserProfile = (newUserData) => {
    setUser(newUserData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUserProfile, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
