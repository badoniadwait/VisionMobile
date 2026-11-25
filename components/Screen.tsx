import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import { styles as design } from '@/helper/style';

type Props = ViewProps & { contentStyle?: StyleProp<ViewStyle> };

export function Screen({ children, style, contentStyle, ...props }: Props) {
  return (
    <SafeAreaView style={design.screen}>
      <View {...props} style={[design.screenFrame, style]}>
        <View style={[design.screenContainer, contentStyle]}>{children}</View>
      </View>
    </SafeAreaView>
  );
}
