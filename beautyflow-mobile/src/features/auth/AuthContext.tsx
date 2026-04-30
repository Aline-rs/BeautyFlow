import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { setAuthToken, setSelectedSalonId } from '../../lib/api/client';
import { createSalon } from '../salons';
import { clearToken, getToken, saveToken } from '../../lib/storage/tokenStorage';
import { login, register } from './authService';
import { AuthSession, LoginPayload, RegisterPayload } from './types';

type AuthContextValue = {
  session: AuthSession | null;
  isHydrating: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
  signUp: (payload: RegisterPayload) => Promise<void>;
  createSalonLink: (payload: { name: string; phone?: string; email: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function createSessionFromToken(token: string): AuthSession {
  return {
    token,
    user: {
      id: 'persisted-user-id',
      name: 'BeautyFlow',
      email: 'sessao@beautyflow.app',
      profilePhotoUrl: null,
    },
    salons: [],
    selectedSalonId: null,
  };
}

function applySession(session: AuthSession | null) {
  setAuthToken(session?.token ?? null);
  setSelectedSalonId(session?.selectedSalonId ?? null);
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
        applySession(restoredSession);
      }

      setIsHydrating(false);
    }

    void hydrate();
  }, []);

  async function signIn(payload: LoginPayload) {
    const nextSession = await login(payload);
    await saveToken(nextSession.token);
    applySession(nextSession);
    setSession(nextSession);
  }

  async function signUp(payload: RegisterPayload) {
    const nextSession = await register(payload);
    await saveToken(nextSession.token);
    applySession(nextSession);
    setSession(nextSession);
  }

  async function createSalonLink(payload: { name: string; phone?: string; email: string }) {
    if (!session) {
      throw new Error('Session is required to create a salon.');
    }

    const linkedSalon = await createSalon({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      makePrimary: true,
    });

    const nextSession: AuthSession = {
      ...session,
      salons: [linkedSalon, ...session.salons.filter((salon) => salon.id !== linkedSalon.id)].map((salon) => ({
        ...salon,
        isPrimary: salon.id === linkedSalon.id,
      })),
      selectedSalonId: linkedSalon.id,
    };

    applySession(nextSession);
    setSession(nextSession);
  }

  async function signOut() {
    await clearToken();
    applySession(null);
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isHydrating,
        signIn,
        signUp,
        createSalonLink,
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
