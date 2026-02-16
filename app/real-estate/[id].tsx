import Colors from '@/constants/Colors';
import type { RealEstateListing } from '@/constants/Types';
import { getRealEstateById } from '@/lib/realEstate';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const IMG_W = width - 32;

export default function RealEstateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [listing, setListing] = useState<RealEstateListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getRealEstateById(id);
      setListing(data);
    } catch {
      setListing(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: 'פרטי נכס' }} />
        <View style={[styles.container, styles.centered]}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </>
    );
  }

  if (!listing) {
    return (
      <>
        <Stack.Screen options={{ title: 'פרטי נכס' }} />
        <View style={[styles.container, styles.centered]}>
          <Ionicons name="alert-circle" size={48} color={Colors.mediumGray} />
          <Text style={styles.errorText}>הנכס לא נמצא</Text>
        </View>
      </>
    );
  }

  const images = listing.images?.length ? listing.images : [];

  return (
    <>
      <Stack.Screen options={{ title: listing.title }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {images.length > 0 ? (
          <View style={styles.galleryWrap}>
            <FlatList
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const i = Math.round(e.nativeEvent.contentOffset.x / width);
                setImgIndex(i);
              }}
              renderItem={({ item }) => (
                <View style={[styles.imgSlide, { width }] as any}>
                  <ExpoImage source={{ uri: item }} style={styles.galleryImg} contentFit="cover" />
                </View>
              )}
            />
            {images.length > 1 && (
              <View style={styles.dots}>
                {images.map((_, i) => (
                  <View
                    key={i}
                    style={[styles.dot, i === imgIndex && styles.dotActive]}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.noImg}>
            <Ionicons name="images-outline" size={48} color={Colors.mediumGray} />
            <Text style={styles.noImgText}>אין תמונות</Text>
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.title}>{listing.title}</Text>
          <View style={styles.metaRow}>
            <View style={[styles.badge, { backgroundColor: Colors.primary + '20' }]}>
              <Text style={[styles.badgeText, { color: Colors.primary }]}>{listing.type === 'rent' ? 'השכרה' : 'מכירה'}</Text>
            </View>
            {listing.price && <Text style={styles.price}>{listing.price}</Text>}
          </View>
          {listing.address ? (
            <View style={styles.row}>
              <Ionicons name="location" size={18} color={Colors.mediumGray} />
              <Text style={styles.address}>{listing.address}</Text>
            </View>
          ) : null}
          {listing.description ? (
            <Text style={styles.description}>{listing.description}</Text>
          ) : null}
        </View>

        {(listing.agentName || listing.agentImage) && (
          <View style={styles.agentCard}>
            {listing.agentImage ? (
              <ExpoImage source={{ uri: listing.agentImage }} style={styles.agentImg} />
            ) : (
              <View style={[styles.agentImg, styles.agentImgPlaceholder]}>
                <Ionicons name="person" size={28} color={Colors.mediumGray} />
              </View>
            )}
            <View style={styles.agentInfo}>
              <Text style={styles.agentLabel}>מתווך</Text>
              <Text style={styles.agentName}>{listing.agentName || 'מתווך'}</Text>
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  content: { paddingBottom: 40 },
  centered: { justifyContent: 'center', alignItems: 'center', flex: 1 },
  errorText: { fontSize: 16, color: Colors.mediumGray, marginTop: 12 },
  galleryWrap: { marginBottom: 16 },
  imgSlide: { alignItems: 'center' },
  galleryImg: { width: IMG_W, height: 220, borderRadius: 16 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.lightGray },
  dotActive: { backgroundColor: Colors.primary },
  noImg: { alignItems: 'center', padding: 40, backgroundColor: Colors.white, marginHorizontal: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.lightGray },
  noImgText: { fontSize: 14, color: Colors.mediumGray, marginTop: 8 },
  infoCard: { backgroundColor: Colors.white, marginHorizontal: 16, padding: 20, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: Colors.lightGray },
  title: { fontSize: 22, fontWeight: '900', color: Colors.black, marginBottom: 12, textAlign: 'right' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeText: { fontSize: 14, fontWeight: '700' },
  price: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  address: { fontSize: 15, color: Colors.darkGray, flex: 1, textAlign: 'right' },
  description: { fontSize: 15, color: Colors.darkGray, lineHeight: 24, marginTop: 8, textAlign: 'right' },
  agentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, marginHorizontal: 16, padding: 16, borderRadius: 20, borderWidth: 1, borderColor: Colors.lightGray },
  agentImg: { width: 56, height: 56, borderRadius: 28 },
  agentImgPlaceholder: { backgroundColor: Colors.offWhite, alignItems: 'center', justifyContent: 'center' },
  agentInfo: { flex: 1, marginRight: 12 },
  agentLabel: { fontSize: 12, color: Colors.mediumGray, marginBottom: 2 },
  agentName: { fontSize: 16, fontWeight: '800', color: Colors.black, textAlign: 'right' },
});
