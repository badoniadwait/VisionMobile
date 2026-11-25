import { Link, Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { AppText } from '@/components/AppText';
import { colors, fontFamilies, spacing, styles as design } from '@/helper/style';

export default function NotFoundScreen() {
  return <>
    <Stack.Screen options={{ title: 'Oops!', headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.foreground, headerTitleStyle: { fontFamily: fontFamilies.bold } }} />
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, gap: spacing.md, backgroundColor: colors.background }}>
      <AppText weight="bold" style={design.heading}>This screen doesn’t exist.</AppText>
      <Link href="/" style={{ paddingVertical: spacing.md }}><AppText weight="semiBold" style={design.link}>Go to home screen</AppText></Link>
    </View>
  </>;
}
