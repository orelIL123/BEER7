import Colors from '@/constants/Colors';
import { players } from '@/constants/MockData';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function PlayerDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const player = players.find(p => p.id === id);

    if (!player) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>השחקן לא נמצא</Text>
            </View>
        );
    }

    const getPositionColor = (pos: string) => {
        const colors: Record<string, string> = {
            'GK': '#F59E0B',
            'DEF': '#3B82F6',
            'MID': '#10B981',
            'FWD': '#EF4444',
        };
        return colors[pos] || Colors.primary;
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
            <Stack.Screen options={{
                headerTransparent: true,
                headerTitle: '',
                headerTintColor: Colors.white,
                headerStyle: { backgroundColor: 'transparent' },
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                        <Ionicons name="chevron-forward" size={24} color={Colors.white} />
                    </TouchableOpacity>
                ),
            }} />

            {/* Premium Header */}
            <View style={styles.header}>
                <LinearGradient
                    colors={Colors.premiumGradient as any}
                    style={StyleSheet.absoluteFill}
                />
                <View style={styles.headerBgContent}>
                    <Text style={styles.giantNumber}>{player.number}</Text>
                    <View style={styles.orbWrapper}>
                        <Image source={{ uri: player.image }} style={styles.playerImage} />
                        <View style={[styles.positionOrb, { backgroundColor: getPositionColor(player.positionEn) }]}>
                            <Text style={styles.positionOrbText}>{player.positionEn}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    <View style={styles.tagsRow}>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>{player.position}</Text>
                        </View>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>{player.age} שנים</Text>
                        </View>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>{player.nationality}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Main Content */}
            <View style={styles.contentCard}>
                {/* Stats Grid */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>סטטיסטיקות עונה</Text>
                    <View style={styles.statsGrid}>
                        <StatItem
                            icon="person-sharp"
                            label="שערים"
                            value={player.goals}
                            color={Colors.primary}
                        />
                        <StatItem
                            icon="hand-left-sharp"
                            label="בישולים"
                            value={player.assists}
                            color={Colors.secondary}
                        />
                        <StatItem
                            icon="calendar-sharp"
                            label="הופעות"
                            value={player.appearances}
                            color={Colors.success}
                        />
                        <StatItem
                            icon="star-sharp"
                            label="ציון"
                            value={7.4}
                            color={Colors.accent}
                        />
                    </View>
                </View>

                {/* Performance Chart */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>מדד ביצועים</Text>
                    <View style={styles.chartBox}>
                        <View style={styles.barsArea}>
                            {[5, 7, 4, 9, 6, 8, 10, 7, 9, 8].map((v, i) => (
                                <View key={i} style={styles.barContainer}>
                                    <LinearGradient
                                        colors={[Colors.primary, Colors.primary + '80']}
                                        style={[styles.bar, { height: v * 12 }]}
                                    />
                                    <Text style={styles.barLabel}>{i + 1}</Text>
                                </View>
                            ))}
                        </View>
                        <Text style={styles.chartHint}>ציון ממוצע ב-10 המשחקים האחרונים</Text>
                    </View>
                </View>

                {/* Bio */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>אודות</Text>
                    <View style={styles.bioBox}>
                        <Text style={styles.bioText}>
                            {player.name} – פרופיל.
                            השחקן מפגין רמה גבוהה בכל משחק ותורם רבות לרוח הלחימה הקבוצתית.
                            בעל יצירתיות גבוהה ויכולת סיום מצוינת מול השער.
                        </Text>
                    </View>
                </View>
            </View>

            <View style={{ height: 60 }} />
        </ScrollView>
    );
}

function StatItem({ icon, label, value, color }: { icon: any; label: string; value: number | string; color: string }) {
    return (
        <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: color + '10' }]}>
                <Ionicons name={icon} size={20} color={color} />
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    scrollPadding: {
        paddingBottom: 40,
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        fontSize: 16,
        color: Colors.mediumGray,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16,
        marginTop: Platform.OS === 'ios' ? 0 : 10,
    },
    header: {
        height: 380,
        paddingTop: 80,
    },
    headerBgContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    giantNumber: {
        position: 'absolute',
        top: 20,
        right: 40,
        fontSize: 180,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.08)',
    },
    orbWrapper: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 5,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
        position: 'relative',
    },
    playerImage: {
        width: '100%',
        height: '100%',
        borderRadius: 85,
    },
    positionOrb: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: Colors.white,
    },
    positionOrbText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: '900',
    },
    headerTitleContainer: {
        alignItems: 'center',
        paddingBottom: 30,
    },
    playerName: {
        fontSize: 32,
        fontWeight: '900',
        color: Colors.white,
        marginBottom: 8,
    },
    tagsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    tag: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    tagText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: '700',
    },
    contentCard: {
        marginTop: -40,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: Colors.black,
        marginBottom: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    statCard: {
        width: (width - 60) / 2,
        backgroundColor: Colors.offWhite,
        borderRadius: 24,
        padding: 16,
        alignItems: 'center',
    },
    statIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '900',
        color: Colors.black,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.mediumGray,
    },
    chartBox: {
        backgroundColor: Colors.offWhite,
        borderRadius: 24,
        padding: 20,
    },
    barsArea: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 140,
        paddingBottom: 10,
    },
    barContainer: {
        alignItems: 'center',
    },
    bar: {
        width: 14,
        borderRadius: 7,
    },
    barLabel: {
        fontSize: 9,
        fontWeight: '700',
        color: Colors.lightGray,
        marginTop: 6,
    },
    chartHint: {
        textAlign: 'center',
        fontSize: 11,
        fontWeight: '600',
        color: Colors.mediumGray,
        marginTop: 10,
    },
    bioBox: {
        backgroundColor: Colors.offWhite,
        borderRadius: 24,
        padding: 20,
    },
    bioText: {
        fontSize: 15,
        lineHeight: 24,
        color: Colors.darkGray,
        fontWeight: '600',
    },
});
