import { saveLogin } from '@/auth/auth';
import { Button } from '@/components/Button';
import { studentLoginPostPath } from '@/helper/helper';
import { LoginResponse } from '@/types/loginRes';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


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

            const response = await fetch(studentLoginPostPath, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sapId: sapId,
                    password: password,
                }),
            })

            const data: LoginResponse = await response.json();

            if (!response.ok) {
                Alert.alert('Login failed', 'Invalid SAP ID or password')
                return
            }

            if (!data?.token || !data.student?.SapId) {
                throw new Error('The server returned an incomplete login response.');
            }

            await saveLogin(data.token, data.student, data.ImgUrl ?? '');

            router.replace('/');

        } catch (error) {
            console.error('Login error:', error)
            Alert.alert('Login error', error instanceof Error && error.message.includes('incomplete')
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
                    text={loading ? 'Logging in…' : 'Login'}
                    onPress={fetchStudent}
                />
                {loading && <ActivityIndicator style={styles.loader} />}
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Login

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: {
        flex: 1,
        padding: 20,
        gap: 16,
        justifyContent: 'center',
    },
    title: { fontSize: 28, fontWeight: '700', color: '#111827' },
    subtitle: { fontSize: 16, color: '#6b7280', marginBottom: 12 },
    input: { minHeight: 50, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, paddingHorizontal: 14, fontSize: 16 },
    loader: { marginTop: 4 },
})
