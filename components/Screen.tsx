import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, ViewProps } from 'react-native';
import { colors, spacing } from '@/constants/theme';

export function Screen({ children, style, ...props }: ViewProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View {...props} style={[styles.content, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.lg },
});
