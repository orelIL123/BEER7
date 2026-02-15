import Colors from '@/constants/Colors';
import { coupons } from '@/constants/MockData';
import type { Coupon } from '@/constants/Types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

function getRemainingText(c: Coupon): string | null {
  if (c.maxRedemptions == null) return null;
  const used = c.redemptionCount ?? 0;
  const left = Math.max(0, c.maxRedemptions - used);
  if (left === 0) return 'הקופון אזל';
  return `נותר ל־${left} ממשיכים`;
}

export default function CouponsScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.padding}>
      <View style={styles.hero}>
        <Ionicons name="pricetag" size={48} color={Colors.yellowLight} />
        <Text style={styles.heroTitle}>קופונים ומבצעים</Text>
        <Text style={styles.heroSubtitle}>הנחות אצל עסקי באר שבע – הגע לחנות והצג את הקופון</Text>
      </View>
      <View style={styles.inStoreNote}>
        <Ionicons name="storefront-outline" size={20} color={Colors.blue} />
        <Text style={styles.inStoreNoteText}>הגע פיזית לחנות, הצג את הקופון – בעל העסק יסרוק/יאשר ויבדוק אם נותר מקום. בהתאם יקבלת את ההנחה.</Text>
      </View>
      <View style={styles.list}>
        {coupons.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="pricetag-outline" size={48} color={Colors.mediumGray} />
            <Text style={styles.emptyText}>אין קופונים כרגע</Text>
          </View>
        ) : (
          coupons.map((c) => {
            const remaining = getRemainingText(c);
            const isExhausted = remaining === 'הקופון אזל';
            return (
              <View key={c.id} style={[styles.card, isExhausted && styles.cardExhausted]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.businessName}>{c.businessName}</Text>
                  <View style={styles.badgesRow}>
                    {c.membersOnly && (
                      <View style={styles.membersBadge}>
                        <Text style={styles.membersBadgeText}>לחברי אפליקציה</Text>
                      </View>
                    )}
                    <View style={[styles.validBadge, isExhausted && styles.validBadgeExhausted]}>
                      <Text style={styles.validText}>תקף עד {c.validUntil}</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.title}>{c.title}</Text>
                <Text style={styles.description}>{c.description}</Text>
                {remaining && (
                  <Text style={[styles.remainingText, isExhausted && styles.remainingTextExhausted]}>
                    {remaining}
                  </Text>
                )}
                {c.code ? (
                  <View style={styles.codeBox}>
                    <Text style={styles.codeLabel}>קוד להצגה בחנות:</Text>
                    <Text style={styles.codeValue}>{c.code}</Text>
                  </View>
                ) : null}
                <Text style={styles.scanHint}>הצג את הקופון בחנות – העסק יסרוק לאישור</Text>
              </View>
            );
          })
        )}
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  padding: { paddingBottom: 24 },
  hero: {
    backgroundColor: Colors.blue,
    paddingVertical: 36,
    alignItems: 'center',
  },
  heroTitle: { fontSize: 26, fontWeight: 'bold', color: Colors.white, marginTop: 10 },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 6 },
  inStoreNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.blueSoft,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 12,
    gap: 10,
  },
  inStoreNoteText: {
    flex: 1,
    fontSize: 13,
    color: Colors.darkGray,
    fontWeight: '600',
  },
  list: { padding: 16 },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyText: { fontSize: 16, color: Colors.mediumGray, marginTop: 12 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardExhausted: { opacity: 0.75 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  businessName: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  badgesRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  membersBadge: { backgroundColor: Colors.yellowSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  membersBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.yellow },
  validBadge: { backgroundColor: Colors.offWhite, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  validBadgeExhausted: { backgroundColor: Colors.lightGray },
  validText: { fontSize: 11, color: Colors.mediumGray, fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '800', color: Colors.black },
  description: { fontSize: 14, color: Colors.darkGray, marginTop: 6 },
  remainingText: { fontSize: 13, fontWeight: '700', color: Colors.primary, marginTop: 8 },
  remainingTextExhausted: { color: Colors.error },
  codeBox: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 },
  codeLabel: { fontSize: 12, color: Colors.mediumGray, fontWeight: '600' },
  codeValue: { fontSize: 16, fontWeight: '800', color: Colors.primary, letterSpacing: 2 },
  scanHint: { fontSize: 12, color: Colors.mediumGray, marginTop: 12, fontWeight: '600' },
});
