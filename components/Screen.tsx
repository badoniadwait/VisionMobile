import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import { colors, spacing } from '@/helper/style';

type Props = ViewProps & { contentStyle?: StyleProp<ViewStyle> };

export function Screen({ children, style, contentStyle, ...props }: Props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View {...props} style={[{ flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md }, style]}>
        <View style={[{ flex: 1, width: '100%', maxWidth: 560, alignSelf: 'center' }, contentStyle]}>{children}</View>
      </View>
    </SafeAreaView>
  );
}
