import { CameraView } from 'expo-camera';

export async function captureImage(cameraRef: React.RefObject<CameraView>) {
  if (!cameraRef.current) {
    throw new Error('Camera is not ready');
  }

  const photo = await cameraRef.current.takePictureAsync();

  console.log(photo?.uri);
}