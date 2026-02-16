import Colors from '@/constants/Colors';
import { getBusinessesFromFirestore } from '@/lib/businesses';
import type { BusinessFromFirestore } from '@/lib/businesses';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SponsorsScreen() {
  const router = useRouter();
  const [list, setList] = useState<BusinessFromFirestore[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getBusinessesFromFirestore();
      setList(data);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && list.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} colors={[Colors.primary]} />
        }
      >
        <View style={styles.hero}>
          <Ionicons name="business" size={48} color={Colors.accent} />
          <Text style={styles.heroTitle}>עסקים בבאר שבע</Text>
          <Text style={styles.heroSubtitle}>גלו עסקים מקומיים ושותפים בעיר</Text>
        </View>

        {list.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="storefront-outline" size={56} color={Colors.mediumGray} />
            <Text style={styles.emptyTitle}>אין עסקים כרגע</Text>
            <Text style={styles.emptySub}>עסקים יופיעו כאן כאשר יתווספו למערכת.</Text>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>כל העסקים</Text>
            <View style={styles.grid}>
              {list.map((b) => (
                <TouchableOpacity
                  key={b.id}
                  style={styles.card}
                  onPress={() => router.push(`/business/${b.id}`)}
                  activeOpacity={0.8}
                >
                  {b.image ? (
                    <ExpoImage source={{ uri: b.image }} style={styles.logo} contentFit="cover" />
                  ) : (
                    <View style={[styles.logo, styles.logoPlaceholder]}>
                      <Ionicons name="business" size={36} color={Colors.mediumGray} />
                    </View>
                  )}
                  <Text style={styles.name} numberOfLines={2}>{b.name}</Text>
                  {b.category ? <Text style={styles.category} numberOfLines={1}>{b.category}</Text> : null}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>רוצה להיות שותף?</Text>
          <Text style={styles.ctaText}>הצטרפו לאפליקציית באר שבע ופרסמו את העסק שלכם לתושבי העיר</Text>
          <TouchableOpacity style={styles.ctaButton}>
            <Ionicons name="mail-outline" size={18} color={Colors.secondary} />
            <Text style={styles.ctaButtonText}>צרו קשר</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  scrollContent: { paddingBottom: 24 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  hero: {
    backgroundColor: Colors.primary,
    paddingVertical: 36,
    alignItems: 'center',
  },
  heroTitle: { fontSize: 26, fontWeight: 'bold', color: Colors.white, marginTop: 10 },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 6 },
  empty: { alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: Colors.darkGray, marginTop: 12 },
  emptySub: { fontSize: 15, color: Colors.mediumGray, marginTop: 8, textAlign: 'center' },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.black, marginBottom: 16, textAlign: 'right' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
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
  logo: { width: '100%', height: 90, borderRadius: 8, marginBottom: 10 },
  logoPlaceholder: { backgroundColor: Colors.offWhite, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 14, fontWeight: '700', color: Colors.darkGray, textAlign: 'center' },
  category: { fontSize: 12, color: Colors.mediumGray, marginTop: 4, textAlign: 'center' },
  ctaSection: {
    margin: 16,
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  ctaTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.white, marginBottom: 8 },
  ctaText: { fontSize: 14, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginBottom: 16 },
  ctaButton: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  ctaButtonText: { fontSize: 16, fontWeight: '600', color: Colors.secondary },
});
