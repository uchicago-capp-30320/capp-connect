import AsyncStorage from '@react-native-async-storage/async-storage';

// Adapted from AsyncStorage documentation
// https://react-native-async-storage.github.io/async-storage/docs/usage

export const setCachedData = async (key: string, value: Record<string, string|object>) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log(e)
  }
};

export const getCachedData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e)
  }
};
