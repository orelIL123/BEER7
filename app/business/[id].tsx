import Colors from '@/constants/Colors';
import { getBusinessById } from '@/lib/businesses';
import type { BusinessFromFirestore } from '@/lib/businesses';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [business, setBusiness] = useState<BusinessFromFirestore | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getBusinessById(id);
      setBusiness(data);
    } catch {
      setBusiness(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Stack.Screen options={{ title: 'עסק' }} />
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!business) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Stack.Screen options={{ title: 'עסק' }} />
        <Ionicons name="alert-circle" size={48} color={Colors.mediumGray} />
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
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {business.image ? (
            <ExpoImage source={{ uri: business.image }} style={styles.heroImage} contentFit="cover" />
          ) : (
            <View style={[styles.heroImage, styles.heroPlaceholder]}>
              <Ionicons name="business" size={64} color={Colors.mediumGray} />
            </View>
          )}
          <Text style={styles.name}>{business.name}</Text>
          {business.category ? <Text style={styles.category}>{business.category}</Text> : null}
          {business.description ? <Text style={styles.description}>{business.description}</Text> : null}
          {business.address ? (
            <View style={styles.row}>
              <Ionicons name="location" size={18} color={Colors.primary} />
              <Text style={styles.infoText}>{business.address}</Text>
            </View>
          ) : null}
          {business.phone ? (
            <TouchableOpacity style={styles.row} onPress={() => Linking.openURL(`tel:${business.phone}`)}>
              <Ionicons name="call" size={18} color={Colors.primary} />
              <Text style={styles.infoText}>{business.phone}</Text>
            </TouchableOpacity>
          ) : null}
          {business.hours ? (
            <View style={styles.row}>
              <Ionicons name="time" size={18} color={Colors.primary} />
              <Text style={styles.infoText}>{business.hours}</Text>
            </View>
          ) : null}
          {business.website ? (
            <TouchableOpacity style={styles.row} onPress={() => Linking.openURL(business.website)}>
              <Ionicons name="globe" size={18} color={Colors.primary} />
              <Text style={styles.infoText}>אתר אינטרנט</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  content: { padding: 20 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: Colors.darkGray, marginBottom: 16 },
  backBtn: { paddingVertical: 12, paddingHorizontal: 24, backgroundColor: Colors.primary, borderRadius: 12 },
  backBtnText: { color: Colors.white, fontWeight: '600' },
  heroImage: { width: '100%', height: 200, borderRadius: 16, marginBottom: 20 },
  heroPlaceholder: { backgroundColor: Colors.offWhite, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 22, fontWeight: '800', color: Colors.black, marginBottom: 8, textAlign: 'right' },
  category: { fontSize: 14, color: Colors.mediumGray, marginBottom: 12, textAlign: 'right' },
  description: { fontSize: 15, lineHeight: 24, color: Colors.darkGray, marginBottom: 16, textAlign: 'right' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  infoText: { fontSize: 15, color: Colors.darkGray, flex: 1, textAlign: 'right' },
});
