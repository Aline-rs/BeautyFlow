import { PropsWithChildren, createContext, useCallback, useContext, useMemo, useState } from 'react';
import { createAppointment, fetchAppointments } from './appointmentsService';
import { Appointment, CreateAppointmentPayload } from './types';

type AppointmentsContextValue = {
  appointments: Appointment[];
  isLoading: boolean;
  loadAppointments: (search?: string) => Promise<void>;
  registerAppointment: (payload: CreateAppointmentPayload) => Promise<Appointment>;
};

const AppointmentsContext = createContext<AppointmentsContextValue | null>(null);

export function AppointmentsProvider({ children }: PropsWithChildren) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAppointments = useCallback(async (search?: string) => {
    setIsLoading(true);
    try {
      const nextAppointments = await fetchAppointments(search);
      setAppointments(nextAppointments);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registerAppointment = useCallback(async (payload: CreateAppointmentPayload) => {
    const createdAppointment = await createAppointment(payload);
    setAppointments((currentAppointments) => [createdAppointment, ...currentAppointments]);
    return createdAppointment;
  }, []);

  const value = useMemo(
    () => ({
      appointments,
      isLoading,
      loadAppointments,
      registerAppointment,
    }),
    [appointments, isLoading, loadAppointments, registerAppointment],
  );

  return <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>;
}

export function useAppointments() {
  const context = useContext(AppointmentsContext);

  if (!context) {
    throw new Error('useAppointments must be used within AppointmentsProvider.');
  }

  return context;
}
