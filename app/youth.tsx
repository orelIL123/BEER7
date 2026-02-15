import Colors from '@/constants/Colors';
import { youthTeams } from '@/constants/MockData';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function YouthScreen() {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Hero */}
            <View style={styles.hero}>
                <Ionicons name="trophy" size={48} color={Colors.white} />
                <Text style={styles.heroTitle}>מחלקת הנוער</Text>
                <Text style={styles.heroSubtitle}>פעילויות נוער וקהילה</Text>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
                <View style={styles.youthStat}>
                    <Text style={styles.youthStatValue}>{youthTeams.length}</Text>
                    <Text style={styles.youthStatLabel}>קבוצות</Text>
                </View>
                <View style={styles.youthStat}>
                    <Text style={styles.youthStatValue}>
                        {youthTeams.reduce((sum, t) => sum + t.players, 0)}
                    </Text>
                    <Text style={styles.youthStatLabel}>שחקנים</Text>
                </View>
                <View style={styles.youthStat}>
                    <Text style={styles.youthStatValue}>{youthTeams.length}</Text>
                    <Text style={styles.youthStatLabel}>מאמנים</Text>
                </View>
            </View>

            {/* Teams */}
            <View style={styles.teamsSection}>
                <Text style={styles.teamsTitle}>קבוצות הנוער</Text>
                {youthTeams.map((team) => (
                    <TouchableOpacity key={team.id} style={styles.teamCard}>
                        <View style={styles.teamHeader}>
                            <View style={styles.ageGroupBadge}>
                                <Text style={styles.ageGroupText}>{team.ageGroup}</Text>
                            </View>
                            <Text style={styles.teamName}>{team.name}</Text>
                        </View>
                        <View style={styles.teamDetails}>
                            <View style={styles.teamDetail}>
                                <Ionicons name="person-outline" size={16} color={Colors.mediumGray} />
                                <Text style={styles.teamDetailText}>מאמן: {team.coach}</Text>
                            </View>
                            <View style={styles.teamDetail}>
                                <Ionicons name="trophy-outline" size={16} color={Colors.mediumGray} />
                                <Text style={styles.teamDetailText}>{team.league}</Text>
                            </View>
                            <View style={styles.teamDetail}>
                                <Ionicons name="people-outline" size={16} color={Colors.mediumGray} />
                                <Text style={styles.teamDetailText}>{team.players} שחקנים</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* CTA */}
            <View style={styles.ctaSection}>
                <Text style={styles.ctaTitle}>רוצה להצטרף?</Text>
                <Text style={styles.ctaText}>פעילויות נוער בבאר שבע</Text>
                <TouchableOpacity style={styles.ctaButton}>
                    <Text style={styles.ctaButtonText}>צור קשר</Text>
                    <Ionicons name="call-outline" size={18} color={Colors.white} />
                </TouchableOpacity>
            </View>

            <View style={{ height: 30 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.offWhite,
    },
    hero: {
        backgroundColor: Colors.primary,
        paddingVertical: 40,
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.white,
        marginTop: 12,
    },
    heroSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 6,
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        marginHorizontal: 16,
        marginTop: -20,
        borderRadius: 16,
        padding: 16,
        elevation: 6,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
    },
    youthStat: {
        flex: 1,
        alignItems: 'center',
    },
    youthStatValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    youthStatLabel: {
        fontSize: 12,
        color: Colors.mediumGray,
        marginTop: 4,
    },
    teamsSection: {
        padding: 16,
        marginTop: 16,
    },
    teamsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: 16,
    },
    teamCard: {
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
    teamHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 10,
    },
    ageGroupBadge: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    ageGroupText: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    teamName: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.black,
    },
    teamDetails: {
        gap: 6,
    },
    teamDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    teamDetailText: {
        fontSize: 14,
        color: Colors.darkGray,
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
