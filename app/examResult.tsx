import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/AppText';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { colors, radius, spacing, styles as design } from '@/helper/style';

export default function ExamResult() {
  const params = useLocalSearchParams<{ score: string; total: string; percentage: string }>();
  return <Screen><View style={{ flex: 1, justifyContent: 'center', gap: spacing.xl }}>
    <View style={{ width: 68, height: 68, borderRadius: radius.round, backgroundColor: '#eaf5ee', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}><AppText weight="bold" style={{ color: colors.success, fontSize: 32 }}>✓</AppText></View>
    <View style={{ gap: spacing.sm, alignItems: 'center' }}><AppText weight="bold" style={design.heading}>Exam submitted</AppText><AppText style={[design.mutedText, design.textCenter]}>Your answers were submitted successfully.</AppText></View>
    <View style={[design.panel, { alignItems: 'center', gap: spacing.sm }]}><AppText weight="extraBold" style={{ color: colors.info, fontSize: 48 }}>{params.percentage || '0'}%</AppText><AppText style={design.mutedText}>{params.score || '0'} of {params.total || '0'} correct</AppText></View>
    <Button text="Back to dashboard" onPress={() => router.replace('/')} fullWidth />
  </View></Screen>;
}
