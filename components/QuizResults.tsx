
import { spacing, styles as design } from '@/helper/style';
import { QuizResult } from '@/types/quiz';
import React from 'react';
import { View } from 'react-native';
import { AppText } from './AppText';

type Props = {
  data: QuizResult;
};

export const QuizResults = ({ data }: Props) => {
  return (
    <View style={[design.card, { gap: spacing.xs }]}>
      <AppText weight="semiBold" style={design.smallText}>
        Quiz #{data.quizId}
      </AppText>

      <AppText weight="bold" style={design.subheading}>
        {data.marksObtained} / {data.totalMarks}
      </AppText>
    </View>
  );
};
