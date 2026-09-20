import { postPath } from '@/helper/helper';
import { CameraView } from 'expo-camera';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

import { faceVerificationResponseData } from '@/types/res';
import { File } from "expo-file-system";


export async function captureImage(cameraRef: React.RefObject<CameraView | null>) {
  if (!cameraRef.current) {
    throw new Error('Camera is not ready');
  }

  const photo = await cameraRef.current.takePictureAsync();

  if (!photo?.uri) {
    return null;
  }
  const result = await ImageManipulator.manipulate(photo.uri).flip("horizontal").renderAsync();


  const image = await result.saveAsync({
    format: SaveFormat.JPEG,
  })

  return image.uri;
}

export function convertToMultiPart(uri: string | null) {
  if (uri == null) {
    throw new Error("uri is null! cannot create multipart form data");
  }

  const formdata = new FormData();

  const file = new File(uri)

  formdata.append("image", file)

  return formdata;
}

export async function submitMultiPartFormData(uri: string) {

  const multiPartData = convertToMultiPart(uri);

  const res = await fetch(postPath, {
    method: "POST",
    body: multiPartData
  });

  const data: faceVerificationResponseData = await res.json();

  return data;
  }


