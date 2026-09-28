import { logout } from '@/auth/auth';
import { Button } from '@/components/Button';
import { ExamCard } from '@/components/ExamCard';
import { router } from "expo-router";
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const index = () => {
    async function onLogout() {
        await logout();
        router.replace('/login');
    }

    // useEffect(() => {
    //     async function checkAuth() {
    //         const unauthenticated = await ifNotAuthenticated();

    //         if (unauthenticated) {
    //             router.replace('/login');
    //         }
    //     }

    //     checkAuth();
    // }, []);

    return (
        <SafeAreaView>
            <View>
                <ExamCard />
            </View>
            <Button text='logout' onPress={onLogout}></Button>
        </SafeAreaView>
    )
}

export default index

const styles = StyleSheet.create({})
