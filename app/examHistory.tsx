import { ApiError } from '@/api/client';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/AppText';
import { fetchExamHistory } from '@/services/studentService';
import { AttemptResult } from '@/types/quiz';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { colors, spacing, styles as design } from '@/helper/style';

export default function ExamHistory() {
  const [attempts, setAttempts] = useState<AttemptResult[]>([]);
  useEffect(() => { fetchExamHistory().then(setAttempts).catch((error: unknown) => Alert.alert('History unavailable', error instanceof ApiError ? error.message : 'Unable to load exam history.')); }, []);
  return <Screen><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xxxl }}>
    <AppText weight="semiBold" style={design.link} onPress={() => router.back()}>← Back</AppText>
    <View style={{ gap: spacing.xs }}><AppText weight="bold" style={design.heading}>Exam history</AppText><AppText style={design.mutedText}>A record of your submitted assessments.</AppText></View>
    {attempts.length === 0 ? <View style={design.emptyState}><AppText weight="bold" style={design.title}>No exams yet</AppText><AppText style={[design.mutedText, design.textCenter]}>Completed exams will appear here.</AppText></View> : attempts.map(attempt => <View key={attempt.attemptId} style={[design.card, { gap: spacing.sm }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><AppText weight="bold" style={design.title}>Exam #{attempt.quizId}</AppText><AppText weight="extraBold" style={{ color: colors.success, fontSize: 22 }}>{attempt.percentage}%</AppText></View>
      <AppText style={design.mutedText}>{attempt.score} of {attempt.total} correct</AppText>
      <AppText style={design.smallText}>{new Date(attempt.submittedAt).toLocaleString()}</AppText>
    </View>)}
    <Button text="Back to dashboard" variant="secondary" onPress={() => router.replace('/')} />
  </ScrollView></Screen>;
}
