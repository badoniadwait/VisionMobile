import { Button } from '@/components/Button';
import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { captureImage } from '@/services/cameraService';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';

const cameraPreviewPage = () => {

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
            />
        );
    }

    return (
        <ScrollView>

            <CameraView
                ref={cameraRef}
                style={styles.preview}
                facing="front"
                mirror={false}
            />
            <Button
                text={"Capture Image"}
                onPress={handleCapture}
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
        router.push({
            pathname: "/imagePreviewPage",
            params: {
                uri: encodeURIComponent(uri),
            },
        });
    }
}

export default cameraPreviewPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    preview: {
        width: 300,
        height: 400,
        margin: 20,
    },
})