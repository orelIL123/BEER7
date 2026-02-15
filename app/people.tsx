import Colors from '@/constants/Colors';
import { persons } from '@/constants/MockData';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PeopleScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.padding}>
      <View style={styles.hero}>
        <Ionicons name="people" size={48} color={Colors.accent} />
        <Text style={styles.heroTitle}>אישים בבאר שבע</Text>
        <Text style={styles.heroSubtitle}>אנשי העיר והקהילה</Text>
      </View>
      <View style={styles.list}>
        {persons.map((person) => (
          <TouchableOpacity
            key={person.id}
            style={styles.card}
            onPress={() => router.push(`/person/${person.id}` as any)}
            activeOpacity={0.8}
          >
            <Image
              source={person.image === 'orel' ? require('@/assets/images/orel_aharon.png') : { uri: person.image }}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View style={styles.info}>
              <Text style={styles.name}>{person.name}</Text>
              <Text style={styles.role}>{person.role}</Text>
              <Text style={styles.bio} numberOfLines={2}>{person.shortBio}</Text>
            </View>
            <Ionicons name="chevron-back" size={22} color={Colors.mediumGray} />
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
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
  list: { padding: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.lightGray },
  info: { flex: 1, marginHorizontal: 16 },
  name: { fontSize: 18, fontWeight: '800', color: Colors.black },
  role: { fontSize: 13, color: Colors.primary, fontWeight: '600', marginTop: 2 },
  bio: { fontSize: 12, color: Colors.mediumGray, marginTop: 4 },
});
