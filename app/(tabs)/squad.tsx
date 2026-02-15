import Colors from '@/constants/Colors';
import { players } from '@/constants/MockData';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const CARD_WIDTH = (width - 40 - (COLUMN_COUNT - 1) * 16) / COLUMN_COUNT;

type PositionFilter = 'all' | 'GK' | 'DEF' | 'MID' | 'FWD';

const filters: { key: PositionFilter; label: string }[] = [
    { key: 'all', label: 'הכל' },
    { key: 'GK', label: 'שוערים' },
    { key: 'DEF', label: 'הגנה' },
    { key: 'MID', label: 'קישור' },
    { key: 'FWD', label: 'התקפה' },
];

export default function SquadScreen() {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState<PositionFilter>('all');

    const filteredPlayers = activeFilter === 'all'
        ? players
        : players.filter(p => p.positionEn === activeFilter);

    return (
        <View style={styles.container}>
            {/* Filter Section */}
            <View style={styles.filterSection}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScroll}
                >
                    {filters.map((f) => (
                        <TouchableOpacity
                            key={f.key}
                            style={[
                                styles.filterChip,
                                activeFilter === f.key && styles.filterChipActive
                            ]}
                            onPress={() => setActiveFilter(f.key)}
                        >
                            <Text style={[
                                styles.filterText,
                                activeFilter === f.key && styles.filterTextActive
                            ]}>
                                {f.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
                <View style={styles.grid}>
                    {filteredPlayers.map((player) => (
                        <TouchableOpacity
                            key={player.id}
                            style={styles.playerCard}
                            onPress={() => router.push(`/player/${player.id}` as any)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.imageWrapper}>
                                <Image source={{ uri: player.image }} style={styles.playerImage} />
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                                    style={styles.imageBottomGradient}
                                />
                                <View style={styles.numberBadge}>
                                    <Text style={styles.numberText}>{player.number}</Text>
                                </View>
                            </View>
                            <View style={styles.playerMeta}>
                                <Text style={styles.playerName} numberOfLines={1}>{player.name}</Text>
                                <View style={styles.positionTag}>
                                    <Text style={styles.positionText}>{player.position}</Text>
                                </View>
                                <View style={styles.miniStatsRow}>
                                    <View style={styles.statDot}>
                                        <Text style={styles.statValue}>{player.goals}</Text>
                                        <Text style={styles.statLabel}>שערים</Text>
                                    </View>
                                    <View style={styles.statDivider} />
                                    <View style={styles.statDot}>
                                        <Text style={styles.statValue}>{player.appearances}</Text>
                                        <Text style={styles.statLabel}>הופ'</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {filteredPlayers.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="people-outline" size={64} color={Colors.lightGray} />
                        <Text style={styles.emptyText}>אין שחקנים בקטגוריה זו</Text>
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    filterSection: {
        backgroundColor: Colors.white,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.offWhite,
    },
    filterScroll: {
        paddingHorizontal: 20,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.offWhite,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterChipActive: {
        backgroundColor: Colors.primary + '10',
        borderColor: Colors.primary,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.mediumGray,
    },
    filterTextActive: {
        color: Colors.primary,
    },
    scrollPadding: {
        paddingTop: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    playerCard: {
        width: CARD_WIDTH,
        backgroundColor: Colors.white,
        borderRadius: 28,
        marginBottom: 20,
        elevation: 10,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        borderWidth: 1,
        borderColor: Colors.offWhite,
        overflow: 'hidden',
    },
    imageWrapper: {
        height: CARD_WIDTH * 1.2,
        position: 'relative',
        backgroundColor: Colors.offWhite,
    },
    playerImage: {
        width: '100%',
        height: '100%',
    },
    imageBottomGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
    },
    numberBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: Colors.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    numberText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '900',
    },
    playerMeta: {
        padding: 12,
        alignItems: 'center',
    },
    playerName: {
        fontSize: 15,
        fontWeight: '900',
        color: Colors.black,
        marginBottom: 6,
    },
    positionTag: {
        backgroundColor: Colors.offWhite,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginBottom: 10,
    },
    positionText: {
        fontSize: 11,
        fontWeight: '800',
        color: Colors.mediumGray,
    },
    miniStatsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
        width: '100%',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: Colors.offWhite,
    },
    statDot: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 14,
        fontWeight: '900',
        color: Colors.primary,
    },
    statLabel: {
        fontSize: 9,
        fontWeight: '700',
        color: Colors.mediumGray,
    },
    statDivider: {
        width: 1,
        height: 16,
        backgroundColor: Colors.offWhite,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.mediumGray,
        marginTop: 16,
    },
});

