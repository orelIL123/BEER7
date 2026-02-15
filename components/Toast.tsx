import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    visible: boolean;
    message: string;
    type?: ToastType;
    onHide: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
    visible,
    message,
    type = 'info',
    onHide,
    duration = 3000
}) => {
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (visible && duration > 0) {
            const timer = setTimeout(() => onHide(), duration);
            return () => clearTimeout(timer);
        }
    }, [visible, duration, onHide]);

    if (!visible) return null;

    const getIconName = (): keyof typeof Ionicons.glyphMap => {
        switch (type) {
            case 'success': return 'checkmark-circle';
            case 'error': return 'alert-circle';
            case 'warning': return 'warning';
            default: return 'information-circle';
        }
    };

    const getColors = () => {
        switch (type) {
            case 'success': return Colors.primary;
            case 'error': return Colors.error;
            case 'warning': return Colors.warning;
            default: return Colors.secondary;
        }
    };

    const accentColor = getColors();

    return (
        <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            style={styles.container}
        >
            <BlurView intensity={90} tint="light" style={styles.blurContainer}>
                <View style={[styles.diagonalAccentLeft, { backgroundColor: accentColor }]} pointerEvents="none" />
                <View style={styles.contentContainer}>
                    <View style={[styles.iconContainer, { backgroundColor: accentColor + '25' }]}>
                        <Ionicons name={getIconName()} size={28} color={accentColor} />
                    </View>
                    <Text style={styles.messageText}>{message}</Text>
                </View>
                <TouchableOpacity onPress={onHide} style={styles.closeButton} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                    <Ionicons name="close" size={24} color={Colors.darkGray} />
                </TouchableOpacity>
                <View style={[styles.diagonalAccentRight, { backgroundColor: accentColor }]} pointerEvents="none" />
            </BlurView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: '50%',
        left: 24,
        right: 24,
        marginTop: -45,
        zIndex: 9999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 12,
        alignItems: 'center',
    },
    blurContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.98)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.9)',
        minWidth: 320,
        maxWidth: 420,
    },
    diagonalAccentLeft: {
        width: 18,
        height: '150%',
        position: 'absolute',
        left: -8,
        transform: [{ rotate: '15deg' }],
        zIndex: 1,
    },
    diagonalAccentRight: {
        width: 18,
        height: '150%',
        position: 'absolute',
        right: -8,
        transform: [{ rotate: '-15deg' }],
        zIndex: 1,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 24,
        gap: 14,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    messageText: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.black,
        flex: 1,
    },
    closeButton: {
        padding: 16,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(0,0,0,0.06)',
    },
});
