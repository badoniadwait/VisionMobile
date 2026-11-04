import React from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native'
import { colors, radii, spacing } from '@/constants/theme'

export const Button = (
    {
        text,
        onPress,
        variant = 'primary',
        loading = false,
        disabled = false,
    }:{
        text: string
        onPress: () => void
        variant?: 'primary' | 'secondary' | 'danger'
        loading?: boolean
        disabled?: boolean
    }
) => {

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading ? <ActivityIndicator color={variant === 'secondary' ? colors.primary : '#fff'} /> : <Text style={textStyles[variant]}>{text}</Text>}
    </Pressable>
  )
}


const styles = StyleSheet.create({
  base: { minHeight: 52, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  danger: { backgroundColor: colors.danger },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryText: { color: colors.text, fontSize: 16, fontWeight: '700' },
  dangerText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.82 },
})

const textStyles = {
  primary: styles.primaryText,
  secondary: styles.secondaryText,
  danger: styles.dangerText,
};
