import { ExamCard } from '@/components/ExamCard'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const index = () => {
    return (
        <SafeAreaView>
            <View>
                <ExamCard/>
            </View>
        </SafeAreaView>
    )
}

export default index

const styles = StyleSheet.create({})