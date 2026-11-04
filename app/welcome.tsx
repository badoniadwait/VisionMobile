import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors, spacing } from '@/constants/theme';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Welcome() {
  return (
    <Screen style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>VISION</Text>
        <Text style={styles.title}>Secure exams, made simple.</Text>
        <Text style={styles.subtitle}>Sign in to continue as a student or manage your exams as an admin.</Text>
      </View>
      <View style={styles.actions}>
        <Button text="Student login" onPress={() => router.push('/login')} />
        <Button text="Admin login" variant="secondary" onPress={() => router.push('/adminLogin')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'space-between', paddingVertical: spacing.xl },
  hero: { marginTop: spacing.xl * 2 },
  kicker: { color: colors.primary, fontSize: 14, fontWeight: '800', letterSpacing: 2 },
  title: { color: colors.text, fontSize: 40, fontWeight: '800', lineHeight: 46, marginTop: spacing.md },
  subtitle: { color: colors.mutedText, fontSize: 17, lineHeight: 25, marginTop: spacing.md },
  actions: { gap: spacing.md },
});
