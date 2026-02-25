/**
 * Device ID - unique identifier per device for one-vote-per-device logic.
 * Stored in AsyncStorage so it persists across app restarts.
 * Used to ensure each device gets only one vote/submission per poll/question.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_KEY = '@ourvoice_device_id';

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

let cachedId: string | null = null;

/**
 * Get or create a unique device ID. Cached in memory after first load.
 */
export async function getDeviceId(): Promise<string> {
  if (cachedId) return cachedId;
  try {
    let id = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = generateId();
      await AsyncStorage.setItem(DEVICE_ID_KEY, id);
    }
    cachedId = id;
    return id;
  } catch (e) {
    // Fallback: generate temporary ID (won't persist across restarts)
    return generateId();
  }
}
