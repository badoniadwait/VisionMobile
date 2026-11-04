import { ApiError } from '@/api/client';
import { Screen } from '@/components/Screen';
import { colors, radii, spacing } from '@/constants/theme';
import { fetchAdminQuiz } from '@/services/adminService';
import { AdminQuizDetail } from '@/types/adminDashboard';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AdminQuizDetailScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Number(Array.isArray(params.id) ? params.id[0] : params.id);
  const [quiz, setQuiz] = useState<AdminQuizDetail | null>(null);
  useEffect(() => { fetchAdminQuiz(id).then(setQuiz).catch((error: unknown) => Alert.alert('Quiz unavailable', error instanceof ApiError ? error.message : 'Unable to load quiz.')); }, [id]);
  return <Screen><ScrollView contentContainerStyle={styles.container}><Text style={styles.back} onPress={() => router.back()}>← Back</Text><Text style={styles.title}>Quiz #{id}</Text><Text style={styles.meta}>{quiz?.durationMinutes ?? '—'} minutes · {quiz?.questions.length ?? '—'} questions</Text>{quiz?.questions.map((question, index) => <View key={index} style={styles.card}><Text style={styles.question}>{index + 1}. {question.question}</Text>{question.options.map((option, optionIndex) => <Text key={optionIndex} style={[styles.option, optionIndex === question.answer && styles.correct]}>{String.fromCharCode(65 + optionIndex)}. {option}{optionIndex === question.answer ? '  ✓' : ''}</Text>)}</View>)}</ScrollView></Screen>;
}

const styles = StyleSheet.create({
  container: { gap: spacing.md, paddingBottom: spacing.xl },
  back: { color: colors.primary, fontSize: 16, fontWeight: '700', marginBottom: spacing.md },
  title: { color: colors.text, fontSize: 30, fontWeight: '800' },
  meta: { color: colors.mutedText, marginBottom: spacing.md },
  card: { backgroundColor: colors.surface, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md, gap: spacing.sm },
  question: { color: colors.text, fontSize: 17, fontWeight: '800', lineHeight: 23 },
  option: { color: colors.mutedText, fontSize: 15, paddingVertical: spacing.xs },
  correct: { color: colors.success, fontWeight: '800' },
});
