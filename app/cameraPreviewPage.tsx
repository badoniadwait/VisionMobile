import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors, radii, spacing } from '@/constants/theme';
import { captureImage } from '@/services/cameraService';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function CameraPreviewPage() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturing, setCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const params = useLocalSearchParams<{ quizId?: string | string[] }>();
  const quizId = Array.isArray(params.quizId) ? params.quizId[0] : params.quizId;

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <Screen style={styles.permissionScreen}>
        <Text style={styles.title}>Camera access needed</Text>
        <Text style={styles.body}>Vision uses your camera to verify your identity before an exam.</Text>
        <Button text="Allow camera" onPress={requestPermission} />
      </Screen>
    );
  }

  async function handleCapture() {
    try {
      setCapturing(true);
      const uri = await captureImage(cameraRef);
      if (!uri) throw new Error('No image was captured.');
      router.push({ pathname: '/imagePreviewPage', params: { uri, quizId: quizId ?? '' } });
    } catch (error) {
      Alert.alert('Capture failed', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setCapturing(false);
    }
  }

  return (
    <Screen style={styles.screen}>
      <Text style={styles.back} onPress={() => router.back()}>← Back</Text>
      <Text style={styles.title}>Face verification</Text>
      <Text style={styles.body}>Center your face in the frame. Remove sunglasses and use even lighting.</Text>
      <View style={styles.cameraFrame}>
        <CameraView ref={cameraRef} style={styles.camera} facing="front" mirror={false} />
        <View pointerEvents="none" style={styles.guide} />
      </View>
      <Button text="Capture photo" onPress={handleCapture} loading={capturing} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.md },
  permissionScreen: { justifyContent: 'center', gap: spacing.md },
  back: { color: colors.primary, fontSize: 16, fontWeight: '700' },
  title: { color: colors.text, fontSize: 30, fontWeight: '800' },
  body: { color: colors.mutedText, fontSize: 16, lineHeight: 23 },
  cameraFrame: { flex: 1, minHeight: 390, overflow: 'hidden', borderRadius: radii.lg, backgroundColor: '#0F172A', position: 'relative' },
  camera: { flex: 1 },
  guide: { position: 'absolute', alignSelf: 'center', top: '18%', width: '70%', height: '60%', borderWidth: 3, borderColor: '#BFDBFE', borderRadius: 180 },
});
