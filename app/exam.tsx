import { API_URL } from '@/api/client';
import { Button } from '@/components/Button';
import { QuizQuestionCard } from '@/components/QuizQuestionCard';
import { Screen } from '@/components/Screen';
import { QuizQuestion, QuizResponse, QuizResult } from '@/types/quiz';
import { useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Exam = () => {

  const { quizId } = useLocalSearchParams<{ quizId: string }>();
  const [answers, setAnswers] = React.useState<Record<string, string>>({});

  const [questions, setQuestions] = React.useState<QuizQuestion[]>([]);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const token = await SecureStore.getItemAsync('auth_token');

        const res = await fetch(`${API_URL}/api/quiz`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            id: quizId,
          },
        });

        const quizData: QuizResponse = await res.json();

        if (!res.ok) {
          throw new Error(`Quiz API failed: ${res.status}`);
        }

        setQuestions(quizData.questions);

        console.log('Question 1:', quizData.questions[0].question);
        console.log('options:', quizData.questions[0].options);
        console.log('answer:', quizData.questions[0].answer);

      } catch (error) {
        console.error('Quiz fetch error:', error);
      }
    }

    if (quizId) {
      fetchQuiz();
    }

  }, [quizId]);


  const handleAnswerSelect = (questionNo: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionNo]: answer,
    }));
  };

  async function handleQuestionSubmit() {

    const token = await SecureStore.getItemAsync('auth_token');

    console.log('Submitted answers:', answers);
    const res = await fetch(`${API_URL}/api/quiz/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'id': quizId
      },
      body: JSON.stringify(answers),
    });

    const data: QuizResult = await res.json();

    console.log(data);

  }

  return (
    <Screen>
      <Text>Exam #{quizId}</Text>

      <View>
        {questions.map((question, index) => (
          <QuizQuestionCard
            key={index}
            questionNo={index + 1}
            question={question}
            selectedAnswer={answers[index + 1]}
            onSelect={(answer) =>
              handleAnswerSelect(index + 1, answer)
            }
          />
        ))}
      </View>

      <Button onPress={handleQuestionSubmit} text='Submit' />

    </Screen>
  );


};



export default Exam;

const styles = StyleSheet.create({});