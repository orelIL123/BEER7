import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const STEPS = [
  { key: 'firstName', title: 'שם פרטי', subtitle: 'איך לקרוא לך', icon: 'person' as const, placeholder: 'שם פרטי' },
  { key: 'lastName', title: 'שם משפחה', subtitle: 'שם המשפחה', icon: 'card' as const, placeholder: 'שם משפחה' },
  { key: 'isResident', title: 'תושב באר שבע?', subtitle: 'האם אתה תושב העיר באר שבע', icon: 'home' as const },
  { key: 'phone', title: 'מספר נייד', subtitle: 'לחיבור לחשבון', icon: 'call' as const, placeholder: '050-1234567' },
  { key: 'password', title: 'בחר סיסמא', subtitle: 'לפחות 6 תווים', icon: 'lock-closed' as const, placeholder: '••••••••', secure: true },
] as const;

export default function RegisterStepsScreen() {
  const router = useRouter();
  const { registerWithDetails } = useAuth();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    isResident: false,
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [inputError, setInputError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const contentOpacity = useRef(new Animated.Value(1)).current;
  const slideX = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const inputShake = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: (step + 1) / STEPS.length,
      friction: 8,
      useNativeDriver: false,
    }).start();
    if (STEPS[step].key !== 'isResident') setTimeout(() => inputRef.current?.focus(), 300);
  }, [step]);

  const currentStep = STEPS[step];
  const currentValue = () => {
    const k = currentStep.key;
    return values[k];
  };

  const normalizePhone = (v: string) => v.replace(/[^\d]/g, '');
  const formatPhone = (v: string) => {
    const d = normalizePhone(v);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6, 10)}`;
  };

  function validate(): boolean {
    setInputError('');
    if (currentStep.key === 'firstName') {
      const v = (currentValue() as string).trim();
      if (v.length < 2) {
        shakeError('נא להזין שם פרטי');
        return false;
      }
    }
    if (currentStep.key === 'lastName') {
      const v = (currentValue() as string).trim();
      if (v.length < 2) {
        shakeError('נא להזין שם משפחה');
        return false;
      }
    }
    if (currentStep.key === 'phone') {
      const digits = normalizePhone(currentValue() as string);
      if (digits.length < 9) {
        shakeError('נא להזין מספר נייד תקין');
        return false;
      }
    }
    if (currentStep.key === 'password') {
      const v = (currentValue() as string).trim();
      if (v.length < 6) {
        shakeError('סיסמא לפחות 6 תווים');
        return false;
      }
    }
    return true;
  }

  function shakeError(msg: string) {
    setInputError(msg);
    Animated.sequence([
      Animated.timing(inputShake, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(inputShake, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(inputShake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }

  function goToStep(next: number, direction: 1 | -1) {
    Keyboard.dismiss();
    Animated.parallel([
      Animated.timing(contentOpacity, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(slideX, { toValue: -30 * direction, duration: 120, useNativeDriver: true }),
    ]).start(() => {
      setStep(next);
      setInputError('');
      slideX.setValue(30 * direction);
      Animated.parallel([
        Animated.timing(contentOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.spring(slideX, { toValue: 0, friction: 8, tension: 60, useNativeDriver: true }),
      ]).start();
    });
  }

  function handleNext() {
    if (!validate()) return;
    if (step < STEPS.length - 1) {
      goToStep(step + 1, 1);
    } else {
      handleSubmit();
    }
  }

  function handleBack() {
    if (step === 0) router.back();
    else goToStep(step - 1, -1);
  }

  async function handleSubmit() {
    const phone = normalizePhone(values.phone);
    if (phone.length < 9) {
      shakeError('נא להזין מספר נייד תקין');
      return;
    }
    if ((values.password || '').trim().length < 6) {
      shakeError('סיסמא לפחות 6 תווים');
      return;
    }
    setSubmitting(true);
    try {
      await registerWithDetails(values.phone, {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        isResident: values.isResident,
        password: values.password.trim(),
      });
      router.replace('/(tabs)');
    } catch (e: any) {
      console.error('[Register]', e?.message, e);
      const isAlready = e?.message === 'ALREADY_REGISTERED';
      const msg = isAlready
        ? 'המספר כבר רשום במערכת. התחבר עם הסיסמא שבחרת.'
        : 'אירעה שגיאה. נסה שוב.';
      setInputError(msg);
      Alert.alert('שגיאה', msg);
    } finally {
      setSubmitting(false);
    }
  }

  const isResidentStep = currentStep.key === 'isResident';
  const isPhoneStep = currentStep.key === 'phone';
  const isPasswordStep = currentStep.key === 'password';

  return (
    <>
      <Stack.Screen
        options={{
          title: 'הרשמה',
          headerBackTitle: 'חזרה',
          headerTintColor: Colors.primary,
          headerTitleStyle: { fontWeight: '800', fontSize: 18 },
        }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backBtn} hitSlop={12}>
              <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <View style={styles.dots}>
              {STEPS.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    i === step && styles.dotActive,
                    i < step && styles.dotDone,
                  ]}
                />
              ))}
            </View>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          <Text style={styles.stepLabel}>
            שלב {step + 1} מתוך {STEPS.length}
          </Text>

          <Animated.View
            style={[
              styles.content,
              {
                opacity: contentOpacity,
                transform: [{ translateX: slideX }],
              },
            ]}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.iconWrap}
            >
              <Ionicons name={currentStep.icon} size={32} color={Colors.white} />
            </LinearGradient>
            <Text style={styles.stepTitle}>{currentStep.title}</Text>
            <Text style={styles.stepSubtitle}>{currentStep.subtitle}</Text>

            {isResidentStep ? (
              <View style={styles.residentRow}>
                <TouchableOpacity
                  style={[styles.residentBtn, values.isResident && styles.residentBtnActive]}
                  onPress={() => setValues((v) => ({ ...v, isResident: true }))}
                >
                  <Ionicons name="checkmark-circle" size={28} color={values.isResident ? Colors.white : Colors.mediumGray} />
                  <Text style={[styles.residentBtnText, values.isResident && styles.residentBtnTextActive]}>כן</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.residentBtn, !values.isResident && styles.residentBtnActive]}
                  onPress={() => setValues((v) => ({ ...v, isResident: false }))}
                >
                  <Ionicons name="close-circle" size={28} color={!values.isResident ? Colors.white : Colors.mediumGray} />
                  <Text style={[styles.residentBtnText, !values.isResident && styles.residentBtnTextActive]}>לא</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {isPasswordStep ? (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => inputRef.current?.focus()}
                    style={{ width: '100%' }}
                  >
                    <Animated.View
                      style={[styles.inputWrap, styles.inputWrapPassword, { transform: [{ translateX: inputShake }] }]}
                    >
                      <TextInput
                        ref={inputRef}
                        style={[styles.input, styles.inputPassword]}
                        placeholder={currentStep.placeholder}
                        placeholderTextColor={Colors.mediumGray}
                        value={currentValue() as string}
                        onChangeText={(t) =>
                          setValues((v) => ({ ...v, [currentStep.key]: t }))
                        }
                        keyboardType="default"
                        secureTextEntry={!showPassword}
                        textAlign="right"
                        editable={!submitting}
                      />
                    </Animated.View>
                  </TouchableOpacity>
                ) : (
                  <Animated.View
                    style={[styles.inputWrap, { transform: [{ translateX: inputShake }] }]}
                  >
                    <TextInput
                      ref={inputRef}
                      style={styles.input}
                      placeholder={currentStep.placeholder}
                      placeholderTextColor={Colors.mediumGray}
                      value={currentValue() as string}
                      onChangeText={(t) =>
                        setValues((v) => ({
                          ...v,
                          [currentStep.key]: isPhoneStep ? formatPhone(normalizePhone(t)) : t,
                        }))
                      }
                      keyboardType={isPhoneStep ? 'phone-pad' : 'default'}
                      maxLength={isPhoneStep ? 12 : undefined}
                      textAlign="right"
                      editable={!submitting}
                    />
                  </Animated.View>
                )}
                {isPasswordStep && (
                  <TouchableOpacity style={styles.showPasswordBtn} onPress={() => setShowPassword((v) => !v)}>
                    <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={Colors.primary} />
                    <Text style={styles.showPasswordBtnText}>{showPassword ? 'הסתר סיסמא' : 'הצג סיסמא'}</Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {inputError ? (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle" size={16} color={Colors.error} />
                <Text style={styles.errorText}>{inputError}</Text>
              </View>
            ) : null}
          </Animated.View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.nextBtn, submitting && styles.nextBtnDisabled]}
              onPress={handleNext}
              disabled={submitting || (isResidentStep ? false : isPasswordStep ? (values.password || '').trim().length < 6 : !String(currentValue()).trim())}
            >
              <LinearGradient
                colors={
                  submitting || (isResidentStep ? false : isPasswordStep ? (values.password || '').trim().length < 6 : !String(currentValue()).trim())
                    ? [Colors.lightGray, Colors.lightGray]
                    : [Colors.primary, Colors.primaryDark]
                }
                style={styles.nextGradient}
              >
                {submitting ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <>
                    <Text style={styles.nextText}>
                      {step === STEPS.length - 1 ? 'סיום הרשמה' : 'המשך'}
                    </Text>
                    <Ionicons
                      name={step === STEPS.length - 1 ? 'checkmark' : 'arrow-back'}
                      size={22}
                      color={
                        submitting || (isResidentStep ? false : isPasswordStep ? (values.password || '').trim().length < 6 : !String(currentValue()).trim())
                          ? Colors.mediumGray
                          : Colors.white
                      }
                    />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingBottom: 8,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  dots: { flexDirection: 'row', gap: 8 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.lightGray,
  },
  dotActive: { width: 24, backgroundColor: Colors.primary },
  dotDone: { backgroundColor: Colors.success },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.lightGray,
    marginHorizontal: 16,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 2 },
  stepLabel: {
    fontSize: 13,
    color: Colors.mediumGray,
    fontWeight: '500',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    alignItems: 'center',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: 6,
  },
  stepSubtitle: {
    fontSize: 15,
    color: Colors.mediumGray,
    textAlign: 'center',
    marginBottom: 28,
  },
  inputWrap: {
    width: '100%',
    minHeight: 68,
    backgroundColor: Colors.offWhite,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    paddingHorizontal: 16,
    justifyContent: 'center',
    overflow: 'visible',
  },
  inputWrapRow: { flexDirection: 'row', alignItems: 'center' },
  inputWrapPassword: { minHeight: 56 },
  inputPassword: { minHeight: 48 },
  showPasswordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginTop: 4,
  },
  showPasswordBtnText: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  input: {
    flex: 1,
    fontSize: 26,
    color: Colors.darkGray,
    paddingVertical: 0,
    paddingRight: 4,
    paddingLeft: 4,
    minHeight: 60,
    fontWeight: '600',
    textAlign: 'right',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  residentRow: { flexDirection: 'row', gap: 16, width: '100%', justifyContent: 'center' },
  residentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    minWidth: 120,
    justifyContent: 'center',
  },
  residentBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  residentBtnText: { fontSize: 18, fontWeight: '700', color: Colors.mediumGray },
  residentBtnTextActive: { color: Colors.white },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    alignSelf: 'flex-end',
  },
  errorText: { fontSize: 13, color: Colors.error, fontWeight: '500' },
  footer: { padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
  nextBtn: { borderRadius: 18, overflow: 'hidden' },
  nextBtnDisabled: { opacity: 0.8 },
  nextGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
  },
  nextText: { fontSize: 18, fontWeight: '800', color: Colors.white },
});
