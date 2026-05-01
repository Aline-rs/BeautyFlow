import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  createCustomer,
  fetchCustomerById,
  fetchCustomers,
  uploadCustomerPhoto,
  updateCustomer,
} from './customersService';
import { Customer, CustomerFormPayload } from './types';

type CustomersContextValue = {
  customers: Customer[];
  isLoading: boolean;
  loadCustomers: (search?: string) => Promise<void>;
  getCustomerById: (customerId: string) => Promise<Customer | null>;
  saveCustomer: (payload: CustomerFormPayload, customerId?: string) => Promise<Customer>;
};

const CustomersContext = createContext<CustomersContextValue | null>(null);

export function CustomersProvider({ children }: PropsWithChildren) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const customersRef = useRef<Customer[]>([]);

  useEffect(() => {
    customersRef.current = customers;
  }, [customers]);

  const loadCustomers = useCallback(async (search?: string) => {
    setIsLoading(true);
    try {
      const nextCustomers = await fetchCustomers(search);
      setCustomers(nextCustomers);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCustomerById = useCallback(async (customerId: string) => {
    const fetchedCustomer = await fetchCustomerById(customerId);

    if (!fetchedCustomer) {
      return customersRef.current.find((customer) => customer.id === customerId) ?? null;
    }

    setCustomers((currentCustomers) => {
      const hasCustomer = currentCustomers.some((customer) => customer.id === fetchedCustomer.id);

      if (hasCustomer) {
        return currentCustomers.map((customer) =>
          customer.id === fetchedCustomer.id ? fetchedCustomer : customer,
        );
      }

      return [fetchedCustomer, ...currentCustomers];
    });

    return fetchedCustomer;
  }, []);

  const saveCustomer = useCallback(async (payload: CustomerFormPayload, customerId?: string) => {
    const basePayload = isLocalPhotoAsset(payload.photoUrl)
      ? {
          ...payload,
          photoUrl: undefined,
        }
      : payload;

    const savedBaseCustomer = customerId
      ? await updateCustomer(customerId, basePayload)
      : await createCustomer(basePayload);

    const savedCustomer =
      payload.photoUrl && isLocalPhotoAsset(payload.photoUrl)
        ? await uploadCustomerPhoto(savedBaseCustomer.id, payload.photoUrl)
        : savedBaseCustomer;

    setCustomers((currentCustomers) => {
      const hasCustomer = currentCustomers.some((customer) => customer.id === savedCustomer.id);

      if (hasCustomer) {
        return currentCustomers.map((customer) =>
          customer.id === savedCustomer.id ? savedCustomer : customer,
        );
      }

      return [savedCustomer, ...currentCustomers];
    });

    return savedCustomer;
  }, []);

  const value = useMemo(
    () => ({
      customers,
      isLoading,
      loadCustomers,
      getCustomerById,
      saveCustomer,
    }),
    [customers, getCustomerById, isLoading, loadCustomers, saveCustomer],
  );

  return <CustomersContext.Provider value={value}>{children}</CustomersContext.Provider>;
}

function isLocalPhotoAsset(photoUrl?: string) {
  if (!photoUrl) {
    return false;
  }

  return (
    photoUrl.startsWith('file://') ||
    photoUrl.startsWith('content://') ||
    photoUrl.startsWith('ph://') ||
    photoUrl.startsWith('assets-library://')
  );
}

export function useCustomers() {
  const context = useContext(CustomersContext);

  if (!context) {
    throw new Error('useCustomers must be used within CustomersProvider.');
  }

  return context;
}
