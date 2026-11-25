import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from './AppText';
import { colors, styles as design } from '@/helper/style';

type Variant = 'primary' | 'secondary' | 'danger' | 'outline' | 'success';
type Props = {
  text: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
};

export function Button({ text, onPress, variant = 'primary', loading = false, disabled = false, fullWidth = false, style }: Props) {
  const inactive = disabled || loading;
  const labelColor = variant === 'primary' || variant === 'danger' || variant === 'success'
    ? colors.primaryForeground
    : variant === 'secondary'
      ? colors.secondaryForeground
      : colors.foreground;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={inactive}
      style={({ pressed }) => [design.button, variantStyles[variant], fullWidth && design.buttonFull, inactive && design.buttonDisabled, pressed && !inactive && local.pressed, style]}
    >
      {loading ? <ActivityIndicator color={labelColor} /> : <AppText weight="semiBold" style={[design.buttonText, { color: labelColor }]}>{text}</AppText>}
    </Pressable>
  );
}

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.primary, borderColor: colors.primary },
  secondary: { backgroundColor: colors.secondary, borderColor: colors.border },
  danger: { backgroundColor: colors.destructive, borderColor: colors.destructive },
  success: { backgroundColor: colors.success, borderColor: colors.success },
  outline: { backgroundColor: 'transparent', borderColor: colors.border },
});
const local = StyleSheet.create({ pressed: { opacity: 0.88 } });
