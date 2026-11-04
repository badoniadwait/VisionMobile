import { ApiError } from '@/api/client';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors, radii, spacing } from '@/constants/theme';
import { fetchExamHistory } from '@/services/studentService';
import { AttemptResult } from '@/types/quiz';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ExamHistory() {
  const [attempts, setAttempts] = useState<AttemptResult[]>([]);
  useEffect(() => { fetchExamHistory().then(setAttempts).catch((error: unknown) => Alert.alert('History unavailable', error instanceof ApiError ? error.message : 'Unable to load exam history.')); }, []);
  return <Screen><ScrollView contentContainerStyle={styles.container}><Text style={styles.back} onPress={() => router.back()}>← Back</Text><Text style={styles.title}>Exam history</Text>{attempts.length === 0 ? <Text style={styles.empty}>No submitted exams yet.</Text> : attempts.map(attempt => <View key={attempt.attemptId} style={styles.card}><View style={styles.line}><Text style={styles.quiz}>Exam #{attempt.quizId}</Text><Text style={styles.score}>{attempt.percentage}%</Text></View><Text style={styles.meta}>{attempt.score} of {attempt.total} correct</Text><Text style={styles.meta}>{new Date(attempt.submittedAt).toLocaleString()}</Text></View>)}<Button text="Back to dashboard" variant="secondary" onPress={() => router.replace('/')} /></ScrollView></Screen>;
}

const styles = StyleSheet.create({
  container: { gap: spacing.md, paddingBottom: spacing.xl },
  back: { color: colors.primary, fontSize: 16, fontWeight: '700', marginBottom: spacing.md },
  title: { color: colors.text, fontSize: 32, fontWeight: '800', marginBottom: spacing.lg },
  card: { backgroundColor: colors.surface, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md, gap: spacing.xs },
  line: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quiz: { color: colors.text, fontSize: 17, fontWeight: '800' },
  score: { color: colors.primary, fontSize: 20, fontWeight: '800' },
  meta: { color: colors.mutedText, fontSize: 14 },
  empty: { color: colors.mutedText, marginBottom: spacing.lg },
});
