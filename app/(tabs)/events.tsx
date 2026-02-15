import Colors from '@/constants/Colors';
import { events, featuredEvent } from '@/constants/MockData';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const CENTRAL_HERO_BG = '#0f172a';

export default function EventsScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
      <View style={styles.hero}>
        <Ionicons name="star" size={44} color={Colors.accent} />
        <Text style={styles.heroTitle}>אירוע מרכזי</Text>
        <Text style={styles.heroSubtitle}>עסקים שנפתחו, לייבים ואירועים – לחברי האפליקציה</Text>
      </View>

      <View style={styles.content}>
        {featuredEvent && (
          <View style={styles.featuredWrap}>
            <View style={styles.centralEventCard}>
              {featuredEvent.image ? (
                <ExpoImage source={{ uri: featuredEvent.image }} style={styles.centralEventImage} contentFit="cover" />
              ) : (
                <View style={styles.centralEventImagePlaceholder} />
              )}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(15,23,42,0.98)']}
                style={styles.centralEventOverlay}
              />
              <View style={styles.centralEventContent}>
                <View style={styles.centralEventBadge}>
                  <Text style={styles.centralEventBadgeText}>
                    {featuredEvent.kind === 'business_opening' ? 'פתיחת עסק' : featuredEvent.kind === 'live' ? 'לייב' : 'אירוע'}
                  </Text>
                  {featuredEvent.isMembersOnly ? (
                    <Text style={styles.centralEventMembersOnly}> לחברי אפליקציה</Text>
                  ) : null}
                </View>
                <Text style={styles.centralEventTitle} numberOfLines={2}>{featuredEvent.title}</Text>
                {featuredEvent.subtitle ? (
                  <Text style={styles.centralEventSubtitle} numberOfLines={1}>{featuredEvent.subtitle}</Text>
                ) : null}
                <View style={styles.centralEventMeta}>
                  <Ionicons name="calendar-outline" size={14} color="rgba(255,255,255,0.9)" />
                  <Text style={styles.centralEventMetaText}>{featuredEvent.date}</Text>
                  {featuredEvent.place ? (
                    <>
                      <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.9)" />
                      <Text style={styles.centralEventMetaText}>{featuredEvent.place}</Text>
                    </>
                  ) : null}
                </View>
              </View>
            </View>
          </View>
        )}

        {events.length > 0 && (
          <Text style={styles.moreSectionTitle}>אירועים נוספים</Text>
        )}
        {events.length === 0 && !featuredEvent ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color={Colors.mediumGray} />
            <Text style={styles.emptyText}>אין אירוע מרכזי כרגע</Text>
          </View>
        ) : (
          events.map((event) => (
            <View key={event.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{event.title}</Text>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateText}>{event.date}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <Ionicons name="time-outline" size={16} color={Colors.mediumGray} />
                <Text style={styles.metaText}>{event.time} · {event.place}</Text>
              </View>
              {event.description ? <Text style={styles.description}>{event.description}</Text> : null}
            </View>
          ))
        )}
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  scrollPadding: { paddingBottom: 24 },
  hero: {
    backgroundColor: CENTRAL_HERO_BG,
    paddingVertical: 36,
    alignItems: 'center',
  },
  heroTitle: { fontSize: 26, fontWeight: 'bold', color: Colors.white, marginTop: 10 },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 6 },
  content: { padding: 16 },
  featuredWrap: { marginBottom: 24 },
  centralEventCard: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 220,
    backgroundColor: CENTRAL_HERO_BG,
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  centralEventImage: { ...StyleSheet.absoluteFillObject },
  centralEventImagePlaceholder: { ...StyleSheet.absoluteFillObject, backgroundColor: '#1e293b' },
  centralEventOverlay: { ...StyleSheet.absoluteFillObject },
  centralEventContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 24,
  },
  centralEventBadge: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  centralEventBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.accent,
    textTransform: 'uppercase',
  },
  centralEventMembersOnly: { fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  centralEventTitle: { fontSize: 20, fontWeight: '800', color: Colors.white },
  centralEventSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  centralEventMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  centralEventMetaText: { fontSize: 12, color: 'rgba(255,255,255,0.9)' },
  moreSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.black,
    marginBottom: 12,
  },
  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyText: { fontSize: 16, color: Colors.mediumGray, marginTop: 12 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: Colors.black, flex: 1 },
  dateBadge: { backgroundColor: '#1e293b20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  dateText: { fontSize: 12, fontWeight: '600', color: '#1e293b' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  metaText: { fontSize: 14, color: Colors.mediumGray },
  description: { fontSize: 14, color: Colors.darkGray, marginTop: 4 },
});
