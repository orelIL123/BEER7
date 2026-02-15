import Colors from '@/constants/Colors';
import { communityPosts, featuredEvent } from '@/constants/MockData';
import type { CommunityCategory, CommunityPost } from '@/constants/Types';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Image,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const CATEGORIES: { value: CommunityCategory | 'all'; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'all', label: 'הכל', icon: 'apps' },
  { value: 'job', label: 'עבודה', icon: 'briefcase' },
  { value: 'help_needed', label: 'עזרה', icon: 'heart' },
  { value: 'tutoring', label: 'חונכות', icon: 'school' },
  { value: 'other', label: 'כללי', icon: 'chatbubbles' },
];

const CATEGORY_LABELS: Record<CommunityCategory, string> = {
  job: 'חיפוש עבודה',
  help_needed: 'עזרה לנזקקים',
  tutoring: 'חונכות ולימוד',
  other: 'כללי',
};

const CATEGORY_ICONS: Record<CommunityCategory, keyof typeof Ionicons.glyphMap> = {
  job: 'briefcase',
  help_needed: 'heart',
  tutoring: 'school',
  other: 'chatbubbles',
};

const CATEGORY_COLORS: Record<CommunityCategory, string> = {
  job: Colors.accent,
  help_needed: Colors.secondary,
  tutoring: Colors.primary,
  other: Colors.blue,
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'היום';
  if (diff === 1) return 'אתמול';
  if (diff < 7) return `לפני ${diff} ימים`;
  return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
}

export default function CommunityScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<CommunityCategory | 'all'>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return communityPosts;
    return communityPosts.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroIconWrap}>
          <Ionicons name="people" size={36} color={Colors.primaryLight} />
        </View>
        <Text style={styles.heroTitle}>קהילה</Text>
        <Text style={styles.heroSubtitle}>לוח מודעות – עבודה, עזרה, חונכות</Text>
      </LinearGradient>

      <View style={styles.content}>
        {featuredEvent && (
          <TouchableOpacity
            style={styles.eventCard}
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(tabs)/events');
            }}
            activeOpacity={0.85}
          >
            {featuredEvent.image ? (
              <Image source={{ uri: featuredEvent.image }} style={styles.eventImage} resizeMode="cover" />
            ) : null}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.eventOverlay}
            >
              <View style={styles.eventBadge}>
                <Ionicons name="star" size={14} color={Colors.yellowLight} />
                <Text style={styles.eventBadgeText}>אירוע מרכזי</Text>
              </View>
              <Text style={styles.eventTitle} numberOfLines={2}>{featuredEvent.title}</Text>
              {(featuredEvent.date || featuredEvent.place) && (
                <Text style={styles.eventMeta}>
                  {featuredEvent.date && formatDate(featuredEvent.date)}
                  {featuredEvent.date && featuredEvent.place ? ' • ' : ''}
                  {featuredEvent.place}
                </Text>
              )}
              <View style={styles.eventCta}>
                <Text style={styles.eventCtaText}>לפרטים</Text>
                <Ionicons name="arrow-back" size={16} color={Colors.white} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>מודעות</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
          style={styles.chipsScroll}
        >
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c.value}
              style={[styles.chip, filter === c.value && styles.chipActive]}
              onPress={() => {
                if (Platform.OS !== 'web') Haptics.selectionAsync();
                setFilter(c.value);
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name={c.icon}
                size={16}
                color={filter === c.value ? Colors.white : Colors.mediumGray}
              />
              <Text style={[styles.chipText, filter === c.value && styles.chipTextActive]}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="document-text-outline" size={40} color={Colors.mediumGray} />
            </View>
            <Text style={styles.emptyTitle}>אין עדיין מודעות</Text>
            <Text style={styles.emptyText}>בהמשך תוכלו לפרסם ולצפות במודעות קהילתיות – עבודה, עזרה, חונכות ועוד, עם מיקום, טלפון וכל הפרטים.</Text>
          </View>
        ) : (
          filtered.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function PostCard({ post }: { post: CommunityPost }) {
  const label = CATEGORY_LABELS[post.category];
  const icon = CATEGORY_ICONS[post.category];
  const accentColor = CATEGORY_COLORS[post.category];
  const phone = post.phone ?? post.contact;
  const cleanPhone = phone?.replace(/[\s\-]/g, '') ?? '';
  const canCall = phone && /^0\d{8,9}$/.test(cleanPhone);
  const contactDisplay = post.contact ?? post.phone;

  return (
    <View style={[styles.card, { borderRightColor: accentColor }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: accentColor + '18' }]}>
          <Ionicons name={icon} size={14} color={accentColor} />
          <Text style={[styles.categoryText, { color: accentColor }]}>{label}</Text>
        </View>
        <Text style={styles.dateText}>{formatDate(post.date)}</Text>
      </View>
      <Text style={styles.cardTitle}>{post.title}</Text>
      <Text style={styles.cardDescription} numberOfLines={3}>{post.description}</Text>
      {post.location ? (
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={14} color={Colors.mediumGray} />
          <Text style={styles.locationText}>{post.location}</Text>
        </View>
      ) : null}
      {(contactDisplay || post.authorName) && (
        <View style={styles.footer}>
          {contactDisplay && canCall ? (
            <TouchableOpacity
              style={styles.contactBtn}
              onPress={() => Linking.openURL(`tel:${cleanPhone}`)}
            >
              <Ionicons name="call" size={16} color={Colors.primary} />
              <Text style={styles.contactBtnText}>{contactDisplay}</Text>
            </TouchableOpacity>
          ) : contactDisplay ? (
            <Text style={styles.contactText}>יצירת קשר: {contactDisplay}</Text>
          ) : null}
          {post.authorName ? (
            <Text style={styles.authorText}>פורסם: {post.authorName}</Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  scrollPadding: { paddingBottom: 24 },
  hero: {
    paddingVertical: 28,
    paddingTop: 32,
    alignItems: 'center',
  },
  heroIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: { fontSize: 28, fontWeight: '800', color: Colors.white, marginTop: 12 },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  content: { padding: 16 },
  eventCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 6,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  eventImage: { width: '100%', height: 140 },
  eventCardNoImage: { minHeight: 140 },
  eventImagePlaceholder: {
    width: '100%',
    height: 140,
    backgroundColor: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: 'flex-end',
  },
  eventBadge: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  eventBadgeText: { fontSize: 12, fontWeight: '700', color: Colors.yellowLight },
  eventTitle: { fontSize: 18, fontWeight: '800', color: Colors.white },
  eventMeta: { fontSize: 12, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  eventCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  eventCtaText: { fontSize: 14, fontWeight: '700', color: Colors.white },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: Colors.black, marginBottom: 14 },
  chipsScroll: { marginHorizontal: -16 },
  chipsRow: { paddingHorizontal: 16, gap: 10, marginBottom: 18 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: { fontSize: 14, fontWeight: '700', color: Colors.darkGray },
  chipTextActive: { color: Colors.white },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.darkGray, marginTop: 16 },
  emptyText: { fontSize: 14, color: Colors.mediumGray, marginTop: 4 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderRightWidth: 4,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  categoryText: { fontSize: 12, fontWeight: '700' },
  dateText: { fontSize: 12, color: Colors.mediumGray },
  cardTitle: { fontSize: 17, fontWeight: '800', color: Colors.black },
  cardDescription: { fontSize: 15, color: Colors.darkGray, lineHeight: 22, marginTop: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  locationText: { fontSize: 13, color: Colors.mediumGray },
  footer: { marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.offWhite },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  contactBtnText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  contactText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  authorText: { fontSize: 12, color: Colors.mediumGray, marginTop: 6 },
});
