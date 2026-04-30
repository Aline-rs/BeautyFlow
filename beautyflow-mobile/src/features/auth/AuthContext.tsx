import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { setAuthToken, setSelectedSalonId } from '../../lib/api/client';
import { createSalon } from '../salons';
import {
  clearToken,
  getSalonSetupSkipped,
  getToken,
  saveSalonSetupSkipped,
  saveToken,
} from '../../lib/storage/tokenStorage';
import { fetchCurrentSession, login, register } from './authService';
import { AuthSession, LoginPayload, RegisterPayload } from './types';

type AuthContextValue = {
  session: AuthSession | null;
  isHydrating: boolean;
  hasSkippedSalonSetup: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
  signUp: (payload: RegisterPayload) => Promise<void>;
  createSalonLink: (payload: { name: string; phone?: string; email: string }) => Promise<void>;
  skipSalonSetup: () => Promise<void>;
  syncProfessionalProfile: (payload: { name: string; email: string; profilePhotoUrl?: string | null }) => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function applySession(session: AuthSession | null) {
  setAuthToken(session?.token ?? null);
  setSelectedSalonId(session?.selectedSalonId ?? null);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const [hasSkippedSalonSetup, setHasSkippedSalonSetup] = useState(false);

  useEffect(() => {
    async function hydrate() {
      const [storedToken, skippedSalonSetup] = await Promise.all([
        getToken(),
        getSalonSetupSkipped(),
      ]);

      setHasSkippedSalonSetup(skippedSalonSetup);

      if (storedToken) {
        setAuthToken(storedToken);
        setSelectedSalonId(null);

        try {
          const restoredSession = await fetchCurrentSession(storedToken);

          if (restoredSession) {
            setSession(restoredSession);
            applySession(restoredSession);

            if (restoredSession.salons.length > 0 && skippedSalonSetup) {
              await saveSalonSetupSkipped(false);
              setHasSkippedSalonSetup(false);
            }
          } else {
            await clearToken();
            applySession(null);
            setSession(null);
          }
        } catch {
          await clearToken();
          applySession(null);
          setSession(null);
        }
      }

      setIsHydrating(false);
    }

    void hydrate();
  }, []);

  async function signIn(payload: LoginPayload) {
    const nextSession = await login(payload);
    await saveToken(nextSession.token);
    await saveSalonSetupSkipped(false);
    applySession(nextSession);
    setHasSkippedSalonSetup(false);
    setSession(nextSession);
  }

  async function signUp(payload: RegisterPayload) {
    const nextSession = await register(payload);
    await saveToken(nextSession.token);
    await saveSalonSetupSkipped(false);
    applySession(nextSession);
    setHasSkippedSalonSetup(false);
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

    await saveSalonSetupSkipped(false);
    applySession(nextSession);
    setHasSkippedSalonSetup(false);
    setSession(nextSession);
  }

  async function skipSalonSetup() {
    await saveSalonSetupSkipped(true);
    setHasSkippedSalonSetup(true);
  }

  function syncProfessionalProfile(payload: { name: string; email: string; profilePhotoUrl?: string | null }) {
    setSession((currentSession) => {
      if (!currentSession) {
        return currentSession;
      }

      return {
        ...currentSession,
        user: {
          ...currentSession.user,
          name: payload.name,
          email: payload.email,
          profilePhotoUrl: payload.profilePhotoUrl ?? currentSession.user.profilePhotoUrl ?? null,
        },
      };
    });
  }

  async function signOut() {
    await Promise.all([clearToken(), saveSalonSetupSkipped(false)]);
    applySession(null);
    setHasSkippedSalonSetup(false);
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isHydrating,
        hasSkippedSalonSetup,
        signIn,
        signUp,
        createSalonLink,
        skipSalonSetup,
        syncProfessionalProfile,
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
