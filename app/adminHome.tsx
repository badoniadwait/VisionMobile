import { logout } from '@/auth/auth';
import { ApiError } from '@/api/client';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors, radii, spacing } from '@/constants/theme';
import { deleteQuiz, fetchAdminDashboard } from '@/services/adminService';
import { AdminDashboard } from '@/types/adminDashboard';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AdminHome() {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try { setDashboard(await fetchAdminDashboard()); }
    catch (requestError) { setError(requestError instanceof ApiError ? requestError.message : 'Unable to load the admin dashboard.'); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function refresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  function confirmDelete(id: number) {
    Alert.alert('Delete quiz?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { try { await deleteQuiz(id); await load(); } catch { Alert.alert('Delete failed', 'The quiz could not be deleted.'); } } },
    ]);
  }

  async function signOut() { await logout(); router.replace('/welcome'); }

  return (
    <Screen style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />}>
        <View style={styles.header}>
          <View><Text style={styles.eyebrow}>ADMIN WORKSPACE</Text><Text style={styles.title}>Dashboard</Text></View>
          <Pressable style={styles.profileButton} onPress={() => router.push('/adminProfile')}><Text style={styles.profileIcon}>◎</Text></Pressable>
        </View>
        {error ? <View style={styles.errorCard}><Text style={styles.error}>{error}</Text><Button text="Try again" variant="secondary" onPress={load} /></View> : null}
        <View style={styles.stats}><View style={styles.statCard}><Text style={styles.statValue}>{dashboard?.quizCount ?? '—'}</Text><Text style={styles.statLabel}>Quizzes</Text></View><View style={styles.statCard}><Text style={styles.statValue}>{dashboard?.studentCount ?? '—'}</Text><Text style={styles.statLabel}>Students</Text></View></View>
        <View style={styles.actions}><Button text="Create quiz" onPress={() => router.push('/createQuiz')} /><Button text="Register student" variant="secondary" onPress={() => router.push('/registerStudent')} /></View>
        <Text style={styles.sectionTitle}>Recent quizzes</Text>
        {dashboard?.quizzes.length ? dashboard.quizzes.map(quiz => <View key={quiz.id} style={styles.quizCard}><Pressable onPress={() => router.push({ pathname: '/adminQuizDetail', params: { id: String(quiz.id) } })}><View style={styles.quizLine}><Text style={styles.quizTitle}>Quiz #{quiz.id}</Text><Text style={styles.quizMeta}>{quiz.questionCount} questions</Text></View><Text style={styles.quizMeta}>{quiz.durationMinutes} minutes · closes {new Date(quiz.expiresAt).toLocaleString([], { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</Text><Text style={styles.view}>View questions</Text></Pressable><Pressable onPress={() => confirmDelete(quiz.id)}><Text style={styles.delete}>Delete quiz</Text></Pressable></View>) : <Text style={styles.empty}>No quizzes created yet.</Text>}
        <Button text="Sign out" variant="secondary" onPress={signOut} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingBottom: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
  eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1.5 },
  title: { color: colors.text, fontSize: 32, fontWeight: '800', marginTop: spacing.xs },
  profileButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center' },
  profileIcon: { color: colors.primary, fontSize: 28, fontWeight: '800' },
  stats: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  statCard: { flex: 1, backgroundColor: colors.surface, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  statValue: { color: colors.primary, fontSize: 30, fontWeight: '800' },
  statLabel: { color: colors.mutedText, marginTop: spacing.xs },
  actions: { gap: spacing.sm, marginBottom: spacing.xl },
  sectionTitle: { color: colors.text, fontSize: 21, fontWeight: '800', marginBottom: spacing.md },
  quizCard: { backgroundColor: colors.surface, borderRadius: radii.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md, gap: spacing.sm },
  quizLine: { flexDirection: 'row', justifyContent: 'space-between' },
  quizTitle: { color: colors.text, fontSize: 17, fontWeight: '800' },
  quizMeta: { color: colors.mutedText, fontSize: 13 },
  delete: { color: colors.danger, fontSize: 14, fontWeight: '700', marginTop: spacing.xs },
  view: { color: colors.primary, fontSize: 14, fontWeight: '700', marginTop: spacing.xs },
  empty: { color: colors.mutedText, marginBottom: spacing.lg },
  errorCard: { gap: spacing.md, marginBottom: spacing.lg },
  error: { color: colors.danger },
});
