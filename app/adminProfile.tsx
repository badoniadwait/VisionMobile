import { ApiError } from '@/api/client';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors, radii, spacing } from '@/constants/theme';
import { fetchAdminProfile, requestVerificationEmail } from '@/services/adminService';
import { AdminProfile as Profile } from '@/types/adminDashboard';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

export default function AdminProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => { fetchAdminProfile().then(setProfile).catch(() => Alert.alert('Profile unavailable', 'Unable to load your admin profile.')); }, []);

  async function verify() {
    try { setLoading(true); const response = await requestVerificationEmail(); Alert.alert('Email sent', response.message); }
    catch (error) { Alert.alert('Verification failed', error instanceof ApiError ? error.message : 'Unable to send verification email.'); }
    finally { setLoading(false); }
  }

  return (
    <Screen>
      <Text style={styles.back} onPress={() => router.back()}>← Back</Text>
      <Text style={styles.title}>Admin profile</Text>
      <View style={styles.card}><Text style={styles.name}>{profile?.name || 'Loading…'}</Text><Text style={styles.email}>{profile?.email || ' '}</Text><Text style={styles.subject}>{profile?.subject || ' '}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Email status</Text><Text style={[styles.value, profile?.verified ? styles.verified : styles.unverified]}>{profile?.verified ? 'Verified' : 'Not verified'}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Registered students</Text><Text style={styles.value}>{profile?.studentCount ?? '—'}</Text></View>
      {!profile?.verified ? <Button text="Send verification email" onPress={verify} loading={loading} /> : null}
      <Button text="Back to dashboard" variant="secondary" onPress={() => router.replace('/adminHome')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { color: colors.primary, fontSize: 16, fontWeight: '700', marginBottom: spacing.lg },
  title: { color: colors.text, fontSize: 32, fontWeight: '800', marginBottom: spacing.lg },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, padding: spacing.lg, marginBottom: spacing.lg },
  name: { color: colors.text, fontSize: 24, fontWeight: '800' },
  email: { color: colors.mutedText, fontSize: 15, marginTop: spacing.sm },
  subject: { color: colors.primary, fontSize: 14, fontWeight: '700', marginTop: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { color: colors.mutedText },
  value: { color: colors.text, fontWeight: '700' },
  verified: { color: colors.success },
  unverified: { color: colors.danger },
});
