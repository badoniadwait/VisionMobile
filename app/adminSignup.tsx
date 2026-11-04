import { saveAdminLogin } from '@/auth/auth';
import { apiFetch, ApiError } from '@/api/client';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors, radii, spacing } from '@/constants/theme';
import { AdminAuthResponse } from '@/types/admin';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput } from 'react-native';

export default function AdminSignup() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', password: '' });
  const [loading, setLoading] = useState(false);
  const update = (key: keyof typeof form, value: string) => setForm(current => ({ ...current, [key]: value }));

  async function submit() {
    if (Object.values(form).some(value => !value.trim())) {
      Alert.alert('Missing details', 'Complete every field before continuing.');
      return;
    }
    try {
      setLoading(true);
      const data = await apiFetch<AdminAuthResponse>('/api/auth/admin/register', { method: 'POST', body: JSON.stringify(form) });
      await saveAdminLogin(data.token, data.admin);
      router.replace('/adminHome');
    } catch (error) {
      Alert.alert('Registration failed', error instanceof ApiError ? error.message : 'Unable to connect to the backend.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.back} onPress={() => router.back()}>← Back</Text>
        <Text style={styles.title}>Create admin account</Text>
        <Text style={styles.subtitle}>Set up your account to manage Vision exams.</Text>
        <TextInput style={styles.input} placeholder="Full name" value={form.name} onChangeText={value => update('name', value)} editable={!loading} />
        <TextInput style={styles.input} placeholder="Email" value={form.email} onChangeText={value => update('email', value)} autoCapitalize="none" keyboardType="email-address" editable={!loading} />
        <TextInput style={styles.input} placeholder="Subject or department" value={form.subject} onChangeText={value => update('subject', value)} editable={!loading} />
        <TextInput style={styles.input} placeholder="Password" value={form.password} onChangeText={value => update('password', value)} secureTextEntry editable={!loading} />
        <Button text="Create account" onPress={submit} loading={loading} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', gap: spacing.md, paddingVertical: spacing.lg },
  back: { color: colors.primary, fontSize: 16, fontWeight: '700', marginBottom: spacing.lg },
  title: { color: colors.text, fontSize: 30, fontWeight: '800' },
  subtitle: { color: colors.mutedText, fontSize: 16, lineHeight: 23, marginBottom: spacing.md },
  input: { minHeight: 52, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, paddingHorizontal: spacing.md, backgroundColor: colors.surface, fontSize: 16 },
});
