
import { QuizQuestion } from '@/types/quiz';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
      <Text style={styles.question}>
        {questionNo}. {question.question}
      </Text>

      {question.options.map((option, index) => {
        const selected = selectedAnswer === option;

        return (
          <Pressable
            key={index}
            style={styles.option}
            onPress={() => onSelect(option)}
          >
            <Text style={styles.optionText}>
              {option}
            </Text>

            <View style={styles.radio}>
              {selected && <View style={styles.radioSelected} />}
            </View>
          </Pressable>
        );
      })}
    </View>


  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 14,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },

  optionText: {
    fontSize: 16,
    flex: 1,
    marginRight: 12,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563eb',
  },
});
