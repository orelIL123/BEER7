import AppBackButton from '@/components/AppBackButton';
import Colors from '@/constants/Colors';
import { persons } from '@/constants/MockData';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PersonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const person = persons.find((p) => p.id === id);

  if (!person) {
    return (
      <View style={styles.errorContainer}>
        <AppBackButton />
        <Text style={styles.errorText}>לא נמצא</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <AppBackButton dark />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.padding}>
        <View style={styles.header}>
          <LinearGradient colors={Colors.premiumGradient as any} style={StyleSheet.absoluteFill} />
          <Image
            source={person.image === 'orel' ? require('@/assets/images/orel_aharon.png') : { uri: person.image }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <Text style={styles.name}>{person.name}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{person.role}</Text>
          </View>
        </View>
        <View style={styles.content}>
          <Text style={styles.bioTitle}>אודות</Text>
          <Text style={styles.bio}>{person.shortBio}</Text>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  padding: { paddingBottom: 24 },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  errorText: { fontSize: 16, color: Colors.mediumGray },
  header: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
    marginBottom: 16,
  },
  name: { fontSize: 28, fontWeight: '900', color: Colors.white, textAlign: 'center' },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  roleText: { fontSize: 14, fontWeight: '700', color: Colors.white },
  content: { padding: 24, backgroundColor: Colors.white, marginHorizontal: 20, borderRadius: 24, marginTop: -20, elevation: 4, shadowColor: Colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
  bioTitle: { fontSize: 18, fontWeight: '800', color: Colors.black, marginBottom: 12, textAlign: 'right' },
  bio: { fontSize: 16, color: Colors.darkGray, lineHeight: 26, textAlign: 'right' },
});
