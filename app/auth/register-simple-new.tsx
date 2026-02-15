import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';

export default function RegisterSimpleScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResident, setIsResident] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(slide, { toValue: 0, friction: 8, tension: 60, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleRegister = async () => {
    // Validation
    if (!firstName.trim()) {
      Alert.alert('שגיאה', 'אנא הזן שם פרטי');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('שגיאה', 'אנא הזן שם משפחה');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('שגיאה', 'אנא הזן מספר טלפון');
      return;
    }
    if (!password.trim()) {
      Alert.alert('שגיאה', 'אנא הזן סיסמא');
      return;
    }
    if (password.length < 6) {
      Alert.alert('שגיאה', 'הסיסמא חייבת להיות לפחות 6 תווים');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('שגיאה', 'הסיסמאות אינן תואמות');
      return;
    }

    setLoading(true);
    try {
      // Check if phone is already taken
      const phoneDocs = await db.collection('users').where('phone', '==', phone).get();
      if (!phoneDocs.empty) {
        Alert.alert('שגיאה', 'מספר טלפון זה כבר תפוס');
        setLoading(false);
        return;
      }

      // Create a unique email from phone for Firebase Auth
      const uniqueEmail = `user_${phone.replace(/\D/g, '')}@beer7.local`;
      const uid = `user_${phone.replace(/\D/g, '')}`;

      // Create user in Firebase Auth
      await createUserWithEmailAndPassword(auth, uniqueEmail, password);

      // Create user document in Firestore
      await setDoc(doc(db, 'users', uid), {
        phone: phone,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        isResident: isResident,
        role: 'user',
        createdAt: new Date().toISOString(),
        authStatus: 'active',
      });

      console.log('✅ User registered successfully');
      Alert.alert('הצלחה', 'ההרשמה בוצעה בהצלחה!');
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('❌ Registration error:', error.message);
      
      let errorMessage = 'שגיאה בהרשמה';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'מספר טלפון זה כבר קיים';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'סיסמא חלשה מדי';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'שגיאה בעיבוד הנתונים';
      }
      
      Alert.alert('שגיאה', errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, { opacity: fade, transform: [{ translateY: slide }] }]}>
          <View style={styles.iconWrap}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              style={styles.iconGradient}
            >
              <Ionicons name="person-add" size={40} color={Colors.white} />
            </LinearGradient>
          </View>
          
          <Text style={styles.title}>הרשמה למערכת</Text>
          <Text style={styles.subtitle}>
            הזן את הפרטים שלך כדי להירשם
          </Text>

          {/* First Name */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={Colors.mediumGray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="שם פרטי"
              placeholderTextColor={Colors.lightGray}
              value={firstName}
              onChangeText={setFirstName}
              editable={!loading}
              textAlign="right"
            />
          </View>

          {/* Last Name */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={Colors.mediumGray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="שם משפחה"
              placeholderTextColor={Colors.lightGray}
              value={lastName}
              onChangeText={setLastName}
              editable={!loading}
              textAlign="right"
            />
          </View>

          {/* Phone */}
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color={Colors.mediumGray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="מספר טלפון"
              placeholderTextColor={Colors.lightGray}
              value={phone}
              onChangeText={setPhone}
              editable={!loading}
              keyboardType="phone-pad"
              textAlign="right"
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.mediumGray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="סיסמא"
              placeholderTextColor={Colors.lightGray}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
              secureTextEntry={!showPassword}
              textAlign="right"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={Colors.mediumGray}
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.mediumGray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="אימות סיסמא"
              placeholderTextColor={Colors.lightGray}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!loading}
              secureTextEntry={!showPassword}
              textAlign="right"
            />
          </View>

          {/* Resident Toggle */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>האם אתה תושב העיר?</Text>
            <View style={styles.toggleButtons}>
              <TouchableOpacity
                style={[styles.toggleBtn, isResident && styles.toggleBtnActive]}
                onPress={() => setIsResident(true)}
                disabled={loading}
              >
                <Text style={[styles.toggleBtnText, isResident && styles.toggleBtnTextActive]}>כן</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, !isResident && styles.toggleBtnActive]}
                onPress={() => setIsResident(false)}
                disabled={loading}
              >
                <Text style={[styles.toggleBtnText, !isResident && styles.toggleBtnTextActive]}>לא</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Register Button */}
        <TouchableOpacity
          style={[styles.cta, loading && styles.ctaDisabled]}
          onPress={handleRegister}
          activeOpacity={0.85}
          disabled={loading}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <>
                <Text style={styles.ctaText}>הרשמה</Text>
                <Ionicons name="arrow-back" size={22} color={Colors.white} />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
          disabled={loading}
        >
          <Ionicons name="chevron-forward" size={20} color={Colors.mediumGray} />
          <Text style={styles.backBtnText}>חזרה</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.offWhite,
    padding: 24,
    paddingBottom: 80,
  },
  content: {
    paddingTop: 16,
  },
  iconWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },
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
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.darkGray,
  },
  eyeIcon: {
    padding: 8,
  },
  toggleContainer: {
    marginVertical: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGray,
    marginBottom: 12,
    textAlign: 'center',
  },
  toggleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.offWhite,
    borderWidth: 2,
    borderColor: Colors.lightGray,
  },
  toggleBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  toggleBtnText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.mediumGray,
  },
  toggleBtnTextActive: {
    color: Colors.white,
  },
  cta: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    marginTop: 20,
  },
  ctaDisabled: {
    opacity: 0.6,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    marginBottom: 16,
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.mediumGray,
  },
});
