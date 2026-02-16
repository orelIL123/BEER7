import AppBackButton from '@/components/AppBackButton';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const router = useRouter();
    const { signIn } = useAuth();
    const passwordRef = useRef<TextInput>(null);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const normalizePhone = (v: string) => v.replace(/[^\d]/g, '');
    const formatPhone = (v: string) => {
        const d = normalizePhone(v);
        if (d.length <= 3) return d;
        if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
        return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6, 10)}`;
    };

    async function handleSubmit() {
        setError('');
        const digits = normalizePhone(phone);
        if (digits.length < 9) {
            setError('נא להזין מספר נייד תקין');
            return;
        }
        if (!password.trim()) {
            setError('נא להזין סיסמא');
            return;
        }
        setLoading(true);
        try {
            await signIn(phone, password);
            router.replace('/(tabs)');
        } catch (e: any) {
            console.error('[Login]', e?.message, e);
            const msg = e?.message === 'INVALID_CREDENTIALS'
                ? 'מספר או סיסמא לא נכונים. נסה שוב.'
                : `אירעה שגיאה: ${e?.message || 'נסה שוב.'}`;
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <View style={styles.container}>
                <LinearGradient
                    colors={[Colors.white, Colors.offWhite]}
                    style={StyleSheet.absoluteFill}
                />

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View style={styles.content}>
                        <AppBackButton style={{ position: 'relative', top: 0, right: 0, alignSelf: 'flex-end', marginBottom: 20 }} />

                        <View style={styles.header}>
                            <View style={styles.logoCircle}>
                                <Ionicons name="lock-open" size={40} color={Colors.primary} />
                            </View>
                            <Text style={styles.title}>ברוכים השבים</Text>
                            <Text style={styles.subtitle}>התחברו כדי להמשיך לקהילה</Text>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>מספר נייד</Text>
                                <View style={[styles.inputContainer, error.includes('נייד') && styles.inputErrorBorder]}>
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

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>סיסמא</Text>
                                <View style={[styles.inputContainer, error.includes('סיסמא') && styles.inputErrorBorder]}>
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.inputIcon}>
                                        <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={Colors.mediumGray} />
                                    </TouchableOpacity>
                                    <TextInput
                                        ref={passwordRef}
                                        style={styles.input}
                                        placeholder="הזן סיסמא"
                                        placeholderTextColor={Colors.mediumGray}
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                        editable={!loading}
                                        textAlign="right"
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={() => router.push('/auth/forgot-password')}
                                    style={{ alignSelf: 'flex-end', marginTop: 8 }}
                                >
                                    <Text style={{ color: Colors.primary, fontWeight: '700', fontSize: 13 }}>שכחתי סיסמא</Text>
                                </TouchableOpacity>
                            </View>

                            {error ? (
                                <View style={styles.errorBox}>
                                    <Ionicons name="alert-circle" size={18} color={Colors.error} />
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            ) : null}

                            <TouchableOpacity
                                style={[styles.btn, loading && styles.btnDisabled]}
                                onPress={handleSubmit}
                                disabled={loading}
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
                                            <Text style={styles.btnText}>התחברות</Text>
                                            <Ionicons name="arrow-back" size={22} color={Colors.white} />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.footerLink}
                                onPress={() => router.push('/auth/explain-sms')}
                            >
                                <Text style={styles.footerLinkText}>
                                    עדיין אין לך חשבון? <Text style={styles.footerLinkBold}>הירשם כאן</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },
    content: { flex: 1, padding: 24, paddingTop: 60 },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.offWhite,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        alignSelf: 'flex-end',
    },
    header: { marginBottom: 32, alignItems: 'center' },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: { fontSize: 32, fontWeight: '900', color: Colors.darkGray, marginBottom: 8, letterSpacing: -0.5 },
    subtitle: { fontSize: 16, color: Colors.mediumGray, fontWeight: '500', textAlign: 'center' },
    form: { width: '100%' },
    inputGroup: { marginBottom: 20 },
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
    inputErrorBorder: { borderColor: Colors.error + '40' },
    inputIcon: { marginRight: 0, marginLeft: 0 },
    input: {
        flex: 1,
        fontSize: 18,
        color: Colors.black,
        textAlign: 'right',
        fontWeight: '600',
        paddingHorizontal: 12,
    },
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.error + '10',
        padding: 12,
        borderRadius: 12,
        marginBottom: 24,
        gap: 8,
        justifyContent: 'flex-end',
    },
    errorText: { fontSize: 14, color: Colors.error, fontWeight: '700', textAlign: 'right' },
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
    btnDisabled: { opacity: 0.7 },
    btnText: { fontSize: 20, fontWeight: '900', color: Colors.white },
    footerLink: { marginTop: 32, alignItems: 'center' },
    footerLinkText: { fontSize: 16, color: Colors.mediumGray, fontWeight: '500' },
    footerLinkBold: { color: Colors.primary, fontWeight: '800' },
});
