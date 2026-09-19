import { Button } from '@/components/Button';
import { submitMultiPartFormData } from '@/services/cameraService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';


const imagePreviewPage = () => {
    const { uri } = useLocalSearchParams<{ uri: string }>();
    const router = useRouter();


    return (
        <View>

            <Image
                source={{ uri }}
                style={styles.preview} />
            <Button
                text={"Retry"}
                onPress={() => { router.back() }}
            />
            <Button
                text={"Submit"}
                onPress={() => submitMultiPartFormData(uri)}
            />
        </View>
    )

}

export default imagePreviewPage

const styles = StyleSheet.create({
    preview: {
        width: 300,
        height: 400,
        margin: 20,
    },
})