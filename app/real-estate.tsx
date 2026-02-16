import Colors from '@/constants/Colors';
import type { RealEstateListing } from '@/constants/Types';
import { getRealEstateListings } from '@/lib/realEstate';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RealEstateScreen() {
  const router = useRouter();
  const [list, setList] = useState<RealEstateListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getRealEstateListings();
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
      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={styles.heroIconWrap}><Ionicons name="home" size={44} color={Colors.white} /></View>
        <Text style={styles.heroTitle}>נדלן</Text>
        <Text style={styles.heroSubtitle}>נכסים בבאר שבע – להשכרה ומכירה</Text>
      </LinearGradient>
      <View style={styles.noteCard}>
        <Ionicons name="information-circle" size={24} color={Colors.primary} />
        <Text style={styles.noteText}>פרסום נכסים כרוך בתשלום. לפרטים – צרו קשר.</Text>
      </View>

      {list.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="home-outline" size={56} color={Colors.mediumGray} />
          <Text style={styles.emptyTitle}>אין נכסים כרגע</Text>
          <Text style={styles.emptySub}>נכסים יופיעו כאן כאשר יתווספו למערכת.</Text>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} colors={[Colors.primary]} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => router.push(`/real-estate/${item.id}`)}
            >
              {item.images.length > 0 ? (
                <ExpoImage source={{ uri: item.images[0] }} style={styles.cardImage} contentFit="cover" />
              ) : (
                <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
                  <Ionicons name="home" size={40} color={Colors.mediumGray} />
                </View>
              )}
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSub}>{item.type === 'rent' ? 'השכרה' : 'מכירה'} • {item.address}</Text>
                {item.price ? <Text style={styles.cardPrice}>{item.price}</Text> : null}
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.mediumGray} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  centered: { justifyContent: 'center', alignItems: 'center' },
  hero: { paddingVertical: 32, paddingHorizontal: 24, alignItems: 'center' },
  heroIconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  heroTitle: { fontSize: 28, fontWeight: '900', color: Colors.white },
  heroSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.9)', marginTop: 6 },
  noteCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary + '14', marginHorizontal: 16, marginTop: 20, padding: 16, borderRadius: 16, gap: 12, borderWidth: 1, borderColor: Colors.primary + '30' },
  noteText: { flex: 1, fontSize: 14, color: Colors.darkGray, lineHeight: 22, textAlign: 'right' },
  listContent: { padding: 16, paddingBottom: 40 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 16, marginBottom: 12, overflow: 'hidden', borderWidth: 1, borderColor: Colors.lightGray },
  cardImage: { width: 100, height: 100 },
  cardImagePlaceholder: { backgroundColor: Colors.offWhite, alignItems: 'center', justifyContent: 'center' },
  cardBody: { flex: 1, padding: 12 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: Colors.black, marginBottom: 4, textAlign: 'right' },
  cardSub: { fontSize: 13, color: Colors.mediumGray, textAlign: 'right' },
  cardPrice: { fontSize: 15, fontWeight: '700', color: Colors.primary, marginTop: 4, textAlign: 'right' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: Colors.darkGray, marginTop: 16 },
  emptySub: { fontSize: 15, color: Colors.mediumGray, marginTop: 8, textAlign: 'center' },
});
