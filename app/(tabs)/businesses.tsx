import Colors from '@/constants/Colors';
import { businesses } from '@/constants/MockData';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    ImageSourcePropType,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function BusinessesScreen() {
  const router = useRouter();
  const bino = businesses.find((b) => b.id === 'bino');
  const otherBusinesses = businesses.filter((b) => b.id !== 'bino');

  const getLogoSource = (b: (typeof businesses)[0]): ImageSourcePropType =>
    b.id === 'bino' ? require('@/assets/images/bino.png') : { uri: b.logo };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Ionicons name="business" size={48} color={Colors.accent} />
        <Text style={styles.heroTitle}>עסקים בבאר שבע</Text>
        <Text style={styles.heroSubtitle}>גלו עסקים מקומיים ושותפים בעיר</Text>
      </View>

      {bino && (
        <TouchableOpacity
          style={styles.binoFeatured}
          onPress={() => router.push('/business/bino')}
          activeOpacity={0.9}
        >
          <Image source={require('@/assets/images/bino.png')} style={styles.binoImage} resizeMode="cover" />
          <View style={styles.binoOverlay}>
            <Text style={styles.binoTitle}>הפיתה של בינו</Text>
            <Text style={styles.binoTagline}>קיוסק עם נשמה גדולה • רחוב הארזים</Text>
            <View style={styles.binoCta}>
              <Text style={styles.binoCtaText}>קראו את הסיפור</Text>
              <Ionicons name="arrow-back" size={18} color={Colors.white} />
            </View>
          </View>
        </TouchableOpacity>
      )}

      {otherBusinesses.length > 0 && (
        <View style={styles.otherSection}>
          <Text style={styles.otherSectionTitle}>עסקים נוספים</Text>
          <View style={styles.otherGrid}>
            {otherBusinesses.map((b) => (
              <TouchableOpacity key={b.id} style={styles.card} onPress={() => router.push(`/business/${b.id}`)}>
                <Image source={getLogoSource(b)} style={styles.logo} />
                <Text style={styles.name}>{b.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.ctaSection}>
        <Text style={styles.ctaBadge}>פרסום בתשלום</Text>
        <Text style={styles.ctaTitle}>פרסום עסקים בבאר שבע</Text>
        <Text style={styles.ctaText}>הגיעו לאלפי תושבי העיר. מקום בולט בעמוד העסקים, חשיפה ממוקדת לקהל מקומי. בואו נדבר על חבילות פרסום.</Text>
        <TouchableOpacity style={styles.ctaButton}>
          <Ionicons name="megaphone-outline" size={18} color={Colors.primary} />
          <Text style={styles.ctaButtonText}>לפרסום העסק שלי</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  hero: {
    backgroundColor: Colors.primary,
    paddingVertical: 20,
    alignItems: 'center',
  },
  heroTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.white, marginTop: 6 },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  binoFeatured: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.primaryDark,
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  binoImage: {
    width: '100%',
    height: 200,
  },
  binoOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
    justifyContent: 'flex-end',
  },
  binoTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.white,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  binoTagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.95)',
    marginTop: 4,
  },
  binoCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  binoCtaText: { fontSize: 15, fontWeight: '700', color: Colors.white },
  otherSection: { paddingHorizontal: 16, paddingBottom: 8 },
  otherSectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.black, marginBottom: 12 },
  otherGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  logo: { width: 120, height: 50, borderRadius: 6, marginBottom: 8 },
  name: { fontSize: 13, fontWeight: '600', color: Colors.darkGray, textAlign: 'center' },
  ctaSection: {
    margin: 16,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  ctaBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryLight,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  ctaTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.white, marginBottom: 8 },
  ctaText: { fontSize: 14, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginBottom: 16, lineHeight: 22 },
  ctaButton: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  ctaButtonText: { fontSize: 16, fontWeight: '600', color: Colors.primary },
});
