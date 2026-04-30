import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5020',
  timeout: 10000,
});

const salonHeaderName = 'X-Salon-Id';

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
}

export function setSelectedSalonId(salonId: string | null) {
  if (salonId) {
    api.defaults.headers.common[salonHeaderName] = salonId;
    return;
  }

  delete api.defaults.headers.common[salonHeaderName];
}
