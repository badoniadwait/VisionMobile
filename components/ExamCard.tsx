import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';

import { useRouter } from 'expo-router';

export const ExamCard = () => {
  const router = useRouter();


  return (
    <View >
      <Text>ExamCard</Text>
      <Button text="Scan Face" onPress={() => router.push("/cameraPreviewPage")} />
    </View>
  );


};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },

});