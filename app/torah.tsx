import AppBackButton from '@/components/AppBackButton';
import Colors from '@/constants/Colors';
import { dvarTorahList, parashaShavua } from '@/constants/MockData';
import { DvarTorah } from '@/constants/Types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type DvarFilter = 'all' | 'daily' | 'weekly';

export default function TorahScreen() {
  const router = useRouter();
  const [dvarFilter, setDvarFilter] = useState<DvarFilter>('all');

  const filteredDvarim = dvarTorahList.filter((d) => {
    if (dvarFilter === 'all') return true;
    return d.type === dvarFilter;
  });

  return (
    <View style={{ flex: 1 }}>
      <AppBackButton dark />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.padding}>
        <View style={styles.hero}>
          <Ionicons name="book" size={48} color={Colors.white} />
          <Text style={styles.heroTitle}>תוכן תורני</Text>
          <Text style={styles.heroSubtitle}>פרשת השבוע ודבר תורה</Text>
        </View>

        {/* פרשת השבוע */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="star" size={22} color={Colors.accent} />
            <Text style={styles.sectionTitle}>פרשת השבוע</Text>
          </View>
          <View style={styles.parashaCard}>
            <Text style={styles.parashaName}>{parashaShavua.name}</Text>
            {parashaShavua.weekLabel ? (
              <Text style={styles.parashaWeek}>{parashaShavua.weekLabel}</Text>
            ) : null}
            {parashaShavua.summary ? (
              <Text style={styles.parashaSummary}>{parashaShavua.summary}</Text>
            ) : null}
          </View>
          <Text style={styles.adminNote}>ניתן לעדכן את פרשת השבוע ממערכת הניהול (אדמין).</Text>
        </View>

        {/* דבר תורה */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={22} color={Colors.primary} />
            <Text style={styles.sectionTitle}>דבר תורה</Text>
          </View>
          <View style={styles.filterRow}>
            {(['all', 'daily', 'weekly'] as const).map((key) => (
              <TouchableOpacity
                key={key}
                style={[styles.filterChip, dvarFilter === key && styles.filterChipActive]}
                onPress={() => setDvarFilter(key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, dvarFilter === key && styles.filterChipTextActive]}>
                  {key === 'all' ? 'הכל' : key === 'daily' ? 'יומי' : 'שבועי'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {filteredDvarim.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>אין כרגע דבר תורה להצגה בקטגוריה זו.</Text>
            </View>
          ) : (
            filteredDvarim.map((d) => <DvarCard key={d.id} dvar={d} />)
          )}
          <Text style={styles.adminNote}>דברי התורה מתעדכנים על ידי האדמין (יומי/שבועי).</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function DvarCard({ dvar }: { dvar: DvarTorah }) {
  const typeLabel = dvar.type === 'daily' ? 'דבר תורה יומי' : 'דבר תורה שבועי';
  const typeColor = dvar.type === 'daily' ? Colors.blue : Colors.primary;
  return (
    <View style={styles.dvarCard}>
      <View style={styles.dvarMeta}>
        <View style={[styles.dvarTypeBadge, { backgroundColor: typeColor + '20' }]}>
          <Text style={[styles.dvarTypeText, { color: typeColor }]}>{typeLabel}</Text>
        </View>
        <Text style={styles.dvarDate}>{formatDate(dvar.date)}</Text>
      </View>
      <Text style={styles.dvarTitle}>{dvar.title}</Text>
      <Text style={styles.dvarContent}>{dvar.content}</Text>
      {dvar.author ? (
        <Text style={styles.dvarAuthor}>— {dvar.author}</Text>
      ) : null}
    </View>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  padding: { paddingBottom: 24 },
  hero: {
    backgroundColor: Colors.primary,
    paddingVertical: 36,
    alignItems: 'center',
  },
  heroTitle: { fontSize: 26, fontWeight: 'bold', color: Colors.white, marginTop: 10 },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 6 },
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  parashaCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 8,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderRightWidth: 4,
    borderRightColor: Colors.accent,
  },
  parashaName: { fontSize: 24, fontWeight: '900', color: Colors.primary, textAlign: 'center' },
  parashaWeek: { fontSize: 13, color: Colors.mediumGray, textAlign: 'center', marginTop: 6 },
  parashaSummary: { fontSize: 15, color: Colors.darkGray, lineHeight: 24, marginTop: 12, textAlign: 'right' },
  adminNote: { fontSize: 11, color: Colors.mediumGray, marginTop: 8, textAlign: 'right' },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterChipText: { fontSize: 14, fontWeight: '700', color: Colors.mediumGray },
  filterChipTextActive: { color: Colors.white },
  emptyCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: { fontSize: 15, color: Colors.mediumGray },
  dvarCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  dvarMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  dvarTypeBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  dvarTypeText: { fontSize: 12, fontWeight: '700' },
  dvarDate: { fontSize: 12, color: Colors.mediumGray },
  dvarTitle: { fontSize: 18, fontWeight: '800', color: Colors.black, marginBottom: 8, textAlign: 'right' },
  dvarContent: { fontSize: 15, color: Colors.darkGray, lineHeight: 24, textAlign: 'right' },
  dvarAuthor: { fontSize: 13, color: Colors.primary, fontWeight: '600', marginTop: 10, textAlign: 'right' },
});
