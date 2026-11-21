import React from 'react';
import { Text, TextProps } from 'react-native';
import { colors, fontFamilies } from '@/helper/style';

type Props = TextProps & { weight?: keyof typeof fontFamilies };

export function AppText({ weight = 'regular', style, ...props }: Props) {
  return <Text {...props} style={[{ fontFamily: fontFamilies[weight], color: colors.foreground }, style]} />;
}
