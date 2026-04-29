import { Service } from './types';

export const mockServices: Service[] = [
  {
    id: 'service-1',
    name: 'Mechas',
    suggestedReturnDays: 15,
    isActive: true,
  },
  {
    id: 'service-2',
    name: 'Coloracao',
    suggestedReturnDays: 30,
    isActive: true,
  },
  {
    id: 'service-3',
    name: 'Corte',
    suggestedReturnDays: 45,
    isActive: true,
  },
  {
    id: 'service-4',
    name: 'Hidratacao',
    suggestedReturnDays: 15,
    isActive: false,
  },
];
