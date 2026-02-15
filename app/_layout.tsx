import LoadingApp from '@/components/LoadingApp';
import Colors from '@/constants/Colors';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Animated, Dimensions, I18nManager, Image, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

// Enable RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load anything here
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsAppReady(true);
        SplashScreen.hideAsync();

        // Start splash animation
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          })
        ]).start();

        // Hide splash after a delay
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }).start(() => setShowSplash(false));
        }, 3000);
      }
    }

    prepare();
  }, []);

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar style="dark" />
        <LinearGradient
          colors={['#BFDBFE', '#F8FAFC', '#FFFFFF', '#F8FAFC', '#BFDBFE']}
          locations={[0, 0.25, 0.5, 0.75, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View style={[styles.splashContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.splashLogo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>ברוכים הבאים</Text>
          <Text style={styles.clubName}>באר שבע</Text>
          <LoadingApp color="#DC2626" />
        </Animated.View>
      </View>
    );
  }

  return (
    <AuthProvider>
      <ToastProvider>
        <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.white },
          animation: 'slide_from_left',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="news/[id]"
          options={{
            headerShown: true,
            title: 'כתבה',
            headerStyle: { backgroundColor: Colors.white },
            headerTintColor: Colors.primary,
            headerTitleStyle: { fontWeight: '900' },
          }}
        />
        <Stack.Screen
          name="player/[id]"
          options={{
            headerShown: true,
            title: 'פרופיל',
            headerStyle: { backgroundColor: Colors.white },
            headerTintColor: Colors.primary,
            headerTitleStyle: { fontWeight: '900' },
          }}
        />
        <Stack.Screen
          name="person/[id]"
          options={{
            headerShown: true,
            title: 'אישיות',
            headerStyle: { backgroundColor: Colors.white },
            headerTintColor: Colors.primary,
            headerTitleStyle: { fontWeight: '900' },
          }}
        />
        <Stack.Screen
          name="youth"
          options={{ headerShown: true, title: 'נוער' }}
        />
        <Stack.Screen
          name="gallery"
          options={{ headerShown: true, title: 'גלריה' }}
        />
        <Stack.Screen
          name="sponsors"
          options={{ headerShown: true, title: 'עסקים' }}
        />
        <Stack.Screen
          name="donate"
          options={{ headerShown: true, title: 'צור קשר' }}
        />
        <Stack.Screen
          name="settings"
          options={{ headerShown: true, title: 'הגדרות' }}
        />
        <Stack.Screen
          name="people"
          options={{ headerShown: true, title: 'אישים' }}
        />
        <Stack.Screen
          name="coupons"
          options={{ headerShown: true, title: 'קופונים' }}
        />
        <Stack.Screen
          name="torah"
          options={{ headerShown: true, title: 'תוכן תורני' }}
        />
        <Stack.Screen
          name="health-safety"
          options={{
            headerShown: true,
            title: 'בריאות ובטיחות',
            headerStyle: { backgroundColor: Colors.white },
            headerTintColor: Colors.primary,
            headerTitleStyle: { fontWeight: '900' },
          }}
        />
        <Stack.Screen
          name="business/[id]"
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: Colors.white },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen name="real-estate" options={{ headerShown: true, title: 'נדלן', headerStyle: { backgroundColor: Colors.white }, headerTintColor: Colors.primary }} />
        <Stack.Screen name="real-estate/[id]" options={{ headerShown: true, title: 'פרטי נכס', headerStyle: { backgroundColor: Colors.white }, headerTintColor: Colors.primary }} />
        <Stack.Screen name="admin/index" options={{ headerShown: true, title: 'לוח ניהול', headerStyle: { backgroundColor: Colors.white }, headerTintColor: Colors.primary }} />
        <Stack.Screen name="admin/articles" options={{ headerShown: true, title: 'אישור כתבות', headerStyle: { backgroundColor: Colors.white }, headerTintColor: Colors.primary }} />
        <Stack.Screen name="admin/add-article" options={{ headerShown: true, title: 'הוסף כתבה', headerStyle: { backgroundColor: Colors.white }, headerTintColor: Colors.primary }} />
        <Stack.Screen name="admin/edit-people" options={{ headerShown: true, title: 'עריכת אנשים', headerStyle: { backgroundColor: Colors.white }, headerTintColor: Colors.primary }} />
        <Stack.Screen name="admin/edit-events" options={{ headerShown: true, title: 'עריכת אירועים', headerStyle: { backgroundColor: Colors.white }, headerTintColor: Colors.primary }} />
        <Stack.Screen name="admin/edit-coupons" options={{ headerShown: true, title: 'עריכת קופונים', headerStyle: { backgroundColor: Colors.white }, headerTintColor: Colors.primary }} />
        <Stack.Screen name="admin/edit-businesses" options={{ headerShown: true, title: 'עריכת עסקים', headerStyle: { backgroundColor: Colors.white }, headerTintColor: Colors.primary }} />
        <Stack.Screen name="admin/edit-city" options={{ headerShown: true, title: 'עריכת מידע עיר', headerStyle: { backgroundColor: Colors.white }, headerTintColor: Colors.primary }} />
        <Stack.Screen name="submit-article" options={{ headerShown: true, title: 'הגשת כתבה', headerStyle: { backgroundColor: Colors.white }, headerTintColor: Colors.primary }} />
        <Stack.Screen
          name="auth"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ToastProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogo: {
    width: 400,
    height: 200,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  welcomeText: {
    fontSize: 24,
    color: Colors.mediumGray,
    fontWeight: '600',
    marginBottom: 8,
  },
  clubName: {
    fontSize: 48,
    color: Colors.primary,
    fontWeight: '900',
    letterSpacing: -1,
  },
  loadingBarContainer: {
    width: 200,
    height: 4,
    backgroundColor: Colors.blueSoft,
    borderRadius: 2,
    marginTop: 40,
    overflow: 'hidden',
  },
  loadingBar: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.white,
  },
});

