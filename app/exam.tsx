import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors, radii, spacing } from '@/constants/theme';
import { fetchQuiz, submitQuiz } from '@/services/studentService';
import { QuizDetails } from '@/types/quiz';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
}

export default function Exam() {
  const params = useLocalSearchParams<{ quizId: string | string[] }>();
  const quizId = Array.isArray(params.quizId) ? params.quizId[0] : params.quizId;
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizDetails | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!quizId) return;
    fetchQuiz(quizId)
      .then(data => {
        setQuiz(data);
        setSecondsLeft(data.durationMinutes * 60);
      })
      .catch(() => Alert.alert('Exam unavailable', 'This exam may have expired.', [{ text: 'Back', onPress: () => router.replace('/') }]))
      .finally(() => setLoading(false));
  }, [quizId, router]);

  useEffect(() => {
    if (!quiz || submitting || secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft(value => value - 1), 1000);
    return () => clearInterval(timer);
  }, [quiz, submitting, secondsLeft]);

  useEffect(() => {
    if (quiz && secondsLeft === 0 && !submitting) submit();
  }, [secondsLeft, quiz, submitting]);

  const question = quiz?.questions[current];
  const answered = useMemo(() => Object.keys(answers).length, [answers]);

  async function submit() {
    if (!quizId || !quiz || submitting) return;
    setSubmitting(true);
    try {
      const result = await submitQuiz(quizId, answers);
      router.replace({ pathname: '/examResult', params: { score: String(result.score), total: String(result.total), percentage: String(result.percentage) } });
    } catch {
      setSubmitting(false);
      Alert.alert('Submission failed', 'Your answers could not be submitted. Please try again.');
    }
  }

  if (loading || !quiz || !question) {
    return <Screen style={styles.center}><Text style={styles.body}>Loading exam…</Text></Screen>;
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.topBar}>
        <Text style={styles.progress}>Question {current + 1} of {quiz.questions.length}</Text>
        <Text style={[styles.timer, secondsLeft < 60 && styles.timerWarning]}>{formatTime(secondsLeft)}</Text>
      </View>
      <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${((current + 1) / quiz.questions.length) * 100}%` }]} /></View>
      <Text style={styles.question}>{question.question}</Text>
      <View style={styles.options}>
        {question.options.map((option, index) => {
          const selected = answers[question.id] === index;
          return (
            <Pressable key={option} onPress={() => setAnswers(value => ({ ...value, [question.id]: index }))} style={[styles.option, selected && styles.selectedOption]}>
              <Text style={[styles.optionLetter, selected && styles.selectedOptionLetter]}>{String.fromCharCode(65 + index)}</Text>
              <Text style={[styles.optionText, selected && styles.selectedOptionText]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.bottom}>
        <Text style={styles.answered}>{answered} answered</Text>
        {current < quiz.questions.length - 1 ? <Button text="Next question" onPress={() => setCurrent(value => value + 1)} /> : <Button text="Submit exam" onPress={submit} loading={submitting} />}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.lg },
  center: { justifyContent: 'center', alignItems: 'center' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progress: { color: colors.mutedText, fontSize: 15, fontWeight: '700' },
  timer: { color: colors.primary, fontSize: 18, fontWeight: '800' },
  timerWarning: { color: colors.danger },
  progressTrack: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 6, backgroundColor: colors.primary },
  question: { color: colors.text, fontSize: 25, fontWeight: '800', lineHeight: 33, marginTop: spacing.lg },
  options: { gap: spacing.md },
  option: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  selectedOption: { borderColor: colors.primary, backgroundColor: '#EFF6FF' },
  optionLetter: { width: 32, height: 32, borderRadius: 16, textAlign: 'center', textAlignVertical: 'center', backgroundColor: colors.border, color: colors.text, fontWeight: '800', paddingTop: 7 },
  selectedOptionLetter: { backgroundColor: colors.primary, color: '#fff' },
  optionText: { flex: 1, color: colors.text, fontSize: 16, lineHeight: 22 },
  selectedOptionText: { color: colors.primary, fontWeight: '700' },
  body: { color: colors.mutedText, fontSize: 16 },
  bottom: { marginTop: 'auto', gap: spacing.sm },
  answered: { color: colors.mutedText, textAlign: 'center', fontSize: 13 },
});
