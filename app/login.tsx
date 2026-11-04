import { saveLogin } from '@/auth/auth';
import { apiFetch, ApiError } from '@/api/client';
import { Button } from '@/components/Button';
import { LoginResponse } from '@/types/loginRes';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radii, spacing } from '@/constants/theme';


const Login = () => {
    const [sapId, setSapId] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    async function fetchStudent(): Promise<void> {
        if (!sapId.trim() || !password) {
            Alert.alert('Missing details', 'Enter your SAP ID and password.');
            return;
        }

        try {
            setLoading(true)

            const data = await apiFetch<LoginResponse>('/student-login', {
                method: 'POST',
                body: JSON.stringify({
                    sapId: sapId,
                    password: password,
                }),
            });

            if (!data.success) {
                Alert.alert('Login failed', 'Invalid SAP ID or password')
                return
            }

            if (!data?.token || !data.student?.sapId) {
                throw new Error('The server returned an incomplete login response.');
            }

            await saveLogin(data.token, data.student, data.ImgUrl ?? '');

            router.replace('/');

        } catch (error) {
            console.error('Login error:', error)
            Alert.alert('Login error', error instanceof ApiError || error instanceof Error && error.message.includes('incomplete')
                ? error.message
                : 'Unable to connect or save your login. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
                <Text style={styles.title}>Welcome back</Text>
                <Text style={styles.subtitle}>Sign in with your student account</Text>
                <TextInput
                    style={styles.input}
                    placeholder="SAP ID"
                    value={sapId}
                    onChangeText={setSapId}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                    returnKeyType="next"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    editable={!loading}
                    returnKeyType="done"
                    onSubmitEditing={fetchStudent}
                />

                <Button
                    text="Login"
                    onPress={fetchStudent}
                    loading={loading}
                />
                <Button
                    text="Back to role selection"
                    variant="secondary"
                    onPress={() => router.replace('/welcome')}
                    disabled={loading}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Login

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: {
        flex: 1,
        padding: spacing.lg,
        gap: spacing.md,
        justifyContent: 'center',
    },
    title: { fontSize: 28, fontWeight: '700', color: colors.text },
    subtitle: { fontSize: 16, color: colors.mutedText, marginBottom: spacing.sm },
    input: { minHeight: 50, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, paddingHorizontal: 14, fontSize: 16, backgroundColor: colors.surface },
})
