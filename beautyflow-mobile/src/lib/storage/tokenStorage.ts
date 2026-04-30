import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'beautyflow_token';
const SALON_SETUP_SKIPPED_KEY = 'beautyflow_salon_setup_skipped';
const SELECTED_SALON_CONTEXT_KEY = 'beautyflow_selected_salon_context';
const NO_SALON_CONTEXT_VALUE = '__professional__';

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function saveSelectedSalonContext(salonId: string | null) {
  await SecureStore.setItemAsync(
    SELECTED_SALON_CONTEXT_KEY,
    salonId ?? NO_SALON_CONTEXT_VALUE,
  );
}

export async function getSelectedSalonContext() {
  const value = await SecureStore.getItemAsync(SELECTED_SALON_CONTEXT_KEY);

  if (value === null) {
    return undefined;
  }

  return value === NO_SALON_CONTEXT_VALUE ? null : value;
}

export async function clearSelectedSalonContext() {
  await SecureStore.deleteItemAsync(SELECTED_SALON_CONTEXT_KEY);
}

export async function saveSalonSetupSkipped(skipped: boolean) {
  if (skipped) {
    await SecureStore.setItemAsync(SALON_SETUP_SKIPPED_KEY, 'true');
    return;
  }

  await SecureStore.deleteItemAsync(SALON_SETUP_SKIPPED_KEY);
}

export async function getSalonSetupSkipped() {
  const value = await SecureStore.getItemAsync(SALON_SETUP_SKIPPED_KEY);
  return value === 'true';
}
