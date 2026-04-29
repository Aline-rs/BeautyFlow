import { PropsWithChildren, createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  createService,
  fetchServiceById,
  fetchServices,
  updateService,
  updateServiceStatus,
} from './servicesService';
import { Service, ServiceFormPayload } from './types';

type ServicesContextValue = {
  services: Service[];
  isLoading: boolean;
  loadServices: () => Promise<void>;
  getServiceById: (serviceId: string) => Promise<Service | null>;
  saveService: (payload: ServiceFormPayload, serviceId?: string) => Promise<Service>;
  toggleServiceStatus: (serviceId: string, isActive: boolean) => Promise<Service>;
};

const ServicesContext = createContext<ServicesContextValue | null>(null);

export function ServicesProvider({ children }: PropsWithChildren) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const nextServices = await fetchServices();
      setServices(nextServices);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getServiceById = useCallback(async (serviceId: string) => {
    const existingService = services.find((service) => service.id === serviceId);
    if (existingService) {
      return existingService;
    }

    return fetchServiceById(serviceId);
  }, [services]);

  const saveService = useCallback(async (payload: ServiceFormPayload, serviceId?: string) => {
    const savedService = serviceId
      ? await updateService(serviceId, payload)
      : await createService(payload);

    setServices((currentServices) => {
      const hasService = currentServices.some((service) => service.id === savedService.id);

      if (hasService) {
        return currentServices.map((service) =>
          service.id === savedService.id ? savedService : service,
        );
      }

      return [savedService, ...currentServices];
    });

    return savedService;
  }, []);

  const toggleServiceStatus = useCallback(async (serviceId: string, isActive: boolean) => {
    const updatedService = await updateServiceStatus(serviceId, isActive);

    setServices((currentServices) =>
      currentServices.map((service) =>
        service.id === updatedService.id ? updatedService : service,
      ),
    );

    return updatedService;
  }, []);

  const value = useMemo(
    () => ({
      services,
      isLoading,
      loadServices,
      getServiceById,
      saveService,
      toggleServiceStatus,
    }),
    [getServiceById, isLoading, loadServices, saveService, services, toggleServiceStatus],
  );

  return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>;
}

export function useServices() {
  const context = useContext(ServicesContext);

  if (!context) {
    throw new Error('useServices must be used within ServicesProvider.');
  }

  return context;
}
