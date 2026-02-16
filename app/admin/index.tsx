import { isAdminPhone } from '@/constants/admin';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import * as Updates from 'expo-updates';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

type AdminSection = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description: string;
  route: string;
  color: string;
};

const SECTIONS: AdminSection[] = [
  { icon: 'newspaper', label: 'כתבות', description: 'אישור, דחייה והוספת כתבות', route: '/admin/articles', color: Colors.primary },
  { icon: 'people', label: 'אנשים', description: 'הוספה ועריכה של אישים', route: '/admin/edit-people', color: Colors.success },
  { icon: 'calendar', label: 'אירועים', description: 'ניהול אירועי העיר', route: '/admin/edit-events', color: Colors.accent },
  { icon: 'pricetag', label: 'קופונים', description: 'הוספת קופונים ומבצעים', route: '/admin/edit-coupons', color: Colors.error },
  { icon: 'business', label: 'עסקים', description: 'עריכת רשימת העסקים', route: '/admin/edit-businesses', color: Colors.blue },
  { icon: 'book', label: 'תוכן תורני', description: 'דברי תורה, פרשת שבוע, שעות שבת', route: '/admin/edit-torah', color: Colors.primaryDark },
  { icon: 'home', label: 'נדלן', description: 'ניהול נכסים להשכרה ומכירה', route: '/admin/edit-real-estate', color: Colors.accent },
  { icon: 'notifications', label: 'שליחת התראה', description: 'שליחת הודעת Push לכל המשתמשים', route: '/admin/send-notification', color: Colors.error },
  { icon: 'information-circle', label: 'מידע עיר', description: 'עריכת פרטי העיר ופרשת שבוע', route: '/admin/edit-city', color: Colors.secondary },
];

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const isAdmin = isAdminPhone(user?.phoneNumber ?? undefined);
  const [checkingUpdate, setCheckingUpdate] = useState(false);

  useEffect(() => {
    console.log('[Admin] user:', JSON.stringify(user));
    console.log('[Admin] phoneNumber:', user?.phoneNumber);
    console.log('[Admin] isAdmin:', isAdmin);
  }, [user, isAdmin]);

  async function checkForUpdates() {
    try {
      setCheckingUpdate(true);
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        Alert.alert(
          'עדכון זמין',
          'נמצא עדכון חדש לאפליקציה. האם להתקין עכשיו?',
          [
            { text: 'מאוחר יותר', style: 'cancel' },
            {
              text: 'התקן עכשיו',
              onPress: async () => {
                try {
                  await Updates.fetchUpdateAsync();
                  Alert.alert(
                    'עדכון הותקן',
                    'האפליקציה תאתחל עכשיו כדי להחיל את העדכון.',
                    [{ text: 'אישור', onPress: () => Updates.reloadAsync() }]
                  );
                } catch (error) {
                  console.error('Error fetching update:', error);
                  Alert.alert('שגיאה', 'לא ניתן להתקין את העדכון');
                }
              },
            },
          ]
        );
      } else {
        Alert.alert('אין עדכונים', 'האפליקציה מעודכנת לגרסה האחרונה');
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      Alert.alert('שגיאה', 'לא ניתן לבדוק עדכונים');
    } finally {
      setCheckingUpdate(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.msg}>טוען...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="person-circle-outline" size={56} color={Colors.mediumGray} />
        <Text style={styles.msg}>יש להתחבר תחילה.</Text>
        <Text style={styles.msgSub}>user = null</Text>
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.replace('/auth')}>
          <Text style={styles.actionBtnText}>התחבר</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="lock-closed" size={56} color={Colors.error} />
        <Text style={styles.msg}>אין הרשאת ניהול</Text>
        <Text style={styles.msgSub} selectable>📱 {user.phoneNumber}</Text>
        <Text style={styles.msgSub}>בדוק שהמספר תואם ל-constants/admin.ts</Text>
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.back()}>
          <Text style={styles.actionBtnText}>חזרה</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.hero}>
          <Ionicons name="shield-checkmark" size={40} color="rgba(255,255,255,0.9)" />
          <Text style={styles.heroTitle}>לוח ניהול</Text>
          <Text style={styles.heroSub}>שלום, {user.firstName ?? user.phoneNumber}</Text>
        </LinearGradient>

        {/* OTA Update Button */}
        <View style={styles.updateSection}>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={checkForUpdates}
            disabled={checkingUpdate}
            activeOpacity={0.8}
          >
            <View style={styles.updateButtonContent}>
              <Ionicons name="cloud-download-outline" size={24} color={Colors.white} />
              <View style={styles.updateButtonText}>
                <Text style={styles.updateButtonTitle}>
                  {checkingUpdate ? 'בודק עדכונים...' : 'בדוק עדכוני OTA'}
                </Text>
                <Text style={styles.updateButtonSubtitle}>
                  עדכונים מהירים ללא חנות אפליקציות
                </Text>
              </View>
              {checkingUpdate ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Ionicons name="chevron-back" size={20} color="rgba(255,255,255,0.7)" />
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {SECTIONS.map((sec) => (
            <TouchableOpacity
              key={sec.route}
              style={styles.card}
              onPress={() => router.push(sec.route as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.cardIcon, { backgroundColor: sec.color + '18' }]}>
                <Ionicons name={sec.icon} size={28} color={sec.color} />
              </View>
              <Text style={styles.cardLabel}>{sec.label}</Text>
              <Text style={styles.cardDesc}>{sec.description}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.mediumGray} style={styles.cardArrow} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  scrollContent: { paddingBottom: 40 },
  centered: { alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12, paddingTop: 100 },
  msg: { fontSize: 18, color: Colors.darkGray, textAlign: 'center', fontWeight: '700' },
  msgSub: { fontSize: 13, color: Colors.mediumGray, textAlign: 'center' },
  actionBtn: { backgroundColor: Colors.primary, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 14, marginTop: 8 },
  actionBtnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
  hero: { padding: 32, paddingTop: 60, alignItems: 'center', gap: 8 },
  heroTitle: { fontSize: 28, fontWeight: '900', color: Colors.white },
  heroSub: { fontSize: 15, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  updateSection: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  updateButton: {
    backgroundColor: Colors.accent,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  updateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  updateButtonText: {
    flex: 1,
  },
  updateButtonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 2,
  },
  updateButtonSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  grid: { padding: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    width: '47%', backgroundColor: Colors.white, borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: Colors.lightGray,
    elevation: 2, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8,
  },
  cardIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  cardLabel: { fontSize: 17, fontWeight: '800', color: Colors.black, marginBottom: 4, textAlign: 'right' },
  cardDesc: { fontSize: 12, color: Colors.mediumGray, lineHeight: 16, textAlign: 'right' },
  cardArrow: { position: 'absolute', top: 16, right: 12 },
});
