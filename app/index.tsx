
import { ApiError } from '@/api/client';
import { getStoredStudent } from '@/auth/auth';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { quizResultPostPath } from '@/helper/helper';
import { colors, styles as design, radius, spacing } from '@/helper/style';
import { fetchAvailableQuizzes, fetchStudentProfile } from '@/services/studentService';
import { QuizResult, QuizSummary } from '@/types/quiz';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';

function formatExpiry(value: string) {
  return new Date(value).toLocaleString([], {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function StudentHome() {

  const [profile, setProfile] = useState<{ sapId: string; name: string; profileImageUrl: string } | null>(null);

  const [student, setStudent] = useState<{
    sapId: string | null;
    name: string | null;
  }>({ sapId: null, name: null });

  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [submittedQuizzes, setSubmittedQuizzes] = useState<
    Record<string, QuizResult | null>
  >({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [checkingResults, setCheckingResults] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await fetchStudentProfile();
        setProfile(data);
      } catch {
        try {
          const stored = await getStoredStudent();

          if (stored.sapId && stored.name) {
            setProfile({
              sapId: stored.sapId,
              name: stored.name,
              profileImageUrl: stored.profileImageUrl ?? '',
            });
          } else {
            Alert.alert(
              'Profile unavailable',
              'Unable to load your profile.'
            );
          }
        } catch {
          Alert.alert(
            'Profile unavailable',
            'Unable to load your profile.'
          );
        }
      }
    }

    loadProfile();
  }, []);

  async function checkIfStudentHaveSubmittedQuiz(
    studentId: string,
    quizId: string | number
  ): Promise<QuizResult | null> {
    try {
      const token = await SecureStore.getItemAsync('auth_token');

      if (!token) return null;

      const res = await fetch(quizResultPostPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId,
          quizId,
        }),
      });

      if (!res.ok) return null;

      const result: QuizResult | null = await res.json();

      if (!result || String(result.quizId) !== String(quizId)) {
        return null;
      }

      return result;
    } catch (error) {
      console.log('Quiz submission check error:', error);
      return null;
    }
  }

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);

    setError(null);
    setSubmittedQuizzes({});

    try {
      const [storedStudent, availableQuizzes] = await Promise.all([
        getStoredStudent(),
        fetchAvailableQuizzes(),
      ]);

      setStudent({
        sapId: storedStudent.sapId,
        name: storedStudent.name,
      });

      setQuizzes(availableQuizzes);

      if (storedStudent.sapId && availableQuizzes.length > 0) {
        setCheckingResults(true);

        const submissionStatus = await Promise.all(
          availableQuizzes.map(async (quiz) => {
            const result = await checkIfStudentHaveSubmittedQuiz(
              storedStudent.sapId!,
              quiz.id
            );

            return [String(quiz.id), result] as const;
          })
        );

        setSubmittedQuizzes(Object.fromEntries(submissionStatus));
      } else {
        setSubmittedQuizzes({});
      }
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : 'Unable to load your student dashboard.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
      setCheckingResults(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);



  return (
    <Screen
      style={{ paddingHorizontal: 0, paddingTop: 0 }}
      contentStyle={{ maxWidth: 640 }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.xxxl,
          gap: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load(true)}
            tintColor={colors.info}
          />
        }
      >
        {/* Student Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ gap: spacing.xs }}>
            <AppText
              weight="bold"
              style={[design.caption, { letterSpacing: 1.2 }]}
            >
              STUDENT PORTAL
            </AppText>

            <AppText weight="bold" style={design.heading}>
              Hi, {student.name || 'Student'}.
            </AppText>

            <AppText style={design.mutedText}>
              {student.sapId || 'Your exams are waiting.'}
            </AppText>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open profile"
            onPress={() =>
              router.push({
                pathname: '/studentProfile',
                params: {
                  sapId: profile?.sapId ?? '',
                  name: profile?.name ?? '',
                  profileImageUrl: profile?.profileImageUrl ?? '',
                },
              })
            }
            style={[
              design.avatar,
              {
                backgroundColor: colors.primary,
                width: 52,
                height: 52,
                borderRadius: 26,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
          >
            {profile?.profileImageUrl ? (
              <Image
                source={{ uri: profile.profileImageUrl }}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                resizeMode="cover"
              />
            ) : (
              <AppText
                weight="bold"
                style={{
                  color: colors.primaryForeground,
                  fontSize: 20,
                }}
              >
                {(profile?.name || student.name || 'S')
                  .charAt(0)
                  .toUpperCase()}
              </AppText>
            )}
          </Pressable>

        </View>

        {/* Verification Banner */}
        <View
          style={{
            backgroundColor: colors.primary,
            borderRadius: radius.xl,
            padding: spacing.xl,
            gap: spacing.md,
          }}
        >
          <AppText
            weight="bold"
            style={{
              color: colors.primaryForeground,
              fontSize: 11,
              letterSpacing: 1.2,
            }}
          >
            READY WHEN YOU ARE
          </AppText>

          <AppText
            weight="bold"
            style={{
              color: colors.primaryForeground,
              fontSize: 22,
              lineHeight: 29,
            }}
          >
            Verify your face before the exam.
          </AppText>

          <AppText style={{ color: '#d7d9de', lineHeight: 22 }}>
            Use a well-lit space and keep your face distant from camera.
          </AppText>
        </View>

        {/* Available Exams Count */}
        <View
          style={[
            design.card,
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}
        >
          <View style={{ gap: spacing.xs }}>
            <AppText weight="bold" style={design.title}>
              Available exams
            </AppText>

            <AppText style={design.mutedText}>
              Your active assessments
            </AppText>
          </View>

          <AppText
            weight="extraBold"
            style={{ color: colors.info, fontSize: 30 }}
          >
            {quizzes.length}
          </AppText>
        </View>



        {/* Loading */}
        {loading ? (
          <View style={design.card}>
            <AppText style={design.mutedText}>
              Loading available exams…
            </AppText>
          </View>
        ) : null}

        {/* Error */}
        {error ? (
          <View style={[design.alert, { gap: spacing.md }]}>
            <AppText style={design.alertText}>{error}</AppText>

            <Button
              text="Try again"
              variant="secondary"
              onPress={() => load()}
            />
          </View>
        ) : null}

        {/* Empty State */}
        {!loading && !error && quizzes.length === 0 ? (
          <View style={design.emptyState}>
            <AppText weight="bold" style={design.title}>
              No exams available
            </AppText>

            <AppText style={[design.mutedText, design.textCenter]}>
              Check back later for your next assessment.
            </AppText>
          </View>
        ) : null}

        {/* Quiz Cards */}
        {quizzes.map((quiz) => (
          <View
            key={quiz.id}
            style={[design.card, { gap: spacing.md }]}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <AppText weight="bold" style={design.title}>
                Exam #{quiz.id}
              </AppText>

            </View>

            <AppText style={design.mutedText}>
              {quiz.questionCount} questions · {quiz.durationMinutes} minutes
            </AppText>

            <AppText style={design.smallText}>
              Closes {formatExpiry(quiz.expiresAt)}
            </AppText>

            {checkingResults ? (
              <AppText style={design.mutedText}>
                Checking exam status…
              </AppText>
            ) : submittedQuizzes[String(quiz.id)] ? (
              <Button
                text="View Result"
                onPress={() => {
                  const result = submittedQuizzes[String(quiz.id)];

                  if (!result) return;

                  router.push({
                    pathname: '/examResult',
                    params: {
                      quizId: String(result.quizId),
                      marksObtained: String(result.marksObtained),
                      totalMarks: String(result.totalMarks),
                    },
                  });
                }}
              />
            ) : (
              <Button
                text="Start verification"
                onPress={() =>
                  router.push({
                    pathname: '/cameraPreviewPage',
                    params: { quizId: String(quiz.id) },
                  })
                }
              />
            )}
          </View>
        ))}


      </ScrollView>
    </Screen>
  );
}
