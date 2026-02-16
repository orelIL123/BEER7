import AppBackButton from '@/components/AppBackButton';
import Colors from '@/constants/Colors';
import { sponsors } from '@/constants/MockData';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SponsorsScreen() {
    const platinumSponsors = sponsors.filter(s => s.tier === 'platinum');
    const goldSponsors = sponsors.filter(s => s.tier === 'gold');
    const silverSponsors = sponsors.filter(s => s.tier === 'silver');

    return (
        <View style={{ flex: 1 }}>
            <AppBackButton dark />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <View style={styles.hero}>
                    <Ionicons name="business" size={48} color={Colors.accent} />
                    <Text style={styles.heroTitle}>עסקים בבאר שבע</Text>
                    <Text style={styles.heroSubtitle}>גלו עסקים מקומיים ושותפים בעיר</Text>
                </View>

                {/* Platinum */}
                <View style={styles.tierSection}>
                    <View style={styles.tierHeader}>
                        <Text style={styles.tierTitle}>שותפים פלטינום</Text>
                        <View style={[styles.tierBadge, { backgroundColor: '#E5E7EB' }]}>
                            <Text style={[styles.tierBadgeText, { color: '#374151' }]}>⭐ פלטינום</Text>
                        </View>
                    </View>
                    {platinumSponsors.map((sponsor) => (
                        <TouchableOpacity key={sponsor.id} style={styles.sponsorCardLarge}>
                            <Image source={{ uri: sponsor.logo }} style={styles.sponsorLogoLarge} />
                            <Text style={styles.sponsorNameLarge}>{sponsor.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Gold */}
                <View style={styles.tierSection}>
                    <View style={styles.tierHeader}>
                        <Text style={styles.tierTitle}>שותפי זהב</Text>
                        <View style={[styles.tierBadge, { backgroundColor: '#FEF3C7' }]}>
                            <Text style={[styles.tierBadgeText, { color: '#92400E' }]}>🥇 זהב</Text>
                        </View>
                    </View>
                    <View style={styles.sponsorGrid}>
                        {goldSponsors.map((sponsor) => (
                            <TouchableOpacity key={sponsor.id} style={styles.sponsorCard}>
                                <Image source={{ uri: sponsor.logo }} style={styles.sponsorLogo} />
                                <Text style={styles.sponsorName}>{sponsor.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Silver */}
                <View style={styles.tierSection}>
                    <View style={styles.tierHeader}>
                        <Text style={styles.tierTitle}>שותפי כסף</Text>
                        <View style={[styles.tierBadge, { backgroundColor: '#F3F4F6' }]}>
                            <Text style={[styles.tierBadgeText, { color: '#6B7280' }]}>🥈 כסף</Text>
                        </View>
                    </View>
                    <View style={styles.sponsorGrid}>
                        {silverSponsors.map((sponsor) => (
                            <TouchableOpacity key={sponsor.id} style={styles.sponsorCard}>
                                <Image source={{ uri: sponsor.logo }} style={styles.sponsorLogo} />
                                <Text style={styles.sponsorName}>{sponsor.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* CTA */}
                <View style={styles.ctaSection}>
                    <Text style={styles.ctaTitle}>רוצה להיות שותף?</Text>
                    <Text style={styles.ctaText}>הצטרפו לאפליקציית באר שבע ופרסמו את העסק שלכם לתושבי העיר</Text>
                    <TouchableOpacity style={styles.ctaButton}>
                        <Ionicons name="mail-outline" size={18} color={Colors.secondary} />
                        <Text style={styles.ctaButtonText}>צרו קשר</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.offWhite,
    },
    hero: {
        backgroundColor: Colors.primary,
        paddingVertical: 36,
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: Colors.white,
        marginTop: 10,
    },
    heroSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 6,
    },
    tierSection: {
        padding: 16,
    },
    tierHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    tierTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.black,
    },
    tierBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    tierBadgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    sponsorCardLarge: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        alignItems: 'center',
        elevation: 4,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    sponsorLogoLarge: {
        width: 200,
        height: 80,
        borderRadius: 8,
        marginBottom: 10,
    },
    sponsorNameLarge: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.black,
    },
    sponsorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    sponsorCard: {
        width: '47%',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 14,
        alignItems: 'center',
        elevation: 3,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },
    sponsorLogo: {
        width: 120,
        height: 50,
        borderRadius: 6,
        marginBottom: 8,
    },
    sponsorName: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.darkGray,
        textAlign: 'center',
    },
    ctaSection: {
        margin: 16,
        backgroundColor: Colors.secondary,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
    },
    ctaTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.white,
        marginBottom: 8,
    },
    ctaText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
        marginBottom: 16,
    },
    ctaButton: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        gap: 8,
    },
    ctaButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.secondary,
    },
});
