import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const BENEFITS = [
  { icon: 'pricetag' as const, text: 'קופונים והנחות מחנויות בעיר', color: '#F59E0B' },
  { icon: 'megaphone' as const, text: 'התראות על מבצעים ואירועים', color: '#F87171' },
  { icon: 'newspaper' as const, text: 'עדכונים על כתבות חדשות', color: '#2563EB' },
  { icon: 'create' as const, text: 'אפשרות לפרסם בקהילה', color: '#10B981' },
];

export default function AuthWelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleBtn = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.spring(scaleBtn, {
        toValue: 1,
        friction: 6,
        tension: 80,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Background gradient */}
        <LinearGradient
          colors={[Colors.primary + 'CC', Colors.primaryDark]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Top decorative circles */}
        <View style={styles.circleTopRight} />
        <View style={styles.circleBottomLeft} />

        {/* Back button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-forward" size={26} color={Colors.white} />
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Logo / Icon hero */}
          <View style={styles.iconHero}>
            <View style={styles.iconRing}>
              <Ionicons name="people" size={44} color={Colors.white} />
            </View>
          </View>

          <Text style={styles.title}>הצטרפו לקהילה</Text>
          <Text style={styles.subtitle}>
            האפליקציה פתוחה לכולם – עם הרשמה תקבלו הרבה יותר
          </Text>

          {/* Benefits card */}
          <View style={styles.card}>
            {BENEFITS.map((b, i) => (
              <BenefitRow key={i} icon={b.icon} text={b.text} color={b.color} delay={i * 80} />
            ))}
          </View>
        </Animated.View>

        {/* CTA at bottom */}
        <Animated.View style={[styles.ctaWrap, { transform: [{ scale: scaleBtn }] }]}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push('/auth/explain-sms')}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaText}>התחל הרשמה</Text>
            <Ionicons name="arrow-back" size={22} color={Colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/auth/login')} style={styles.skipBtn}>
            <Text style={styles.skipText}>כבר יש לך חשבון? התחבר</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} style={styles.skipBtn}>
            <Text style={[styles.skipText, { opacity: 0.8, fontSize: 13 }]}>דלג, אמשיך בלי הרשמה</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
  );
}

function BenefitRow({
  icon,
  text,
  color,
  delay,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  color: string;
  delay: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 400,
      delay: 300 + delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.benefitRow, { opacity: anim }]}>
      <View style={[styles.benefitIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.benefitText}>{text}</Text>
      <Ionicons name="checkmark-circle" size={18} color={color} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 48,
  },
  circleTopRight: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  circleBottomLeft: {
    position: 'absolute',
    bottom: 80,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  backBtn: {
    marginTop: 56,
    marginRight: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  iconHero: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray + '60',
    gap: 12,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    color: Colors.darkGray,
    fontWeight: '600',
    textAlign: 'right',
  },
  ctaWrap: {
    paddingHorizontal: 24,
    gap: 14,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 18,
    paddingVertical: 18,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primary,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
});
