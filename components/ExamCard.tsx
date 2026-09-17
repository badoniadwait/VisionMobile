import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from './Button'

import { captureImage } from '@/services/cameraService'


export const ExamCard = () => {
  return (
    <View>
      <Text>ExamCard</Text>
      <Button text="Capture Image" onPress={captureImage}/>
    </View>
  )
}



const styles = StyleSheet.create({})