import { QuizQuestion } from '@/types/quiz';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, fontFamilies, radius, spacing, styles as design, typography } from '@/helper/style';
import { AppText } from './AppText';

type QuizQuestionCardProps = {
  questionNo: number;
  question: QuizQuestion;
  selectedAnswer?: string;
  onSelect: (answer: string) => void;
};

export const QuizQuestionCard = ({
  questionNo,
  question,
  selectedAnswer,
  onSelect,
}: QuizQuestionCardProps) => {
  if (!question) return null;

  return (
    <View style={styles.container}>
      <AppText weight="semiBold" style={styles.question}>
        {questionNo}. {question.question}
      </AppText>

      {question.options.map((option, index) => {
        const selected = selectedAnswer === option;

        return (
          <Pressable
            key={index}
            style={[styles.option, selected && styles.optionSelected]}
            onPress={() => onSelect(option)}
          >
            <AppText style={styles.optionText}>
              {option}
            </AppText>

            <View style={[styles.radio, selected && styles.radioSelected]}>
              {selected && <View style={styles.radioDot} />}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...design.card,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  question: {
    fontSize: typography.title,
    lineHeight: 25,
  },
  option: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.card,
  },
  optionSelected: {
    borderColor: colors.info,
    backgroundColor: colors.accent,
  },
  optionText: {
    fontFamily: fontFamilies.regular,
    fontSize: typography.body,
    lineHeight: 21,
    color: colors.foreground,
    flex: 1,
    marginRight: spacing.md,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: radius.round,
    borderWidth: 1.5,
    borderColor: colors.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.info,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: radius.round,
    backgroundColor: colors.info,
  },
});
