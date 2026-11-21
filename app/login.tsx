import { ApiError, apiFetch } from '@/api/client';
import { saveLogin } from '@/auth/auth';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { AppText } from '@/components/AppText';
import { LoginResponse } from '@/types/loginRes';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import { colors, radius, spacing, styles as design } from '@/helper/style';

export default function Login() {
  const [sapId, setSapId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function fetchStudent() {
    if (!sapId.trim() || !password) { Alert.alert('Missing details', 'Enter your SAP ID and password.'); return; }
    try {
      setLoading(true);
      const data = await apiFetch<LoginResponse>('/student-login', { method: 'POST', body: JSON.stringify({ sapId, password }) });
      if (!data.success) { Alert.alert('Login failed', 'Invalid SAP ID or password'); return; }
      if (!data.token || !data.student?.SapId) throw new Error('The server returned an incomplete login response.');
      await saveLogin(data.token, data.student, data.ImgUrl ?? '');
      router.replace('/');
    } catch (error) {
      Alert.alert('Login error', error instanceof ApiError || error instanceof Error && error.message.includes('incomplete') ? error.message : 'Unable to connect or save your login. Please try again.');
    } finally { setLoading(false); }
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <View style={{ gap: spacing.xxxl }}>
          <View style={{ gap: spacing.sm }}>
            <AppText weight="extraBold" style={design.heading}>Welcome back</AppText>
            <AppText style={design.mutedText}>Sign in with your student account to access your exams.</AppText>
          </View>
          <View style={{ gap: spacing.lg }}>
            <View style={{ gap: spacing.sm }}>
              <AppText weight="semiBold" style={design.label}>SAP ID</AppText>
              <TextInput placeholder="Enter your SAP ID" placeholderTextColor={colors.mutedForeground} value={sapId} onChangeText={setSapId} autoCapitalize="none" autoCorrect={false} editable={!loading} returnKeyType="next" style={design.input} />
            </View>
            <View style={{ gap: spacing.sm }}>
              <AppText weight="semiBold" style={design.label}>Password</AppText>
              <TextInput placeholder="Enter your password" placeholderTextColor={colors.mutedForeground} value={password} onChangeText={setPassword} secureTextEntry editable={!loading} returnKeyType="done" onSubmitEditing={fetchStudent} style={design.input} />
            </View>
            <Button text="Login" onPress={fetchStudent} loading={loading} fullWidth />
          </View>
          <AppText style={[design.caption, design.textCenter]}>Your student credentials are protected.</AppText>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', width: '100%' } });
