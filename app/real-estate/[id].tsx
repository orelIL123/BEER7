import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RealEstateDetailScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'פרטי נכס', headerBackTitle: 'חזרה', headerTintColor: Colors.primary }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.placeholderBlock}>
          <View style={styles.placeholderIconWrap}><Ionicons name="images" size={48} color={Colors.mediumGray} /></View>
          <Text style={styles.placeholderLabel}>תמונות הנכס</Text>
          <Text style={styles.placeholderHint}>בקרוב – גלריית תמונות</Text>
        </View>
        <View style={styles.placeholderBlock}>
          <View style={styles.placeholderIconWrap}><Ionicons name="videocam" size={48} color={Colors.mediumGray} /></View>
          <Text style={styles.placeholderLabel}>סרטון</Text>
          <Text style={styles.placeholderHint}>אופציה לסרטון – מחובר בקרוב</Text>
        </View>
        <View style={styles.footer}><Text style={styles.footerText}>תכין את השטח – בקרוב מחברים בק הנד!</Text></View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  content: { padding: 20, paddingBottom: 40 },
  placeholderBlock: { backgroundColor: Colors.white, borderRadius: 20, padding: 28, marginBottom: 16, alignItems: 'center', borderWidth: 1, borderColor: Colors.lightGray },
  placeholderIconWrap: { width: 88, height: 88, borderRadius: 16, backgroundColor: Colors.offWhite, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  placeholderLabel: { fontSize: 18, fontWeight: '800', color: Colors.black, marginBottom: 4 },
  placeholderHint: { fontSize: 14, color: Colors.mediumGray },
  footer: { marginTop: 24, padding: 16, backgroundColor: Colors.primaryDark + '12', borderRadius: 16, alignItems: 'center' },
  footerText: { fontSize: 15, fontWeight: '700', color: Colors.primaryDark },
});
