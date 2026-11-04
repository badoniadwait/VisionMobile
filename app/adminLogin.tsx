import { saveAdminLogin } from '@/auth/auth';
import { apiFetch, ApiError } from '@/api/client';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors, radii, spacing } from '@/constants/theme';
import { AdminAuthResponse } from '@/types/admin';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput } from 'react-native';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email.trim() || !password) {
      Alert.alert('Missing details', 'Enter your email and password.');
      return;
    }
    try {
      setLoading(true);
      const data = await apiFetch<AdminAuthResponse>('/api/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      await saveAdminLogin(data.token, data.admin);
      router.replace('/adminHome');
    } catch (error) {
      Alert.alert('Admin login failed', error instanceof ApiError ? error.message : 'Unable to connect to the backend.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <Text style={styles.back} onPress={() => router.replace('/welcome')}>← Back</Text>
        <Text style={styles.title}>Admin sign in</Text>
        <Text style={styles.subtitle}>Manage students, quizzes, and exam settings.</Text>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" editable={!loading} />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry editable={!loading} onSubmitEditing={submit} />
        <Button text="Sign in" onPress={submit} loading={loading} />
        <Button text="Create admin account" variant="secondary" onPress={() => router.push('/adminSignup')} disabled={loading} />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', gap: spacing.md },
  back: { color: colors.primary, fontSize: 16, fontWeight: '700', marginBottom: spacing.lg },
  title: { color: colors.text, fontSize: 32, fontWeight: '800' },
  subtitle: { color: colors.mutedText, fontSize: 16, lineHeight: 23, marginBottom: spacing.md },
  input: { minHeight: 52, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, paddingHorizontal: spacing.md, backgroundColor: colors.surface, fontSize: 16 },
});
