import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'beautyflow_token';
const SALON_SETUP_SKIPPED_KEY = 'beautyflow_salon_setup_skipped';

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
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
