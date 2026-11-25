
import { logout } from '@/auth/auth';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { QuizResults } from '@/components/QuizResults';
import { Screen } from '@/components/Screen';
import { quizResultsPostPath } from '@/helper/helper';
import {
  colors,
  styles as design,
  radius,
  spacing,
} from '@/helper/style';
import { QuizResult } from '@/types/quiz';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  View,
} from 'react-native';

export default function StudentProfile() {
  const { sapId, name, profileImageUrl } = useLocalSearchParams<{
    sapId: string;
    name: string;
    profileImageUrl: string;
  }>();

  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  async function onLogout() {
    await logout();
    router.replace('/welcome');
  }

  useEffect(() => {
    if (!sapId) {
      setLoading(false);
      return;
    }

    async function fetchQuizResults() {
      try {
        const token = await SecureStore.getItemAsync('auth_token');

        if (!token) {
          Alert.alert('Authentication Error', 'Please log in again.');
          return;
        }

        const res = await fetch(quizResultsPostPath, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            studentId: sapId,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || `Request failed: ${res.status}`);
        }

        setResults(data);
      } catch (error) {
        Alert.alert(
          'Error',
          error instanceof Error
            ? error.message
            : 'Unable to fetch quiz results.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchQuizResults();
  }, [sapId]);

  return (
    <Screen>
      <View style={{ flex: 1, gap: spacing.xl }}>

        <AppText
          weight="semiBold"
          style={[design.link, { paddingVertical: spacing.xs }]}
          onPress={() => router.back()}
        >
          ← Back
        </AppText>

        <AppText weight="bold" style={design.heading}>
          My Profile
        </AppText>

        {/* Profile Information */}
        <View
          style={[
            design.panel,
            {
              alignItems: 'center',
              gap: spacing.md,
            },
          ]}
        >
          {profileImageUrl ? (
            <Image
              source={{ uri: profileImageUrl }}
              style={styles.avatar}
            />
          ) : (
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: colors.accent,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            >
              <AppText
                weight="bold"
                style={{ color: colors.info, fontSize: 30 }}
              >
                {(name || 'S').charAt(0).toUpperCase()}
              </AppText>
            </View>
          )}

          <AppText weight="bold" style={design.subheading}>
            {name || 'Student'}
          </AppText>

          <AppText style={design.mutedText}>
            {sapId || 'SAP ID unavailable'}
          </AppText>
        </View>

        {/* Student Details */}
        <View style={[design.card, { gap: spacing.lg }]}>
          <View style={styles.detailRow}>
            <AppText style={design.mutedText}>SAP ID</AppText>
            <AppText weight="semiBold">{sapId || '—'}</AppText>
          </View>

          <View style={design.divider} />

          <View style={styles.detailRow}>
            <AppText style={design.mutedText}>Reference image</AppText>
            <AppText weight="semiBold">
              {profileImageUrl ? 'Uploaded' : 'Unavailable'}
            </AppText>
          </View>
        </View>

        {/* Quiz Results */}
        <View style={{ flex: 1, gap: spacing.md }}>
          <AppText weight="bold" style={design.subheading}>
            Quiz Results
          </AppText>

          {loading ? (
            <AppText style={design.mutedText}>
              Loading results…
            </AppText>
          ) : results.length > 0 ? (
            <ScrollView
              contentContainerStyle={{ gap: spacing.md }}
              showsVerticalScrollIndicator={false}
            >
              {results.map((result, index) => (
                <QuizResults
                  key={`${result.quizId}-${index}`}
                  data={result}
                />
              ))}
            </ScrollView>
          ) : (
            <AppText style={design.mutedText}>
              No quiz results available.
            </AppText>
          )}
        </View>

        {/* Sign Out */}
        <View style={{ marginTop: 'auto' }}>
          <Button
            text="Sign out"
            variant="outline"
            onPress={onLogout}
            style={{backgroundColor: colors.destructive}}
            fullWidth
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = {
  avatar: {
    width: 92,
    height: 92,
    borderRadius: radius.round,
  },
  detailRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
};
