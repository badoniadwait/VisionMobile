
import { spacing } from '@/helper/style';
import { QuizResult } from '@/types/quiz';
import React from 'react';
import { View } from 'react-native';
import { AppText } from './AppText';

type Props = {
  data: QuizResult;
};

export const QuizResults = ({ data }: Props) => {
  return (
    <View style={{ padding: spacing.md }}>
      <AppText weight="semiBold">
        Quiz #{data.quizId}
      </AppText>

      <AppText weight="bold">
        {data.marksObtained} / {data.totalMarks}
      </AppText>
    </View>
  );
};
