import { ApiError } from '@/api/client';
import { getStoredStudent, logout } from '@/auth/auth';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors, styles as design, radius, spacing } from '@/helper/style';
import { fetchAvailableQuizzes } from '@/services/studentService';
import { QuizSummary } from '@/types/quiz';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, View } from 'react-native';

function formatExpiry(value: string) { return new Date(value).toLocaleString([], { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }); }

export default function StudentHome() {
  const [student, setStudent] = useState<{ sapId: string | null; name: string | null }>({ sapId: null, name: null });
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true); else setLoading(true);
    setError(null);
    try {
      const [storedStudent, availableQuizzes] = await Promise.all([getStoredStudent(), fetchAvailableQuizzes()]);
      setStudent({ sapId: storedStudent.sapId, name: storedStudent.name });
      setQuizzes(availableQuizzes);
    } catch (requestError) { setError(requestError instanceof ApiError ? requestError.message : 'Unable to load your student dashboard.'); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  async function onLogout() { await logout(); router.replace('/welcome'); }

  return (
    <Screen style={{ paddingHorizontal: 0, paddingTop: 0 }} contentStyle={{ maxWidth: 640 }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xxxl, gap: spacing.lg }} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.info} />}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ gap: spacing.xs }}>
            <AppText weight="bold" style={[design.caption, { letterSpacing: 1.2 }]}>STUDENT PORTAL</AppText>
            <AppText weight="bold" style={design.heading}>Hi, {student.name || 'Student'}.</AppText>
            <AppText style={design.mutedText}>{student.sapId || 'Your exams are waiting.'}</AppText>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Open profile" onPress={() => router.push('/studentProfile')} style={[design.avatar, { backgroundColor: colors.primary }]}>
            <AppText weight="bold" style={{ color: colors.primaryForeground, fontSize: 17 }}>{(student.name || 'S').charAt(0).toUpperCase()}</AppText>
          </Pressable>
        </View>

        <View style={{ backgroundColor: colors.primary, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.md }}>
          <AppText weight="bold" style={{ color: colors.primaryForeground, fontSize: 11, letterSpacing: 1.2 }}>READY WHEN YOU ARE</AppText>
          <AppText weight="bold" style={{ color: colors.primaryForeground, fontSize: 22, lineHeight: 29 }}>Verify your face before the exam.</AppText>
          <AppText style={{ color: '#d7d9de', lineHeight: 22 }}>Use a well-lit space and keep your face inside the frame.</AppText>
        </View>

        <View style={[design.card, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
          <View style={{ gap: spacing.xs }}><AppText weight="bold" style={design.title}>Available exams</AppText><AppText style={design.mutedText}>Your active assessments</AppText></View>
          <AppText weight="extraBold" style={{ color: colors.info, fontSize: 30 }}>{quizzes.length}</AppText>
        </View>
        <Button text="View exam history" variant="secondary" onPress={() => router.push('/examHistory')} />

        {loading ? <View style={design.card}><AppText style={design.mutedText}>Loading available exams…</AppText></View> : null}
        {error ? <View style={[design.alert, { gap: spacing.md }]}><AppText style={design.alertText}>{error}</AppText><Button text="Try again" variant="secondary" onPress={() => load()} /></View> : null}
        {!loading && !error && quizzes.length === 0 ? <View style={design.emptyState}><AppText weight="bold" style={design.title}>No exams available</AppText><AppText style={[design.mutedText, design.textCenter]}>Check back later for your next assessment.</AppText></View> : null}
        {quizzes.map(quiz => (
          <View key={quiz.id} style={[design.card, { gap: spacing.md }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <AppText weight="bold" style={design.title}>Exam #{quiz.id}</AppText>
              <View style={[design.badge, design.badgeSuccess]}><AppText weight="bold" style={[design.badgeText, design.badgeSuccessText]}>ACTIVE</AppText></View>
            </View>
            <AppText style={design.mutedText}>{quiz.questionCount} questions · {quiz.durationMinutes} minutes</AppText>
            <AppText style={design.smallText}>Closes {formatExpiry(quiz.expiresAt)}</AppText>
            <Button text="Start verification" onPress={() => router.push({ pathname: '/cameraPreviewPage', params: { quizId: String(quiz.id) } })} />
          </View>
        ))}
        <Button text="Sign out" variant="outline" onPress={onLogout} />
      </ScrollView>
    </Screen>
  );
}
