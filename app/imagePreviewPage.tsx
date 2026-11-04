import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors, radii, spacing } from '@/constants/theme';
import { submitMultiPartFormData } from '@/services/cameraService';
import { faceVerificationResponseData } from '@/types/res';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';

export default function ImagePreviewPage() {
  const params = useLocalSearchParams<{ uri: string | string[]; quizId?: string | string[] }>();
  const uri = Array.isArray(params.uri) ? params.uri[0] : params.uri;
  const quizId = Array.isArray(params.quizId) ? params.quizId[0] : params.quizId;
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<faceVerificationResponseData | null>(null);

  async function submit() {
    if (!uri) {
      Alert.alert('Image unavailable', 'Please capture the image again.');
      return;
    }
    try {
      setSubmitting(true);
      setResult(await submitMultiPartFormData(uri));
    } catch (error) {
      Alert.alert('Verification failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen style={styles.screen}>
      <Text style={styles.back} onPress={() => router.back()}>← Retake</Text>
      <Text style={styles.title}>{result ? 'Verification result' : 'Review your photo'}</Text>
      {uri ? <Image source={{ uri }} style={styles.preview} /> : <View style={styles.previewFallback}><Text>No preview available</Text></View>}
      {result ? (
        <View style={[styles.resultCard, result.areSame ? styles.successCard : styles.failureCard]}>
          <Text style={styles.resultTitle}>{result.areSame ? 'Identity verified' : 'Verification unsuccessful'}</Text>
          <Text style={styles.resultMessage}>{result.message}</Text>
        </View>
      ) : <Text style={styles.body}>Make sure your face is clear and centered before submitting.</Text>}
      {result?.areSame && quizId ? <Button text="Continue to exam" onPress={() => router.replace({ pathname: '/exam', params: { quizId } })} /> : result ? <Button text="Back to exams" onPress={() => router.replace('/')} /> : <Button text="Submit for verification" onPress={submit} loading={submitting} />}
      {!result ? <Button text="Retake photo" variant="secondary" onPress={() => router.back()} disabled={submitting} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.md },
  back: { color: colors.primary, fontSize: 16, fontWeight: '700' },
  title: { color: colors.text, fontSize: 30, fontWeight: '800' },
  body: { color: colors.mutedText, fontSize: 16, lineHeight: 23 },
  preview: { width: '100%', flex: 1, minHeight: 360, borderRadius: radii.lg, backgroundColor: '#0F172A' },
  previewFallback: { flex: 1, minHeight: 360, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.border, borderRadius: radii.lg },
  resultCard: { borderRadius: radii.md, padding: spacing.md, gap: spacing.xs },
  successCard: { backgroundColor: '#DCFCE7' },
  failureCard: { backgroundColor: '#FEE2E2' },
  resultTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  resultMessage: { color: colors.text, fontSize: 15 },
});
