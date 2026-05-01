import { PropsWithChildren, createContext, useCallback, useContext, useMemo, useState } from 'react';
import { createAppointment, fetchAppointmentById, fetchAppointments, updateAppointment } from './appointmentsService';
import { Appointment, CreateAppointmentPayload, UpdateAppointmentPayload } from './types';

type AppointmentsContextValue = {
  appointments: Appointment[];
  isLoading: boolean;
  loadAppointments: (search?: string) => Promise<void>;
  getAppointmentById: (appointmentId: string) => Promise<Appointment | null>;
  saveAppointment: (payload: CreateAppointmentPayload | UpdateAppointmentPayload, appointmentId?: string) => Promise<Appointment>;
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

  const getAppointmentById = useCallback(async (appointmentId: string) => {
    const appointment = await fetchAppointmentById(appointmentId);

    if (!appointment) {
      return null;
    }

    setAppointments((currentAppointments) => {
      const hasAppointment = currentAppointments.some((current) => current.id === appointment.id);
      return hasAppointment
        ? currentAppointments.map((current) => (current.id === appointment.id ? appointment : current))
        : [appointment, ...currentAppointments];
    });

    return appointment;
  }, []);

  const saveAppointment = useCallback(async (payload: CreateAppointmentPayload | UpdateAppointmentPayload, appointmentId?: string) => {
    const savedAppointment = appointmentId
      ? await updateAppointment(appointmentId, payload)
      : await createAppointment(payload);

    setAppointments((currentAppointments) => {
      const hasAppointment = currentAppointments.some((current) => current.id === savedAppointment.id);
      return hasAppointment
        ? currentAppointments.map((current) => (current.id === savedAppointment.id ? savedAppointment : current))
        : [savedAppointment, ...currentAppointments];
    });

    return savedAppointment;
  }, []);

  const value = useMemo(
    () => ({
      appointments,
      isLoading,
      loadAppointments,
      getAppointmentById,
      saveAppointment,
    }),
    [appointments, getAppointmentById, isLoading, loadAppointments, saveAppointment],
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
