import Colors from '@/constants/Colors';
import { cityInfo } from '@/constants/MockData';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DonateScreen() {
  const handleContact = (url: string) => {
    Linking.canOpenURL(url).then((ok) => ok && Linking.openURL(url));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Ionicons name="mail" size={56} color={Colors.white} />
        <Text style={styles.heroTitle}>צור קשר</Text>
        <Text style={styles.heroSubtitle}>נשמח לשמוע מכם – לאפליקציית באר שבע</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>דרכי התקשרות</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => handleContact(cityInfo.socialMedia.facebook)}
          >
            <View style={[styles.iconBox, { backgroundColor: '#1877F220' }]}>
              <Ionicons name="logo-facebook" size={24} color="#1877F2" />
            </View>
            <Text style={styles.rowLabel}>פייסבוק</Text>
            <Ionicons name="chevron-back" size={20} color={Colors.mediumGray} />
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity
            style={styles.row}
            onPress={() => handleContact(cityInfo.socialMedia.instagram)}
          >
            <View style={[styles.iconBox, { backgroundColor: '#E4405F20' }]}>
              <Ionicons name="logo-instagram" size={24} color="#E4405F" />
            </View>
            <Text style={styles.rowLabel}>אינסטגרם</Text>
            <Ionicons name="chevron-back" size={20} color={Colors.mediumGray} />
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity
            style={styles.row}
            onPress={() => handleContact(cityInfo.website)}
          >
            <View style={[styles.iconBox, { backgroundColor: Colors.primary + '20' }]}>
              <Ionicons name="globe-outline" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.rowLabel}>אתר העיר</Text>
            <Ionicons name="chevron-back" size={20} color={Colors.mediumGray} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>אפליקציית באר שבע – כל מה שקורה בעיר</Text>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  hero: {
    backgroundColor: Colors.primary,
    paddingVertical: 40,
    alignItems: 'center',
  },
  heroTitle: { fontSize: 26, fontWeight: 'bold', color: Colors.white, marginTop: 12 },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 6, textAlign: 'center' },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.black, marginBottom: 14 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: Colors.black },
  separator: { height: 1, backgroundColor: Colors.lightGray, marginHorizontal: 16 },
  footer: { alignItems: 'center', marginTop: 24, paddingHorizontal: 20 },
  footerText: { fontSize: 13, color: Colors.mediumGray, textAlign: 'center' },
});
