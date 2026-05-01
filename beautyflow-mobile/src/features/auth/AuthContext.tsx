import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { setAuthToken, setSelectedSalonId } from '../../lib/api/client';
import { createSalon } from '../salons';
import {
  clearToken,
  clearSelectedSalonContext,
  getSalonSetupSkipped,
  getSelectedSalonContext,
  getToken,
  saveSalonSetupSkipped,
  saveSelectedSalonContext,
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
  createSalonLink: (payload: {
    name: string;
    phone?: string;
    email: string;
    makePrimary?: boolean;
    selectCreatedSalon?: boolean;
  }) => Promise<void>;
  selectSalonContext: (salonId: string | null) => Promise<void>;
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
      const [storedToken, skippedSalonSetup, storedSelectedSalonContext] = await Promise.all([
        getToken(),
        getSalonSetupSkipped(),
        getSelectedSalonContext(),
      ]);

      setHasSkippedSalonSetup(skippedSalonSetup);

      if (storedToken) {
        setAuthToken(storedToken);
        setSelectedSalonId(null);

        try {
          const restoredSession = await fetchCurrentSession(storedToken);

          if (restoredSession) {
            const nextSelectedSalonId =
              storedSelectedSalonContext === undefined
                ? restoredSession.selectedSalonId ?? null
                : storedSelectedSalonContext === null
                  ? null
                  : restoredSession.salons.some((salon) => salon.id === storedSelectedSalonContext)
                    ? storedSelectedSalonContext
                    : restoredSession.selectedSalonId ?? null;

            const nextSession: AuthSession = {
              ...restoredSession,
              selectedSalonId: nextSelectedSalonId,
            };

            setSession(nextSession);
            applySession(nextSession);

            if (nextSession.salons.length > 0 && skippedSalonSetup) {
              await saveSalonSetupSkipped(false);
              setHasSkippedSalonSetup(false);
            }

            await saveSelectedSalonContext(nextSession.selectedSalonId ?? null);
          } else {
            await Promise.all([clearToken(), clearSelectedSalonContext()]);
            applySession(null);
            setSession(null);
          }
        } catch {
          await Promise.all([clearToken(), clearSelectedSalonContext()]);
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
    await Promise.all([
      saveToken(nextSession.token),
      saveSelectedSalonContext(nextSession.selectedSalonId ?? null),
    ]);
    await saveSalonSetupSkipped(false);
    applySession(nextSession);
    setHasSkippedSalonSetup(false);
    setSession(nextSession);
  }

  async function signUp(payload: RegisterPayload) {
    const nextSession = await register(payload);
    await Promise.all([
      saveToken(nextSession.token),
      saveSelectedSalonContext(nextSession.selectedSalonId ?? null),
    ]);
    await saveSalonSetupSkipped(false);
    applySession(nextSession);
    setHasSkippedSalonSetup(false);
    setSession(nextSession);
  }

  async function createSalonLink(payload: {
    name: string;
    phone?: string;
    email: string;
    makePrimary?: boolean;
    selectCreatedSalon?: boolean;
  }) {
    if (!session) {
      throw new Error('Session is required to create a salon.');
    }

    const linkedSalon = await createSalon({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      makePrimary: payload.makePrimary ?? true,
    });

    const shouldMakePrimary = payload.makePrimary ?? true;
    const shouldSelectCreatedSalon = payload.selectCreatedSalon ?? shouldMakePrimary;

    const nextSession: AuthSession = {
      ...session,
      salons: [linkedSalon, ...session.salons.filter((salon) => salon.id !== linkedSalon.id)].map((salon) => ({
        ...salon,
        isPrimary: shouldMakePrimary ? salon.id === linkedSalon.id : salon.id === linkedSalon.id ? linkedSalon.isPrimary : salon.isPrimary,
      })),
      selectedSalonId: shouldSelectCreatedSalon ? linkedSalon.id : session.selectedSalonId ?? null,
    };

    await saveSalonSetupSkipped(false);
    await saveSelectedSalonContext(nextSession.selectedSalonId ?? null);
    applySession(nextSession);
    setHasSkippedSalonSetup(false);
    setSession(nextSession);
  }

  async function selectSalonContext(salonId: string | null) {
    setSession((currentSession) => {
      if (!currentSession) {
        return currentSession;
      }

      const isValidSalonSelection =
        salonId === null || currentSession.salons.some((salon) => salon.id === salonId);

      if (!isValidSalonSelection) {
        return currentSession;
      }

      const nextSession = {
        ...currentSession,
        selectedSalonId: salonId,
      };

      applySession(nextSession);
      return nextSession;
    });

    await saveSelectedSalonContext(salonId);
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
    await Promise.all([
      clearToken(),
      clearSelectedSalonContext(),
      saveSalonSetupSkipped(false),
    ]);
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
        selectSalonContext,
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
