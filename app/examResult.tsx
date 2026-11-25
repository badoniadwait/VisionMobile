
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { styles as design, spacing } from '@/helper/style';

export default function ExamResult() {
    const { quizId, marksObtained, totalMarks } = useLocalSearchParams<{
        quizId: string;
        marksObtained: string;
        totalMarks: string;
    }>();

    const obtained = Number(marksObtained);
    const total = Number(totalMarks);

    const validResult =
        quizId &&
        Number.isFinite(obtained) &&
        Number.isFinite(total) &&
        total > 0 &&
        obtained >= 0;

    const percentage = validResult
        ? Math.round((obtained / total) * 100)
        : 0;

    return (
        <Screen >
            <View style={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    

                    <AppText weight="bold" style={design.heading}>
                        Quiz #{quizId}
                    </AppText>

                </View>

                {validResult ? (
                    <>
                        

                        {/* Summary */}
                        <View style={[design.card, styles.summary]}>
                            <AppText weight="bold" style={design.title}>
                                Summary
                            </AppText>

                            <View style={styles.summaryRow}>
                                <AppText style={design.mutedText}>
                                    marks obtained 
                                </AppText>
                                <AppText weight="bold">
                                    {obtained}
                                </AppText>
                                
                            </View>
                            <View style={styles.summaryRow}>
                                
                                <AppText style={design.mutedText}>
                                    out of
                                </AppText>
                                <AppText weight="bold">
                                    {total}
                                </AppText>
                            </View>

                            
                        </View>
                    </>
                ) : (
                    <View style={design.alert}>
                        <AppText style={design.alertText}>
                            Unable to display the result. The result data is invalid or incomplete.
                        </AppText>
                    </View>
                )}

                {/* Dashboard Button */}
                <Button
                    text="Back to Dashboard"
                    onPress={() => router.replace('/')}
                />

            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: spacing.lg,
        paddingVertical: spacing.lg,
    },
    header: {
        gap: spacing.xs,
    },
    summary: {
        gap: spacing.sm,
        padding: spacing.xl,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
});
