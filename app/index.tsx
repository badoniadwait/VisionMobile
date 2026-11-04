import { getStoredStudent, logout } from '@/auth/auth';
import { ApiError } from '@/api/client';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors, radii, spacing } from '@/constants/theme';
import { fetchAvailableQuizzes } from '@/services/studentService';
import { QuizSummary } from '@/types/quiz';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

function formatExpiry(value: string) {
  return new Date(value).toLocaleString([], { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
}

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
      const [storedStudent, availableQuizzes] = await Promise.all([
        getStoredStudent(),
        fetchAvailableQuizzes(),
      ]);
      setStudent({ sapId: storedStudent.sapId, name: storedStudent.name });
      setQuizzes(availableQuizzes);
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Unable to load your student dashboard.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function onLogout() {
    await logout();
    router.replace('/welcome');
  }

  return (
    <Screen style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.primary} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>STUDENT PORTAL</Text>
            <Text style={styles.greeting}>Hi, {student.name || 'Student'}.</Text>
            <Text style={styles.sapId}>{student.sapId || 'Your exams are waiting.'}</Text>
          </View>
          <Pressable style={styles.profileButton} onPress={() => router.push('/studentProfile')}>
            <Text style={styles.profileInitial}>{(student.name || 'S').charAt(0).toUpperCase()}</Text>
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>READY WHEN YOU ARE</Text>
          <Text style={styles.heroTitle}>Verify your face before the exam.</Text>
          <Text style={styles.heroText}>Use a well-lit space and keep your face inside the frame.</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available exams</Text>
          <Text style={styles.count}>{quizzes.length}</Text>
        </View>
        <Button text="View exam history" variant="secondary" onPress={() => router.push('/examHistory')} />

        {loading ? <Text style={styles.helper}>Loading available exams…</Text> : null}
        {error ? (
          <View style={styles.messageCard}>
            <Text style={styles.error}>{error}</Text>
            <Button text="Try again" variant="secondary" onPress={() => load()} />
          </View>
        ) : null}
        {!loading && !error && quizzes.length === 0 ? <Text style={styles.helper}>No active exams are available right now.</Text> : null}
        {quizzes.map(quiz => (
          <View key={quiz.id} style={styles.quizCard}>
            <View style={styles.quizTopLine}>
              <Text style={styles.quizTitle}>Exam #{quiz.id}</Text>
              <Text style={styles.activePill}>ACTIVE</Text>
            </View>
            <Text style={styles.quizMeta}>{quiz.questionCount} questions · {quiz.durationMinutes} minutes</Text>
            <Text style={styles.expiry}>Closes {formatExpiry(quiz.expiresAt)}</Text>
            <Button text="Start verification" onPress={() => router.push({ pathname: '/cameraPreviewPage', params: { quizId: String(quiz.id) } })} />
          </View>
        ))}

        <Button text="Sign out" variant="secondary" onPress={onLogout} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingBottom: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1.5 },
  greeting: { color: colors.text, fontSize: 30, fontWeight: '800', marginTop: spacing.xs },
  sapId: { color: colors.mutedText, fontSize: 14, marginTop: spacing.xs },
  profileButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  profileInitial: { color: '#fff', fontSize: 20, fontWeight: '800' },
  heroCard: { backgroundColor: colors.primary, borderRadius: radii.lg, padding: spacing.lg, marginBottom: spacing.xl },
  heroLabel: { color: '#BFDBFE', fontSize: 12, fontWeight: '800', letterSpacing: 1.2 },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: '800', lineHeight: 30, marginTop: spacing.sm },
  heroText: { color: '#DBEAFE', fontSize: 14, lineHeight: 21, marginTop: spacing.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  sectionTitle: { color: colors.text, fontSize: 21, fontWeight: '800' },
  count: { color: colors.primary, backgroundColor: '#DBEAFE', borderRadius: radii.pill, paddingHorizontal: 9, paddingVertical: 3, fontWeight: '800' },
  helper: { color: colors.mutedText, fontSize: 15, marginBottom: spacing.lg },
  messageCard: { gap: spacing.md, marginBottom: spacing.lg },
  error: { color: colors.danger, lineHeight: 21 },
  quizCard: { backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing.md, marginBottom: spacing.md, gap: spacing.sm, borderWidth: 1, borderColor: colors.border },
  quizTopLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quizTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  activePill: { color: colors.success, fontSize: 11, fontWeight: '800' },
  quizMeta: { color: colors.text, fontSize: 14 },
  expiry: { color: colors.mutedText, fontSize: 13, marginBottom: spacing.sm },
});
