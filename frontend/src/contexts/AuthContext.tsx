import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authService } from '@/services/auth';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEYS = {
  user: 'auth_user',
  username: 'auth_username',
  password: 'auth_password',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const userJson = sessionStorage.getItem(SESSION_KEYS.user);
    if (userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        setState({ user, isAuthenticated: true, isLoading: false });
      } catch {
        sessionStorage.removeItem(SESSION_KEYS.user);
        sessionStorage.removeItem(SESSION_KEYS.username);
        sessionStorage.removeItem(SESSION_KEYS.password);
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const response = await authService.login({ username, password });

    sessionStorage.setItem(SESSION_KEYS.username, username);
    sessionStorage.setItem(SESSION_KEYS.password, password);

    const user: User = {
      id: response.id,
      username: response.username,
      fullName: response.fullName,
      role: response.role,
    };
    sessionStorage.setItem(SESSION_KEYS.user, JSON.stringify(user));

    setState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEYS.user);
    sessionStorage.removeItem(SESSION_KEYS.username);
    sessionStorage.removeItem(SESSION_KEYS.password);
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
