import { AxiosError } from 'axios';
import { api } from '../../lib/api/client';
import { mockServices } from './mockServices';
import { Service, ServiceFormPayload } from './types';

let mockDatabase = [...mockServices];

function shouldFallback(error: unknown) {
  if (!__DEV__) {
    return false;
  }

  const axiosError = error as AxiosError | undefined;
  const status = axiosError?.response?.status;

  return !status || status === 404 || status >= 500;
}

function buildService(payload: ServiceFormPayload, existing?: Service): Service {
  return {
    id: existing?.id ?? `service-${Date.now()}`,
    name: payload.name.trim(),
    suggestedReturnDays: payload.suggestedReturnDays,
    isActive: payload.isActive,
  };
}

export async function fetchServices(): Promise<Service[]> {
  try {
    const response = await api.get<Service[]>('/services');
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    return mockDatabase;
  }
}

export async function fetchServiceById(serviceId: string): Promise<Service | null> {
  try {
    const response = await api.get<Service[]>('/services');
    return response.data.find((service) => service.id === serviceId) ?? null;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    return mockDatabase.find((service) => service.id === serviceId) ?? null;
  }
}

export async function createService(payload: ServiceFormPayload): Promise<Service> {
  try {
    const response = await api.post<Service>('/services', payload);
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    const nextService = buildService(payload);
    mockDatabase = [nextService, ...mockDatabase];
    return nextService;
  }
}

export async function updateService(
  serviceId: string,
  payload: ServiceFormPayload,
): Promise<Service> {
  try {
    const response = await api.put<Service>(`/services/${serviceId}`, payload);
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    const current = mockDatabase.find((service) => service.id === serviceId);
    if (!current) {
      throw new Error('Servico nao encontrado.');
    }

    const updatedService = buildService(payload, current);
    mockDatabase = mockDatabase.map((service) =>
      service.id === serviceId ? updatedService : service,
    );

    return updatedService;
  }
}

export async function updateServiceStatus(
  serviceId: string,
  isActive: boolean,
): Promise<Service> {
  try {
    const response = await api.patch<Service>(`/services/${serviceId}/status`, { isActive });
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    const current = mockDatabase.find((service) => service.id === serviceId);
    if (!current) {
      throw new Error('Servico nao encontrado.');
    }

    const updatedService = {
      ...current,
      isActive,
    };

    mockDatabase = mockDatabase.map((service) =>
      service.id === serviceId ? updatedService : service,
    );

    return updatedService;
  }
}
