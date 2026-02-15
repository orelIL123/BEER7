import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RealEstateScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.padding}>
      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={styles.heroIconWrap}><Ionicons name="home" size={44} color={Colors.white} /></View>
        <Text style={styles.heroTitle}>נדלן</Text>
        <Text style={styles.heroSubtitle}>נכסים בבאר שבע – להשכרה ומכירה</Text>
      </LinearGradient>
      <View style={styles.noteCard}>
        <Ionicons name="information-circle" size={24} color={Colors.primary} />
        <Text style={styles.noteText}>פרסום נכסים כרוך בתשלום. לפרטים – צרו קשר.</Text>
      </View>
      <View style={styles.comingSoon}>
        <View style={styles.comingSoonIconWrap}><Ionicons name="images-outline" size={56} color={Colors.primaryDark} /></View>
        <Text style={styles.comingSoonTitle}>בקרוב אצלכם</Text>
        <Text style={styles.comingSoonSub}>כאן יופיעו נכסים – תמונות, פרטים ואפשרות לסרטון.</Text>
        <View style={styles.badge}><Text style={styles.badgeText}>בקרוב מחברים בק הנד!</Text></View>
      </View>
      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  padding: { paddingBottom: 24 },
  hero: { paddingVertical: 32, paddingHorizontal: 24, alignItems: 'center' },
  heroIconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  heroTitle: { fontSize: 28, fontWeight: '900', color: Colors.white },
  heroSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.9)', marginTop: 6 },
  noteCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary + '14', marginHorizontal: 16, marginTop: 20, padding: 16, borderRadius: 16, gap: 12, borderWidth: 1, borderColor: Colors.primary + '30' },
  noteText: { flex: 1, fontSize: 14, color: Colors.darkGray, lineHeight: 22 },
  comingSoon: { marginHorizontal: 16, marginTop: 28, padding: 28, backgroundColor: Colors.white, borderRadius: 24, alignItems: 'center', borderWidth: 1, borderColor: Colors.lightGray },
  comingSoonIconWrap: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.primaryDark + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  comingSoonTitle: { fontSize: 22, fontWeight: '800', color: Colors.black, marginBottom: 8 },
  comingSoonSub: { fontSize: 15, color: Colors.mediumGray, textAlign: 'center', lineHeight: 24, marginBottom: 20 },
  badge: { backgroundColor: Colors.primaryDark + '20', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20 },
  badgeText: { fontSize: 14, fontWeight: '800', color: Colors.primaryDark },
});
