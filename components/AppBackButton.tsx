import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';

interface AppBackButtonProps {
    color?: string;
    onPress?: () => void;
    style?: any;
    dark?: boolean;
}

export default function AppBackButton({ color, onPress, style, dark }: AppBackButtonProps) {
    const router = useRouter();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            router.back();
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={[
                styles.button,
                dark && styles.buttonDark,
                style
            ]}
            activeOpacity={0.7}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
            <Ionicons
                name="chevron-forward"
                size={26}
                color={color || (dark ? Colors.white : Colors.primary)}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 30,
        right: 20, // RTL Position
        zIndex: 100,
    },
    buttonDark: {
        backgroundColor: 'rgba(0,0,0,0.3)',
    }
});
