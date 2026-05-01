import { AxiosError } from 'axios';
import { api } from '../../lib/api/client';
import { mockCustomers } from './mockCustomers';
import { Customer, CustomerFormPayload } from './types';

let mockDatabase = [...mockCustomers];

function initialsFromName(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function shouldFallback(error: unknown) {
  if (!__DEV__) {
    return false;
  }

  const axiosError = error as AxiosError | undefined;
  const status = axiosError?.response?.status;
  const authorizationHeader = api.defaults.headers.common.Authorization;
  const normalizedAuthorization =
    typeof authorizationHeader === 'string'
      ? authorizationHeader
      : Array.isArray(authorizationHeader)
        ? authorizationHeader.join(' ')
        : '';
  const isUsingMockToken = normalizedAuthorization.includes('mock-token-');

  if (isUsingMockToken) {
    return true;
  }

  return !status || status === 404 || status >= 500;
}

function buildCustomer(payload: CustomerFormPayload, existing?: Customer): Customer {
  const contextSalonId = payload.salonId ?? null;
  const contextLabel = contextSalonId
    ? payload.salonLabel?.trim() || existing?.contextLabel || 'Salao vinculado'
    : 'Conta profissional';

  return {
    id: existing?.id ?? `customer-${Date.now()}`,
    name: payload.name.trim(),
    whatsapp: payload.whatsapp.trim(),
    contextSalonId,
    contextLabel,
    birthDate: payload.birthDate,
    contactPreference: payload.contactPreference,
    notes: payload.notes?.trim(),
    photoUrl: payload.photoUrl,
    initials: initialsFromName(payload.name),
    nextServiceName: existing?.nextServiceName ?? 'Sem atendimento',
    nextContactDate: existing?.nextContactDate,
    lastAppointmentLabel: existing?.lastAppointmentLabel,
    history: existing?.history ?? [],
  };
}

export async function fetchCustomers(search?: string): Promise<Customer[]> {
  try {
    const response = await api.get<Customer[]>('/customers', {
      params: search ? { search } : undefined,
    });
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    const normalizedSearch = search?.trim().toLowerCase();
    if (!normalizedSearch) {
      return mockDatabase;
    }

    return mockDatabase.filter(
      (customer) =>
        customer.name.toLowerCase().includes(normalizedSearch) ||
        customer.whatsapp.toLowerCase().includes(normalizedSearch),
    );
  }
}

export async function fetchCustomerById(customerId: string): Promise<Customer | null> {
  try {
    const response = await api.get<Customer>(`/customers/${customerId}`);
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    return mockDatabase.find((customer) => customer.id === customerId) ?? null;
  }
}

export async function createCustomer(payload: CustomerFormPayload): Promise<Customer> {
  try {
    const response = await api.post<Customer>('/customers', {
      name: payload.name,
      whatsapp: payload.whatsapp,
      salonId: payload.salonId,
      birthDate: payload.birthDate,
      contactPreference: payload.contactPreference,
      notes: payload.notes,
      photoUrl: payload.photoUrl,
    });
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    const nextCustomer = buildCustomer(payload);
    mockDatabase = [nextCustomer, ...mockDatabase];
    return nextCustomer;
  }
}

export async function updateCustomer(
  customerId: string,
  payload: CustomerFormPayload,
): Promise<Customer> {
  try {
    const response = await api.put<Customer>(`/customers/${customerId}`, {
      name: payload.name,
      whatsapp: payload.whatsapp,
      salonId: payload.salonId,
      birthDate: payload.birthDate,
      contactPreference: payload.contactPreference,
      notes: payload.notes,
      photoUrl: payload.photoUrl,
    });
    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    const current = mockDatabase.find((customer) => customer.id === customerId);
    if (!current) {
      throw new Error('Cliente nao encontrada.');
    }

    const updatedCustomer = buildCustomer(payload, current);
    mockDatabase = mockDatabase.map((customer) =>
      customer.id === customerId ? updatedCustomer : customer,
    );

    return updatedCustomer;
  }
}

export async function uploadCustomerPhoto(customerId: string, photoUri: string): Promise<Customer> {
  try {
    const formData = new FormData();
    const fileName = photoUri.split('/').pop() ?? `${customerId}.jpg`;
    const extension = fileName.includes('.') ? fileName.split('.').pop() : 'jpg';
    const normalizedType = extension?.toLowerCase() === 'png' ? 'image/png' : 'image/jpeg';

    formData.append('photo', {
      uri: photoUri,
      name: fileName,
      type: normalizedType,
    } as never);

    const response = await api.post<Customer>(`/customers/${customerId}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }

    const current = mockDatabase.find((customer) => customer.id === customerId);
    if (!current) {
      throw new Error('Cliente nao encontrada.');
    }

    const updatedCustomer: Customer = {
      ...current,
      photoUrl: photoUri,
    };

    mockDatabase = mockDatabase.map((customer) =>
      customer.id === customerId ? updatedCustomer : customer,
    );

    return updatedCustomer;
  }
}
