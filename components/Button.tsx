import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'

export const Button = (
    {
        text,
        onPress
    }:{
        text: string
        onPress: () => void
    }
) => {
  return (
    <Pressable onPress={onPress}>
      <Text>{text}</Text>
    </Pressable>
  )
}


const styles = StyleSheet.create({})