import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { setAuthToken } from '../../lib/api/client';
import { clearToken, getToken, saveToken } from '../../lib/storage/tokenStorage';
import { login, register } from './authService';
import { AuthSession, LoginPayload, RegisterPayload } from './types';

type AuthContextValue = {
  session: AuthSession | null;
  isHydrating: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
  signUp: (payload: RegisterPayload) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function createSessionFromToken(token: string): AuthSession {
  return {
    token,
    user: {
      name: 'BeautyFlow',
      email: 'sessao@beautyflow.app',
      salonName: 'Studio Bella Hair',
    },
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    async function hydrate() {
      const storedToken = await getToken();

      if (storedToken) {
        const restoredSession = createSessionFromToken(storedToken);
        setSession(restoredSession);
        setAuthToken(storedToken);
      }

      setIsHydrating(false);
    }

    void hydrate();
  }, []);

  async function signIn(payload: LoginPayload) {
    const nextSession = await login(payload);
    await saveToken(nextSession.token);
    setAuthToken(nextSession.token);
    setSession(nextSession);
  }

  async function signUp(payload: RegisterPayload) {
    const nextSession = await register(payload);
    await saveToken(nextSession.token);
    setAuthToken(nextSession.token);
    setSession(nextSession);
  }

  async function signOut() {
    await clearToken();
    setAuthToken(null);
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isHydrating,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
}
