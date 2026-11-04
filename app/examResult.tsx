import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors, radii, spacing } from '@/constants/theme';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ExamResult() {
  const params = useLocalSearchParams<{ score: string; total: string; percentage: string }>();
  return (
    <Screen style={styles.screen}>
      <View style={styles.icon}><Text style={styles.check}>✓</Text></View>
      <Text style={styles.title}>Exam submitted</Text>
      <Text style={styles.subtitle}>Your answers were submitted successfully.</Text>
      <View style={styles.scoreCard}>
        <Text style={styles.score}>{params.percentage || '0'}%</Text>
        <Text style={styles.scoreLabel}>{params.score || '0'} of {params.total || '0'} correct</Text>
      </View>
      <Button text="Back to dashboard" onPress={() => router.replace('/')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { justifyContent: 'center', alignItems: 'center', gap: spacing.md },
  icon: { width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center', backgroundColor: '#DCFCE7' },
  check: { color: colors.success, fontSize: 42, fontWeight: '800' },
  title: { color: colors.text, fontSize: 30, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: colors.mutedText, fontSize: 16, textAlign: 'center' },
  scoreCard: { width: '100%', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radii.lg, padding: spacing.xl, marginVertical: spacing.lg, borderWidth: 1, borderColor: colors.border },
  score: { color: colors.primary, fontSize: 52, fontWeight: '800' },
  scoreLabel: { color: colors.mutedText, fontSize: 16, marginTop: spacing.xs },
});
