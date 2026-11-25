import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/AppText';
import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { colors, radius, spacing, styles as design } from '@/helper/style';

export default function Welcome() {
  return (
    <Screen>
        <View style={{ flex: 1, justifyContent: 'space-between', paddingVertical: spacing.xxxl }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <View style={{ width: 42, height: 42, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
            <AppText weight="extraBold" style={{ color: colors.primaryForeground, fontSize: 20 }}>V</AppText>
          </View>
          <AppText weight="extraBold" style={design.brand}>VISION</AppText>
        </View>
        <View style={{ gap: spacing.lg }}>
          <View style={{ alignSelf: 'flex-start', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.round, backgroundColor: colors.accent }}>
            <AppText weight="bold" style={{ color: colors.info, fontSize: 11, letterSpacing: 1.1 }}>SECURE EXAMINATION</AppText>
          </View>
            <AppText weight="extraBold" style={{ color: colors.foreground, fontSize: 36, lineHeight: 44, letterSpacing: -1.2 }}>A smarter way to take your exams.</AppText>
          <AppText style={[design.mutedText, { fontSize: 16, lineHeight: 26 }]}>Online quiz examination with a simple, secure student experience.</AppText>
        </View>
        <View style={{ gap: spacing.md }}>
          <Button text="Student login" onPress={() => router.push('/login')} fullWidth />
          <AppText style={[design.caption, design.textCenter]}>Sign in with your student account to continue.</AppText>
        </View>
      </View>
    </Screen>
  );
}
