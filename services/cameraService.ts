import { CameraView } from 'expo-camera';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';


export async function captureImage(cameraRef: React.RefObject<CameraView | null>) {
  if (!cameraRef.current) {
    throw new Error('Camera is not ready');
  }

  const photo = await cameraRef.current.takePictureAsync();

  if(!photo?.uri) {
    return null;
  }

  const result = await ImageManipulator.manipulate(photo.uri).flip("horizontal").renderAsync();

  const image = await result.saveAsync({
    format: SaveFormat.JPEG,
    // compress: 
  })

  console.log(image);
  return image.uri;
}