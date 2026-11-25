import { Button } from '@/components/Button';
import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { captureImage } from '@/services/cameraService';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, radius, spacing } from '@/helper/style';

const cameraPreviewPage = () => {

    const { quizId } = useLocalSearchParams<{ quizId: string }>();

    // useEffect(() => {
    //     async function checkAuth() {
    //         const unauthenticated = await ifNotAuthenticated();

    //         if (unauthenticated) {
    //             router.replace('/login');
    //         }
    //     }

    //     checkAuth();
    // }, []);

    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const [uri, setUri] = useState<string | null>(null);

    if (!permission) {
        return null;
    }

    if (!permission.granted) {
        return (

            <Button
                text="Allow Camera"
                onPress={requestPermission}
                style={styles.permissionButton}
            />
        );
    }

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>

            <CameraView
                ref={cameraRef}
                style={styles.preview}
                facing="front"
                mirror={false}
            />
            <Button
                text={"Capture Image"}
                onPress={handleCapture}
                fullWidth
                style={styles.captureButton}
            />


            {/* {uri && <Image
                source={{ uri }}
                style={styles.preview}
            />}
            <Button
                text={"Retry"}
                onPress={() => { setUri(null) }}
            /> */}
        </ScrollView>
    )
    async function handleCapture() {
        const uri = await captureImage(cameraRef);
        setUri(uri);
        const encoded = encodeURIComponent(uri);
        router.push({
            pathname: "/imagePreviewPage",
            params: {
                uri: encoded,
                quizId
            },
        });
    }
}

export default cameraPreviewPage

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
    },
    container: {
        flex: 1,
    },
    preview: {
        width: '100%',
        maxWidth: 420,
        maxHeight: 540,
        aspectRatio: 3 / 4,
        marginBottom: spacing.xl,
        borderRadius: radius.lg,
        overflow: 'hidden',
        backgroundColor: colors.cameraBackground,
    },
    captureButton: {
        width: '100%',
        maxWidth: 420,
    },
    permissionButton: {
        alignSelf: 'center',
        margin: spacing.xl,
    },
})
