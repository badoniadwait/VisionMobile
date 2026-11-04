import { ApiError } from '@/api/client';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors, radii, spacing } from '@/constants/theme';
import { createQuiz } from '@/services/adminService';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

type Question = { question: string; options: string[]; answer: string };
const blankQuestion = (): Question => ({ question: '', options: ['', '', '', ''], answer: '' });

export default function CreateQuiz() {
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [questions, setQuestions] = useState<Question[]>([blankQuestion(), blankQuestion()]);
  const [loading, setLoading] = useState(false);

  function updateQuestion(index: number, value: Partial<Question>) {
    setQuestions(current => current.map((question, questionIndex) => questionIndex === index ? { ...question, ...value } : question));
  }

  function updateOption(questionIndex: number, optionIndex: number, value: string) {
    setQuestions(current => current.map((question, index) => index === questionIndex ? { ...question, options: question.options.map((option, currentIndex) => currentIndex === optionIndex ? value : option) } : question));
  }

  async function submit() {
    const duration = Number(durationMinutes);
    if (!duration || duration <= 0 || questions.some(question => !question.question.trim() || question.options.some(option => !option.trim()) || !question.answer)) {
      Alert.alert('Incomplete quiz', 'Add a duration, two questions, four options, and a correct answer for each question.');
      return;
    }
    try {
      setLoading(true);
      await createQuiz({ durationMinutes: duration, questions });
      Alert.alert('Quiz created', 'The quiz is now available to assigned students.', [{ text: 'Done', onPress: () => router.replace('/adminHome') }]);
    } catch (error) {
      Alert.alert('Could not create quiz', error instanceof ApiError ? error.message : 'Please check the form and try again.');
    } finally { setLoading(false); }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.back} onPress={() => router.back()}>← Back</Text>
        <Text style={styles.title}>Create a quiz</Text>
        <Text style={styles.subtitle}>Each quiz currently requires exactly two questions.</Text>
        <Text style={styles.label}>Validity duration (minutes)</Text>
        <TextInput style={styles.input} value={durationMinutes} onChangeText={setDurationMinutes} keyboardType="number-pad" editable={!loading} />
        {questions.map((question, questionIndex) => <View key={questionIndex} style={styles.questionCard}><Text style={styles.questionTitle}>Question {questionIndex + 1}</Text><TextInput style={styles.input} placeholder="Question text" value={question.question} onChangeText={value => updateQuestion(questionIndex, { question: value })} editable={!loading} />{question.options.map((option, optionIndex) => <TextInput key={optionIndex} style={styles.input} placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`} value={option} onChangeText={value => updateOption(questionIndex, optionIndex, value)} editable={!loading} />)}<Text style={styles.label}>Correct answer</Text><View style={styles.answerRow}>{question.options.map((_, optionIndex) => <Text key={optionIndex} onPress={() => updateQuestion(questionIndex, { answer: String(optionIndex) })} style={[styles.answer, question.answer === String(optionIndex) && styles.answerSelected]}>Option {String.fromCharCode(65 + optionIndex)}</Text>)}</View></View>)}
        <Button text="Publish quiz" onPress={submit} loading={loading} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md, paddingBottom: spacing.xl },
  back: { color: colors.primary, fontSize: 16, fontWeight: '700', marginBottom: spacing.md },
  title: { color: colors.text, fontSize: 30, fontWeight: '800' },
  subtitle: { color: colors.mutedText, fontSize: 16, lineHeight: 23, marginBottom: spacing.md },
  label: { color: colors.text, fontSize: 14, fontWeight: '700' },
  input: { minHeight: 50, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, paddingHorizontal: spacing.md, backgroundColor: colors.surface, fontSize: 16 },
  questionCard: { gap: spacing.sm, padding: spacing.md, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, backgroundColor: '#F8FAFC' },
  questionTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: spacing.xs },
  answerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  answer: { color: colors.primary, borderWidth: 1, borderColor: colors.border, borderRadius: radii.sm, paddingHorizontal: spacing.sm, paddingVertical: spacing.sm, backgroundColor: colors.surface, fontSize: 13 },
  answerSelected: { color: '#fff', backgroundColor: colors.primary, borderColor: colors.primary },
});
