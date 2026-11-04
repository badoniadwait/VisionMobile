import { getStoredStudent, logout } from '@/auth/auth';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors, radii, spacing } from '@/constants/theme';
import { fetchStudentProfile } from '@/services/studentService';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';

export default function StudentProfile() {
  const [profile, setProfile] = useState<{ sapId: string; name: string; profileImageUrl: string } | null>(null);

  useEffect(() => {
    fetchStudentProfile()
      .then(setProfile)
      .catch(async () => {
        const stored = await getStoredStudent();
        if (stored.sapId && stored.name) setProfile({ sapId: stored.sapId, name: stored.name, profileImageUrl: stored.profileImageUrl ?? '' });
        else Alert.alert('Profile unavailable', 'Unable to load your profile.');
      });
  }, []);

  async function onLogout() {
    await logout();
    router.replace('/welcome');
  }

  return (
    <Screen>
      <Text style={styles.back} onPress={() => router.back()}>← Back</Text>
      <Text style={styles.title}>My profile</Text>
      <View style={styles.profileCard}>
        {profile?.profileImageUrl ? <Image source={{ uri: profile.profileImageUrl }} style={styles.avatar} /> : <View style={styles.avatarFallback}><Text style={styles.avatarText}>{(profile?.name || 'S').charAt(0)}</Text></View>}
        <Text style={styles.name}>{profile?.name || 'Loading…'}</Text>
        <Text style={styles.sapId}>{profile?.sapId || ' '}</Text>
      </View>
      <View style={styles.detailRow}><Text style={styles.label}>SAP ID</Text><Text style={styles.value}>{profile?.sapId || '—'}</Text></View>
      <View style={styles.detailRow}><Text style={styles.label}>Reference image</Text><Text style={styles.value}>{profile?.profileImageUrl ? 'Uploaded' : 'Unavailable'}</Text></View>
      <Button text="Sign out" variant="secondary" onPress={onLogout} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { color: colors.primary, fontSize: 16, fontWeight: '700', marginBottom: spacing.lg },
  title: { color: colors.text, fontSize: 32, fontWeight: '800', marginBottom: spacing.lg },
  profileCard: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: radii.lg, padding: spacing.xl, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg },
  avatar: { width: 92, height: 92, borderRadius: 46, marginBottom: spacing.md },
  avatarFallback: { width: 92, height: 92, borderRadius: 46, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  avatarText: { color: '#fff', fontSize: 36, fontWeight: '800' },
  name: { color: colors.text, fontSize: 23, fontWeight: '800' },
  sapId: { color: colors.mutedText, fontSize: 15, marginTop: spacing.xs },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { color: colors.mutedText, fontSize: 15 },
  value: { color: colors.text, fontSize: 15, fontWeight: '700' },
});
