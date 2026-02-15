import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(slide, { toValue: 0, friction: 8, tension: 60, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'התחברות',
          headerBackTitle: 'חזרה',
          headerTintColor: Colors.primary,
          headerTitleStyle: { fontWeight: '800', fontSize: 18 },
        }}
      />
      <View style={styles.container}>
        <Animated.View style={[styles.content, { opacity: fade, transform: [{ translateY: slide }] }]}>
          <View style={styles.iconWrap}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.iconGradient}
            >
              <Ionicons name="log-in" size={40} color={Colors.white} />
            </LinearGradient>
          </View>
          <Text style={styles.title}>כבר יש לך חשבון?</Text>
          <Text style={styles.subtitle}>
            הזן מספר נייד והסיסמא שבחרת בהרשמה.
          </Text>
        </Animated.View>
        <TouchableOpacity
          style={styles.cta}
          onPress={() => router.replace('/auth/phone')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>המשך להזנת מספר</Text>
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-forward" size={20} color={Colors.mediumGray} />
          <Text style={styles.backBtnText}>חזרה</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite, padding: 24, justifyContent: 'space-between' },
  content: { flex: 1, paddingTop: 32 },
  iconWrap: { alignItems: 'center', marginBottom: 24 },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.mediumGray,
    textAlign: 'center',
    lineHeight: 24,
  },
  cta: { borderRadius: 16, overflow: 'hidden', marginBottom: 12 },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
  },
  ctaText: { fontSize: 18, fontWeight: '800', color: Colors.white },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    marginBottom: 16,
  },
  backBtnText: { fontSize: 16, fontWeight: '600', color: Colors.mediumGray },
});
