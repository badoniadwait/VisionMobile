import { getStoredStudent, logout } from '@/auth/auth';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/AppText';
import { fetchStudentProfile } from '@/services/studentService';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, View } from 'react-native';
import { colors, radius, spacing, styles as design } from '@/helper/style';

export default function StudentProfile() {
  const [profile, setProfile] = useState<{ sapId: string; name: string; profileImageUrl: string } | null>(null);
  useEffect(() => {
    fetchStudentProfile().then(setProfile).catch(async () => {
      const stored = await getStoredStudent();
      if (stored.sapId && stored.name) setProfile({ sapId: stored.sapId, name: stored.name, profileImageUrl: stored.profileImageUrl ?? '' });
      else Alert.alert('Profile unavailable', 'Unable to load your profile.');
    });
  }, []);
  async function onLogout() { await logout(); router.replace('/welcome'); }
  return <Screen>
    <View style={{ flex: 1, gap: spacing.xl }}>
      <AppText weight="semiBold" style={design.link} onPress={() => router.back()}>← Back</AppText>
      <AppText weight="bold" style={design.heading}>My profile</AppText>
      <View style={[design.panel, { alignItems: 'center', gap: spacing.md }]}>
        {profile?.profileImageUrl ? <Image source={{ uri: profile.profileImageUrl }} style={styles.avatar} /> : <View style={[styles.avatar, { backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }]}><AppText weight="bold" style={{ color: colors.info, fontSize: 30 }}>{(profile?.name || 'S').charAt(0).toUpperCase()}</AppText></View>}
        <AppText weight="bold" style={design.subheading}>{profile?.name || 'Loading…'}</AppText>
        <AppText style={design.mutedText}>{profile?.sapId || ' '}</AppText>
      </View>
      <View style={[design.card, { gap: spacing.lg }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><AppText style={design.mutedText}>SAP ID</AppText><AppText weight="semiBold">{profile?.sapId || '—'}</AppText></View>
        <View style={design.divider} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><AppText style={design.mutedText}>Reference image</AppText><AppText weight="semiBold">{profile?.profileImageUrl ? 'Uploaded' : 'Unavailable'}</AppText></View>
      </View>
      <View style={{ marginTop: 'auto' }}><Button text="Sign out" variant="outline" onPress={onLogout} fullWidth /></View>
    </View>
  </Screen>;
}

const styles = { avatar: { width: 92, height: 92, borderRadius: radius.round } };
