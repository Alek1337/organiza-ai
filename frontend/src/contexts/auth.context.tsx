import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

type Props = {
  children?: ReactNode;
}

type IAuthContext = {
  user: User | null;
  authenticated: boolean;
  isLoading: boolean;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleLogout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext>({
  user: null,
  authenticated: false,
  isLoading: false,
  handleLogin: () => Promise.resolve(),
  handleLogout: () => Promise.resolve(),
  fetchMe: () => Promise.resolve(),
});

export const AuthProvider = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<User | null>(null);

  async function handleLogin(email: string, password: string) {
    try {
      setIsLoading(true);

      await api.post('/auth/login', { email, password });
      setAuthenticated(true);

      const { data } = await api.get('/users/me') as { data: User };
      setUser(data);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    try {
      setIsLoading(true);
      await api.post('/auth/logout');
      setAuthenticated(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchMe () {
    try {
      setIsLoading(true);
      const { data } = await api.get('/users/me') as { data: User };
      setAuthenticated(true);
      setUser(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const value = {
    user,
    isLoading,
    authenticated,
    handleLogin,
    handleLogout,
    fetchMe
  };

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
