import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AuthPhoneScreen() {
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
      setError('הזן מספר נייד תקין');
      return;
    }
    if (!password.trim()) {
      setError('הזן סיסמא');
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
      Alert.alert('שגיאה', msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'התחברות',
          headerBackTitle: 'חזרה',
          headerTintColor: Colors.primary,
          headerTitleStyle: { fontWeight: '800', fontSize: 18 },
        }}
      />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          <Text style={styles.label}>מספר נייד</Text>
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
          <Text style={[styles.label, { marginTop: 16 }]}>סיסמא</Text>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => passwordRef.current?.focus()}
            style={styles.passwordBox}
          >
            <TextInput
              ref={passwordRef}
              style={styles.passwordInput}
              placeholder="הסיסמא שבחרת בהרשמה"
              placeholderTextColor={Colors.mediumGray}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
              textAlign="right"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.showPasswordBtn} onPress={() => setShowPassword((v) => !v)}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={Colors.primary} />
            <Text style={styles.showPasswordText}>{showPassword ? 'הסתר סיסמא' : 'הצג סיסמא'}</Text>
          </TouchableOpacity>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Ionicons name="log-in" size={20} color={Colors.white} />
                <Text style={styles.btnText}>התחבר</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  label: { fontSize: 16, color: Colors.darkGray, marginBottom: 12, textAlign: 'right' },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    borderRadius: 14,
    padding: 16,
    fontSize: 18,
    color: Colors.black,
    marginBottom: 12,
    textAlign: 'right',
  },
  passwordBox: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    borderRadius: 14,
    marginBottom: 4,
    height: 56,
  },
  passwordInput: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 18,
    color: Colors.black,
    textAlign: 'right',
  },
  showPasswordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  showPasswordText: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  error: { fontSize: 14, color: Colors.error, marginBottom: 12, textAlign: 'right' },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { fontSize: 18, fontWeight: '700', color: Colors.white },
});
