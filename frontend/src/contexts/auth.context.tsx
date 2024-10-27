import { User } from '@/types';
import { createContext, ReactNode, useContext, useState } from 'react';

type Props = {
  children?: ReactNode;
}

type IAuthContext = {
  user: User | null;
  authenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<IAuthContext>({
  user: null,
  authenticated: false,
  isLoading: false,
});

export const AuthProvider = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<User | null>(null);

  const value = {
    user,
    isLoading,
    authenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
