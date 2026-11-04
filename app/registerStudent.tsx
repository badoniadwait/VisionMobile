import { ApiError } from '@/api/client';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors, radii, spacing } from '@/constants/theme';
import { registerStudent } from '@/services/adminService';
import { captureImage } from '@/services/cameraService';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function RegisterStudent() {
  const [sapId, setSapId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  async function takePhoto() {
    if (!permission?.granted) { await requestPermission(); return; }
    try { setImageUri(await captureImage(cameraRef)); } catch { Alert.alert('Photo failed', 'Unable to capture the reference photo.'); }
  }

  async function submit() {
    if (!sapId.trim() || !name.trim() || !password || !imageUri) { Alert.alert('Incomplete details', 'Add student details and capture a reference photo.'); return; }
    try { setLoading(true); await registerStudent({ sapId, name, password, imageUri }); Alert.alert('Student registered', 'The student can now sign in.', [{ text: 'Done', onPress: () => router.replace('/adminHome') }]); }
    catch (error) { Alert.alert('Registration failed', error instanceof ApiError ? error.message : 'Unable to register the student.'); }
    finally { setLoading(false); }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.back} onPress={() => router.back()}>← Back</Text>
        <Text style={styles.title}>Register student</Text>
        <Text style={styles.subtitle}>The reference photo is used for exam face verification.</Text>
        <TextInput style={styles.input} placeholder="SAP ID" value={sapId} onChangeText={setSapId} editable={!loading} />
        <TextInput style={styles.input} placeholder="Student name" value={name} onChangeText={setName} editable={!loading} />
        <TextInput style={styles.input} placeholder="Temporary password" value={password} onChangeText={setPassword} secureTextEntry editable={!loading} />
        {permission?.granted ? <View style={styles.camera}><CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="front" mirror={false} /></View> : null}
        <Text style={styles.photoStatus}>{imageUri ? 'Reference photo captured.' : 'No reference photo captured.'}</Text>
        <Button text={permission?.granted ? 'Capture reference photo' : 'Allow camera'} variant="secondary" onPress={takePhoto} disabled={loading} />
        <Button text="Register student" onPress={submit} loading={loading} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md, paddingBottom: spacing.xl },
  back: { color: colors.primary, fontSize: 16, fontWeight: '700', marginBottom: spacing.md },
  title: { color: colors.text, fontSize: 30, fontWeight: '800' },
  subtitle: { color: colors.mutedText, fontSize: 16, lineHeight: 23, marginBottom: spacing.md },
  input: { minHeight: 52, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, paddingHorizontal: spacing.md, backgroundColor: colors.surface, fontSize: 16 },
  camera: { height: 220, overflow: 'hidden', borderRadius: radii.md, backgroundColor: '#0F172A', position: 'relative' },
  photoStatus: { color: colors.mutedText, fontSize: 14 },
});
