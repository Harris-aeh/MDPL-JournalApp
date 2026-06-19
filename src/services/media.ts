import * as ImagePicker from 'expo-image-picker';

export class MediaPermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MediaPermissionError';
  }
}

/** Opens the camera and returns the captured photo URI, or null if cancelled. */
export async function takePhoto(): Promise<string | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    throw new MediaPermissionError('Camera permission was not granted.');
  }

  const result = await ImagePicker.launchCameraAsync({
    quality: 0.6,
    allowsEditing: true,
  });

  return result.canceled ? null : result.assets[0].uri;
}

/** Opens the gallery and returns the chosen photo URI, or null if cancelled. */
export async function pickFromGallery(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    throw new MediaPermissionError('Photo library permission was not granted.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    quality: 0.6,
    allowsEditing: true,
    mediaTypes: ['images'],
  });

  return result.canceled ? null : result.assets[0].uri;
}
