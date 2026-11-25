import { Button } from '@/components/Button';
import { submitMultiPartFormData } from '@/services/cameraService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/helper/style';


const imagePreviewPage = () => {

    // useEffect(() => {
    //     async function checkAuth() {
    //         const unauthenticated = await ifNotAuthenticated();

    //         if (unauthenticated) {
    //             router.replace('/login');
    //         }
    //     }

    //     checkAuth();
    // }, []);

    const { uri, quizId } = useLocalSearchParams<{ uri: string, quizId: string }>();
    const router = useRouter();

    async function handleSubmit(uri: string) {
        const res = await submitMultiPartFormData(uri);
        if (res.verified === true) {
            router.push({
                pathname: '/exam',
                params: { quizId },
            });
        } else {
            alert("Face verification failed. Please try again.");
            router.push({
                pathname: '/cameraPreviewPage',
                params: { quizId },
            });
        }
    }


    return (
        <View style={styles.container}>

            <Image
                source={{ uri }}
                style={styles.preview} />
            <Button
                text={"Retry"}
                onPress={() => { router.back() }}
                variant="outline"
                fullWidth
                style={styles.action}
            />
            <Button
                text={"Submit"}
                onPress={() => handleSubmit(uri)}
                fullWidth
                style={styles.action}
            />
        </View>
    )

}

export default imagePreviewPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
        backgroundColor: colors.background,
    },
    preview: {
        width: '100%',
        maxWidth: 420,
        maxHeight: 520,
        aspectRatio: 3 / 4,
        marginBottom: spacing.xl,
        borderRadius: radius.lg,
        backgroundColor: colors.cameraBackground,
    },
    action: {
        width: '100%',
        maxWidth: 420,
        marginTop: spacing.sm,
    },
})
