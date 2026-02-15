import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BULLETS = [
  'מזינים שם פרטי, שם משפחה ותושבות',
  'מזינים מספר נייד',
  'מחוברים – וזהו',
];

export default function ExplainSmsScreen() {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slide, { toValue: 0, friction: 8, tension: 60, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'הרשמה עם מספר נייד',
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
              <Ionicons name="chatbubble-ellipses" size={40} color={Colors.white} />
            </LinearGradient>
          </View>
          <Text style={styles.title}>פשוט וברור</Text>
          <Text style={styles.subtitle}>
            מזינים מספר, לוחצים המשך – ומחוברים.
          </Text>
          <View style={styles.bullets}>
            {BULLETS.map((line, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={styles.bulletNum}>
                  <Text style={styles.bulletNumText}>{i + 1}</Text>
                </View>
                <Text style={styles.bulletText}>{line}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
        <TouchableOpacity
          style={styles.cta}
          onPress={() => router.replace('/auth/register-steps')}
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
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite, padding: 24, justifyContent: 'space-between' },
  content: { flex: 1, paddingTop: 24 },
  iconWrap: { alignItems: 'center', marginBottom: 20 },
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
    marginBottom: 28,
    lineHeight: 24,
  },
  bullets: { gap: 14 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bulletNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulletNumText: { fontSize: 14, fontWeight: '800', color: Colors.primary },
  bulletText: { flex: 1, fontSize: 16, color: Colors.darkGray, fontWeight: '600', textAlign: 'right' },
  cta: { borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
  },
  ctaText: { fontSize: 18, fontWeight: '800', color: Colors.white },
});
