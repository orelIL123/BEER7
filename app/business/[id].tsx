import Colors from '@/constants/Colors';
import { businesses } from '@/constants/MockData';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const BINO_TRIBUTE = `מה הייתם עושים בגיל 22 אחרי ארבע שנים בישיבה וקרבי בכפיר?

רובנו היינו רוצים לנוח, לטוס, לשכוח קצת מהכל.

אבל דביר עמר לא חיכה לרגע המושלם.
הוא לקח אחריות והיום הוא האיש מאחורי "בינו", קיוסק קטן עם נשמה גדולה ברחוב הארזים, ליד סופר חומרי הבניין.

בלי רעש, בלי יח"צ.
פשוט עומד מאחורי הדלפק, מגיש חביתת ירק, שקשוקה, בגאט טונה ותקשיבו טוב — סנדוויץ' טוניסאי שלא תמצאו בשום מקום.

וכל זה כשהוא עדיין עושה מילואים בגזרת עזה. כן, גם עכשיו.

כי דביר לא חיפש קיצורי דרך. הוא בחר דרך.
ועושה את זה כמו לוחם, בשקט, בעקביות, עם לב ענק.

🥪 אם אתם באיזור תקפצו ל"בינו". תזמינו משהו טעים, תגידו שלום.
כי זה הרבה יותר מסנדוויץ'. זה סיפור ישראלי שעושה חשק לפרגן.`;

const BINO_FOOTER = `📍 רחוב הארזים, מול סופר חומרי בניין
⏰ פתוח מ-8:00 עד 17:00
כשר. טעים. עם נשמה.

— עם דביר עמר.`;

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const business = businesses.find((b) => b.id === id);
  const isBino = id === 'bino';

  if (!business) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>העסק לא נמצא</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>חזרה</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: business.name,
          headerBackTitle: 'חזרה',
          headerTintColor: Colors.primary,
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginRight: 16, padding: 8 }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="arrow-forward" size={26} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {isBino ? (
          <>
            <View style={styles.heroImageWrap}>
              <Image
                source={require('@/assets/images/bino.png')}
                style={styles.heroImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.content}>
              <Text style={styles.tributeTitle}>עם נשמה גדולה 💙</Text>
              <Text style={styles.tributeBody}>{BINO_TRIBUTE}</Text>
              <View style={styles.footerCard}>
                <Text style={styles.footerText}>{BINO_FOOTER}</Text>
              </View>
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => Linking.openURL('https://maps.google.com/?q=רחוב הארזים באר שבע')}
              >
                <Ionicons name="navigate" size={20} color={Colors.white} />
                <Text style={styles.ctaButtonText}>נווט לבינו</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.content}>
            {business.logo ? (
              <Image source={{ uri: business.logo }} style={styles.logo} resizeMode="contain" />
            ) : null}
            <Text style={styles.name}>{business.name}</Text>
            {business.category && (
              <Text style={styles.category}>{business.category}</Text>
            )}
            {business.address && (
              <View style={styles.row}>
                <Ionicons name="location" size={18} color={Colors.primary} />
                <Text style={styles.infoText}>{business.address}</Text>
              </View>
            )}
            {business.phone && (
              <TouchableOpacity
                style={styles.row}
                onPress={() => Linking.openURL(`tel:${business.phone}`)}
              >
                <Ionicons name="call" size={18} color={Colors.primary} />
                <Text style={styles.infoText}>{business.phone}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { fontSize: 18, color: Colors.darkGray, marginBottom: 16 },
  backBtn: { paddingVertical: 12, paddingHorizontal: 24, backgroundColor: Colors.primary, borderRadius: 12 },
  backBtnText: { color: Colors.white, fontWeight: '600' },
  heroImageWrap: {
    width: '100%',
    aspectRatio: 16 / 10,
    backgroundColor: Colors.lightGray,
  },
  heroImage: { width: '100%', height: '100%' },
  content: { padding: 20 },
  tributeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  tributeBody: {
    fontSize: 16,
    lineHeight: 26,
    color: Colors.darkGray,
    marginBottom: 20,
    textAlign: 'right',
  },
  footerCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.blueSoft,
  },
  footerText: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.darkGray,
    textAlign: 'right',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
  },
  ctaButtonText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  logo: { width: 160, height: 80, alignSelf: 'center', marginBottom: 16 },
  name: { fontSize: 22, fontWeight: '700', color: Colors.black, marginBottom: 8, textAlign: 'center' },
  category: { fontSize: 14, color: Colors.mediumGray, marginBottom: 16, textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  infoText: { fontSize: 15, color: Colors.darkGray },
});
