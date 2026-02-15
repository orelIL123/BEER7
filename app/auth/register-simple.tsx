import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const STEPS = [
  {
    key: 'name',
    title: 'מה שמך?',
    subtitle: 'איך נפנה אליך',
    icon: 'person' as const,
    placeholder: 'שם מלא',
    keyboardType: 'default' as const,
    secure: false,
  },
  {
    key: 'phone',
    title: 'מספר טלפון',
    subtitle: 'לשמירה על החשבון',
    icon: 'call' as const,
    placeholder: '05X-XXX-XXXX',
    keyboardType: 'phone-pad' as const,
    secure: false,
  },
  {
    key: 'password',
    title: 'בחר סיסמא',
    subtitle: 'לפחות 6 תווים',
    icon: 'lock-closed' as const,
    placeholder: '••••••••',
    keyboardType: 'default' as const,
    secure: true,
  },
];

export default function RegisterSimpleScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({ name: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [inputError, setInputError] = useState('');

  // Animations
  const slideX = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const inputShake = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // Animate progress bar
    Animated.spring(progressAnim, {
      toValue: (step + 1) / STEPS.length,
      friction: 8,
      useNativeDriver: false,
    }).start();

    // Focus input on step change
    setTimeout(() => inputRef.current?.focus(), 400);
  }, [step]);

  function currentValue() {
    return values[STEPS[step].key as keyof typeof values];
  }

  function validate(): boolean {
    const val = currentValue().trim();
    if (step === 0 && val.length < 2) {
      shakeError('שם חייב להכיל לפחות 2 תווים');
      return false;
    }
    if (step === 1 && !/^0[5-9]\d{8}$/.test(val.replace(/[-\s]/g, ''))) {
      shakeError('מספר טלפון לא תקין');
      return false;
    }
    if (step === 2 && val.length < 6) {
      shakeError('סיסמא חייבת להכיל לפחות 6 תווים');
      return false;
    }
    return true;
  }

  function shakeError(msg: string) {
    setInputError(msg);
    Animated.sequence([
      Animated.timing(inputShake, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(inputShake, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(inputShake, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(inputShake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }

  function goToStep(next: number, direction: 1 | -1) {
    Keyboard.dismiss();
    Animated.parallel([
      Animated.timing(contentOpacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(slideX, { toValue: -40 * direction, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setStep(next);
      setInputError('');
      slideX.setValue(40 * direction);
      Animated.parallel([
        Animated.timing(contentOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(slideX, { toValue: 0, friction: 8, tension: 60, useNativeDriver: true }),
      ]).start();
    });
  }

  function handleNext() {
    if (!validate()) return;
    if (step < STEPS.length - 1) {
      goToStep(step + 1, 1);
    } else {
      handleFinish();
    }
  }

  function handleBack() {
    if (step === 0) {
      router.back();
    } else {
      goToStep(step - 1, -1);
    }
  }

  function handleFinish() {
    // Animate checkmark
    Animated.spring(checkScale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();

    // TODO: save to Firebase / backend
    setTimeout(() => {
      router.replace('/');
    }, 1200);
  }

  const currentStep = STEPS[step];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={handleBack}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons
                name={step === 0 ? 'close' : 'chevron-forward'}
                size={24}
                color={Colors.primary}
              />
            </TouchableOpacity>

            {/* Step dots */}
            <View style={styles.dots}>
              {STEPS.map((_, i) => (
                <StepDot key={i} active={i === step} done={i < step} />
              ))}
            </View>

            <View style={{ width: 40 }} />
          </View>

          {/* Progress bar */}
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

          {/* Step label */}
          <View style={styles.stepLabelWrap}>
            <Text style={styles.stepLabel}>
              שלב {step + 1} מתוך {STEPS.length}
            </Text>
          </View>

          {/* Content area */}
          <Animated.View
            style={[
              styles.contentArea,
              {
                opacity: contentOpacity,
                transform: [{ translateX: slideX }],
              },
            ]}
          >
            {/* Icon */}
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.stepIconWrap}
            >
              <Ionicons name={currentStep.icon} size={32} color={Colors.white} />
            </LinearGradient>

            <Text style={styles.stepTitle}>{currentStep.title}</Text>
            <Text style={styles.stepSubtitle}>{currentStep.subtitle}</Text>

            {/* Input */}
            <Animated.View
              style={[
                styles.inputWrap,
                inputError ? styles.inputWrapError : null,
                { transform: [{ translateX: inputShake }] },
              ]}
            >
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder={currentStep.placeholder}
                placeholderTextColor={Colors.mediumGray}
                value={currentValue()}
                onChangeText={(t) => {
                  setValues((v) => ({ ...v, [currentStep.key]: t }));
                  if (inputError) setInputError('');
                }}
                keyboardType={currentStep.keyboardType}
                secureTextEntry={currentStep.secure && !showPassword}
                autoCapitalize={currentStep.key === 'name' ? 'words' : 'none'}
                returnKeyType={step < STEPS.length - 1 ? 'next' : 'done'}
                onSubmitEditing={handleNext}
                textAlign="right"
              />
              {currentStep.secure && (
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  style={styles.eyeBtn}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={22}
                    color={Colors.mediumGray}
                  />
                </TouchableOpacity>
              )}
            </Animated.View>

            {inputError ? (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle" size={16} color={Colors.error} />
                <Text style={styles.errorText}>{inputError}</Text>
              </View>
            ) : null}
          </Animated.View>

          {/* CTA */}
          <View style={styles.ctaArea}>
            <TouchableOpacity
              style={[
                styles.nextBtn,
                !currentValue().trim() && styles.nextBtnDisabled,
              ]}
              onPress={handleNext}
              activeOpacity={0.85}
              disabled={!currentValue().trim()}
            >
              <LinearGradient
                colors={
                  currentValue().trim()
                    ? [Colors.primary, Colors.primaryDark]
                    : [Colors.lightGray, Colors.lightGray]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.nextGradient}
              >
                <Text style={[styles.nextText, !currentValue().trim() && styles.nextTextDisabled]}>
                  {step === STEPS.length - 1 ? 'סיים הרשמה' : 'המשך'}
                </Text>
                <Ionicons
                  name={step === STEPS.length - 1 ? 'checkmark' : 'arrow-back'}
                  size={22}
                  color={currentValue().trim() ? Colors.white : Colors.mediumGray}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {/* Success overlay */}
      <Animated.View
        pointerEvents="none"
        style={[styles.successOverlay, { opacity: checkScale }]}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View style={{ transform: [{ scale: checkScale }] }}>
          <Ionicons name="checkmark-circle" size={100} color={Colors.white} />
          <Text style={styles.successText}>נרשמת בהצלחה!</Text>
        </Animated.View>
      </Animated.View>
    </>
  );
}

function StepDot({ active, done }: { active: boolean; done: boolean }) {
  return (
    <View
      style={[
        styles.dot,
        active && styles.dotActive,
        done && styles.dotDone,
      ]}
    >
      {done && <Ionicons name="checkmark" size={10} color={Colors.white} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    width: 28,
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  dotDone: {
    backgroundColor: Colors.success,
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.lightGray,
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  stepLabelWrap: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  stepLabel: {
    fontSize: 13,
    color: Colors.mediumGray,
    fontWeight: '500',
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 40,
    alignItems: 'center',
  },
  stepIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  stepSubtitle: {
    fontSize: 15,
    color: Colors.mediumGray,
    textAlign: 'center',
    marginBottom: 36,
  },
  inputWrap: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.offWhite,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputWrapError: {
    borderColor: Colors.error,
    backgroundColor: Colors.error + '08',
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: Colors.darkGray,
    paddingVertical: 16,
    fontWeight: '600',
    textAlign: 'right',
  },
  eyeBtn: {
    padding: 8,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  errorText: {
    fontSize: 13,
    color: Colors.error,
    fontWeight: '500',
  },
  ctaArea: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 32,
  },
  nextBtn: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  nextBtnDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  nextGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
  },
  nextText: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.white,
  },
  nextTextDisabled: {
    color: Colors.mediumGray,
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  successText: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.white,
    textAlign: 'center',
    marginTop: 16,
  },
});
