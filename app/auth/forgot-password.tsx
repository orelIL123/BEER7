import AppBackButton from '@/components/AppBackButton';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Phone, 2: Success/Instructions

    const normalizePhone = (v: string) => v.replace(/[^\d]/g, '');
    const formatPhone = (v: string) => {
        const d = normalizePhone(v);
        if (d.length <= 3) return d;
        if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
        return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6, 10)}`;
    };

    const handleSendReset = async () => {
        if (normalizePhone(phone).length < 9) return;
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setStep(2);
        }, 1500);
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient
                colors={[Colors.white, Colors.offWhite]}
                style={StyleSheet.absoluteFill}
            />

            <AppBackButton />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="key-outline" size={40} color={Colors.primary} />
                        </View>
                        <Text style={styles.title}>איפוס סיסמא</Text>
                        <Text style={styles.subtitle}>
                            {step === 1
                                ? 'הזינו את מספר הטלפון איתו נרשמתם ונשלח לכם הוראות לשחזור'
                                : 'הוראות לשחזור הסיסמא נשלחו למכשירכם'}
                        </Text>
                    </View>

                    {step === 1 ? (
                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>מספר נייד</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="call-outline" size={22} color={Colors.mediumGray} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="050-1234567"
                                        placeholderTextColor={Colors.mediumGray}
                                        value={phone}
                                        onChangeText={(v) => setPhone(formatPhone(normalizePhone(v)))}
                                        keyboardType="phone-pad"
                                        maxLength={12}
                                        editable={!loading}
                                        textAlign="right"
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.btn, loading && styles.btnDisabled]}
                                onPress={handleSendReset}
                                disabled={loading || normalizePhone(phone).length < 9}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={[Colors.primary, Colors.primaryDark]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.btnGradient}
                                >
                                    {loading ? (
                                        <ActivityIndicator color={Colors.white} />
                                    ) : (
                                        <>
                                            <Text style={styles.btnText}>שלח קוד איפוס</Text>
                                            <Ionicons name="send-outline" size={20} color={Colors.white} />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.successBox}>
                            <Ionicons name="checkmark-circle" size={80} color={Colors.success} />
                            <Text style={styles.successTitle}>נשלח בהצלחה!</Text>
                            <Text style={styles.successDesc}>קוד איפוס נשלח ב-SMS למספר {phone}</Text>

                            <TouchableOpacity
                                style={styles.secondaryBtn}
                                onPress={() => router.replace('/auth/login')}
                            >
                                <Text style={styles.secondaryBtnText}>חזרה להתחברות</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },
    content: { flex: 1, padding: 24, paddingTop: 100 },
    header: { marginBottom: 32, alignItems: 'center' },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: { fontSize: 32, fontWeight: '900', color: Colors.darkGray, marginBottom: 8, letterSpacing: -0.5 },
    subtitle: { fontSize: 16, color: Colors.mediumGray, fontWeight: '500', textAlign: 'center', lineHeight: 22 },
    form: { width: '100%' },
    inputGroup: { marginBottom: 24 },
    label: { fontSize: 15, color: Colors.darkGray, marginBottom: 8, textAlign: 'right', fontWeight: '800', marginRight: 4 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderWidth: 2,
        borderColor: Colors.lightGray,
        borderRadius: 20,
        paddingHorizontal: 16,
        height: 64,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    inputIcon: { marginRight: 0 },
    input: {
        flex: 1,
        fontSize: 18,
        color: Colors.black,
        textAlign: 'right',
        fontWeight: '600',
        paddingHorizontal: 12,
    },
    btn: {
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 8,
    },
    btnGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingVertical: 20,
    },
    btnDisabled: { opacity: 0.5 },
    btnText: { fontSize: 18, fontWeight: '900', color: Colors.white },
    successBox: { alignItems: 'center', marginTop: 20 },
    successTitle: { fontSize: 24, fontWeight: '900', color: Colors.darkGray, marginTop: 16 },
    successDesc: { fontSize: 16, color: Colors.mediumGray, textAlign: 'center', marginTop: 8, marginBottom: 32 },
    secondaryBtn: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: Colors.offWhite,
    },
    secondaryBtnText: { fontSize: 16, color: Colors.primary, fontWeight: '800' },
});
