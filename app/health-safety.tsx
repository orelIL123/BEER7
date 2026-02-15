import Colors from '@/constants/Colors';
import {
    emergencyGuidelinesUrl,
    emergencyNumbers,
    helpPoints,
} from '@/constants/MockData';
import type { HelpPointType } from '@/constants/Types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const HELP_POINT_LABELS: Record<HelpPointType, string> = {
  mda: 'מד״א',
  clinic: 'מרפאה',
  pharmacy: 'בית מרקחת',
  hospital: 'בית חולים',
};

const HELP_POINT_ICONS: Record<HelpPointType, keyof typeof Ionicons.glyphMap> = {
  mda: 'medkit-outline',
  clinic: 'medical-outline',
  pharmacy: 'medkit-outline',
  hospital: 'business-outline',
};

export default function HealthSafetyScreen() {
  const openPhone = (number: string) => {
    const clean = number.replace(/\D/g, '');
    Linking.openURL(`tel:${clean}`);
  };

  const openGuidelines = () => {
    Linking.openURL(emergencyGuidelinesUrl);
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.padding}
    >
      <View style={styles.hero}>
        <Ionicons name="shield-checkmark" size={48} color={Colors.yellowLight} />
        <Text style={styles.heroTitle}>בריאות ובטיחות</Text>
        <Text style={styles.heroSubtitle}>מספרי חירום, נקודות עזרה והנחיות</Text>
      </View>

      {/* מספרי חירום */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>מספרי חירום</Text>
        <View style={styles.emergencyGrid}>
          {emergencyNumbers.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.emergencyCard}
              onPress={() => openPhone(item.number)}
              activeOpacity={0.8}
            >
              <Ionicons name="call" size={28} color={Colors.error} />
              <Text style={styles.emergencyName}>{item.name}</Text>
              <Text style={styles.emergencyNumber}>{item.number}</Text>
              {item.description ? (
                <Text style={styles.emergencyDesc}>{item.description}</Text>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* נקודות עזרה */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>נקודות עזרה – מיקום ושירותים</Text>
        {helpPoints.map((point) => (
          <View key={point.id} style={styles.helpCard}>
            <View style={styles.helpHeader}>
              <View style={styles.helpTypeBadge}>
                <Ionicons
                  name={HELP_POINT_ICONS[point.type]}
                  size={16}
                  color={Colors.blue}
                />
                <Text style={styles.helpTypeText}>
                  {HELP_POINT_LABELS[point.type]}
                </Text>
              </View>
              {point.hours ? (
                <Text style={styles.helpHours}>{point.hours}</Text>
              ) : null}
            </View>
            <Text style={styles.helpName}>{point.name}</Text>
            <View style={styles.helpRow}>
              <Ionicons name="location-outline" size={16} color={Colors.mediumGray} />
              <Text style={styles.helpAddress}>{point.address}</Text>
            </View>
            {point.phone ? (
              <TouchableOpacity
                style={styles.helpPhoneRow}
                onPress={() => openPhone(point.phone!)}
              >
                <Ionicons name="call-outline" size={16} color={Colors.blue} />
                <Text style={styles.helpPhone}>{point.phone}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ))}
      </View>

      {/* הנחיות בזמן חירום */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>הנחיות בזמן חירום</Text>
        <Text style={styles.guidelinesIntro}>
          מרחבים מוגנים, התנהגות בשעת חירום ומידע מעודכן – פיקוד העורף
        </Text>
        <TouchableOpacity
          style={styles.guidelinesButton}
          onPress={openGuidelines}
          activeOpacity={0.8}
        >
          <Ionicons name="open-outline" size={22} color={Colors.white} />
          <Text style={styles.guidelinesButtonText}>להנחיות פיקוד העורף</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  padding: { paddingBottom: 24 },
  hero: {
    backgroundColor: Colors.blue,
    paddingVertical: 28,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  section: { padding: 16, paddingBottom: 8 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.black,
    marginBottom: 12,
  },
  emergencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emergencyCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  emergencyName: { fontSize: 15, fontWeight: '700', color: Colors.black },
  emergencyNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.error,
    marginTop: 6,
  },
  emergencyDesc: {
    fontSize: 11,
    color: Colors.mediumGray,
    marginTop: 4,
  },
  helpCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  helpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  helpTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.blueSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  helpTypeText: { fontSize: 12, fontWeight: '700', color: Colors.blue },
  helpHours: { fontSize: 11, color: Colors.mediumGray },
  helpName: { fontSize: 16, fontWeight: '800', color: Colors.black },
  helpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  helpAddress: { fontSize: 14, color: Colors.darkGray, flex: 1 },
  helpPhoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  helpPhone: { fontSize: 14, fontWeight: '600', color: Colors.blue },
  guidelinesIntro: {
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: 14,
  },
  guidelinesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
  },
  guidelinesButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.white,
  },
});
