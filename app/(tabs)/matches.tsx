import Colors from '@/constants/Colors';
import { matches, standings } from '@/constants/MockData';
import { Ionicons } from '@expo/vector-icons';
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

type TabType = 'fixtures' | 'results' | 'standings';

export default function MatchesScreen() {
    const [activeTab, setActiveTab] = useState<TabType>('fixtures');

    const upcomingMatches = matches.filter(m => m.status === 'upcoming');
    const completedMatches = matches.filter(m => m.status === 'completed');

    return (
        <View style={styles.container}>
            {/* 2026 Segmented Tab Bar */}
            <View style={styles.segmentedControlOuter}>
                <View style={styles.segmentedControlInner}>
                    {[
                        { key: 'fixtures' as TabType, label: 'לו"ז' },
                        { key: 'results' as TabType, label: 'תוצאות' },
                        { key: 'standings' as TabType, label: 'טבלה' },
                    ].map((tab) => (
                        <TouchableOpacity
                            key={tab.key}
                            style={[
                                styles.segmentButton,
                                activeTab === tab.key && styles.segmentButtonActive
                            ]}
                            onPress={() => setActiveTab(tab.key)}
                        >
                            <Text style={[
                                styles.segmentText,
                                activeTab === tab.key && styles.segmentTextActive
                            ]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
                {activeTab === 'fixtures' && (
                    <View style={styles.content}>
                        <Text style={styles.contentTitle}>משחקים קרובים</Text>
                        {upcomingMatches.map((match) => (
                            <MatchCard key={match.id} match={match} />
                        ))}
                        {upcomingMatches.length === 0 && (
                            <View style={styles.emptyState}>
                                <Ionicons name="calendar-outline" size={48} color={Colors.mediumGray} />
                                <Text style={styles.emptyText}>אין משחקים קרובים</Text>
                            </View>
                        )}
                    </View>
                )}

                {activeTab === 'results' && (
                    <View style={styles.content}>
                        <Text style={styles.contentTitle}>תוצאות אחרונות</Text>
                        {completedMatches.map((match) => (
                            <MatchCard key={match.id} match={match} />
                        ))}
                    </View>
                )}

                {activeTab === 'standings' && (
                    <View style={styles.content}>
                        <Text style={styles.contentTitle}>טבלת הליגה</Text>
                        <View style={styles.standingsContainer}>
                            {/* Header */}
                            <View style={styles.standingsHeader}>
                                <Text style={[styles.standingsHeaderText, { width: 30 }]}>#</Text>
                                <Text style={[styles.standingsHeaderText, { flex: 1, textAlign: 'right' }]}>קבוצה</Text>
                                <Text style={[styles.standingsHeaderText, styles.standingsCell]}>מש</Text>
                                <Text style={[styles.standingsHeaderText, styles.standingsCell]}>נצ</Text>
                                <Text style={[styles.standingsHeaderText, styles.standingsCellWide]}>נק</Text>
                            </View>
                            {/* Rows */}
                            {standings.map((team, index) => (
                                <View
                                    key={team.position}
                                    style={[
                                        styles.standingsRow,
                                        team.isSderot && styles.standingsRowHighlight,
                                        index % 2 === 0 && !team.isSderot && styles.standingsRowAlt,
                                    ]}
                                >
                                    <Text style={[styles.standingsPos, team.isSderot && styles.highlightText]}>
                                        {team.position}
                                    </Text>
                                    <Text
                                        style={[styles.standingsTeam, team.isSderot && styles.highlightText]}
                                        numberOfLines={1}
                                    >
                                        {team.team}
                                    </Text>
                                    <Text style={[styles.standingsCellText, team.isSderot && styles.highlightText]}>
                                        {team.played}
                                    </Text>
                                    <Text style={[styles.standingsCellText, team.isSderot && styles.highlightText]}>
                                        {team.won}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.standingsPoints,
                                            team.isSderot && styles.highlightPointsText,
                                        ]}
                                    >
                                        {team.points}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

function MatchCard({ match }: { match: typeof matches[0] }) {
    const isSderotHome = match.homeTeam.includes('שדרות');
    const isCompleted = match.status === 'completed';

    function formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        const day = date.getDate();
        const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
        return `${day} ב${months[date.getMonth()]}`;
    }

    const getResult = () => {
        if (!isCompleted || match.homeScore === undefined || match.awayScore === undefined) return null;
        const sderotScore = isSderotHome ? match.homeScore : match.awayScore;
        const opponentScore = isSderotHome ? match.awayScore : match.homeScore;
        if (sderotScore > opponentScore) return 'win';
        if (sderotScore < opponentScore) return 'loss';
        return 'draw';
    };

    const result = getResult();

    return (
        <TouchableOpacity style={styles.matchCard}>
            <View style={styles.matchCardInner}>
                <View style={styles.matchHeader}>
                    <Text style={styles.leagueLabel}>{match.league}</Text>
                    <View style={styles.dateBadge}>
                        <Text style={styles.dateText}>{formatDate(match.date)}</Text>
                    </View>
                </View>

                <View style={styles.matchMain}>
                    <View style={styles.teamSide}>
                        <View style={styles.teamLogoOrb}>
                            {match.homeTeam.includes('שדרות') ? (
                                <Image
                                    source={require('@/assets/images/logo.png')}
                                    style={styles.teamLogoSmall}
                                    resizeMode="contain"
                                />
                            ) : (
                                <Text style={styles.orbEmoji}>🏡</Text>
                            )}
                        </View>
                        <Text style={[styles.teamName, isSderotHome && styles.sderotText]} numberOfLines={2}>
                            {match.homeTeam}
                        </Text>
                    </View>

                    <View style={styles.scoreContainer}>
                        {isCompleted ? (
                            <View style={styles.scoreDisplay}>
                                <Text style={styles.scoreNumber}>{match.homeScore}</Text>
                                <Text style={styles.scoreDash}>:</Text>
                                <Text style={styles.scoreNumber}>{match.awayScore}</Text>
                            </View>
                        ) : (
                            <View style={styles.timeDisplay}>
                                <Text style={styles.timeText}>{match.time}</Text>
                                <Text style={styles.vsLabel}>VS</Text>
                            </View>
                        )}
                        {result && (
                            <View style={[
                                styles.resultBadge,
                                result === 'win' && { backgroundColor: Colors.success },
                                result === 'loss' && { backgroundColor: Colors.error },
                                result === 'draw' && { backgroundColor: Colors.warning },
                            ]}>
                                <Text style={styles.resultBadgeText}>
                                    {result === 'win' ? 'ניצחון' : result === 'loss' ? 'הפסד' : 'תיקו'}
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.teamSide}>
                        <View style={styles.teamLogoOrb}>
                            {match.awayTeam.includes('שדרות') ? (
                                <Image
                                    source={require('@/assets/images/logo.png')}
                                    style={styles.teamLogoSmall}
                                    resizeMode="contain"
                                />
                            ) : (
                                <Text style={styles.orbEmoji}>🏃</Text>
                            )}
                        </View>
                        <Text style={[styles.teamName, !isSderotHome && styles.sderotText]} numberOfLines={2}>
                            {match.awayTeam}
                        </Text>
                    </View>
                </View>

                <View style={styles.matchFooter}>
                    <Ionicons name="location-sharp" size={14} color={Colors.primary} />
                    <Text style={styles.venueText}>{match.venue}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    scrollPadding: {
        paddingTop: 16,
    },
    segmentedControlOuter: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: Colors.white,
    },
    segmentedControlInner: {
        flexDirection: 'row',
        backgroundColor: Colors.offWhite,
        borderRadius: 16,
        padding: 4,
    },
    segmentButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 12,
    },
    segmentButtonActive: {
        backgroundColor: Colors.white,
        elevation: 4,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    segmentText: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.mediumGray,
    },
    segmentTextActive: {
        color: Colors.primary,
    },
    content: {
        padding: 20,
    },
    contentTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: Colors.black,
        marginBottom: 20,
        letterSpacing: -0.5,
    },
    matchCard: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        marginBottom: 20,
        elevation: 8,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        borderWidth: 1,
        borderColor: Colors.lightGray,
    },
    matchCardInner: {
        padding: 20,
    },
    matchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    leagueLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: Colors.primary,
        textTransform: 'uppercase',
    },
    dateBadge: {
        backgroundColor: Colors.offWhite,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    dateText: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.darkGray,
    },
    matchMain: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    teamSide: {
        flex: 1.2,
        alignItems: 'center',
    },
    teamLogoOrb: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.offWhite,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    orbEmoji: {
        fontSize: 24,
    },
    teamLogoSmall: {
        width: 80,
        height: 80,
    },
    teamName: {
        fontSize: 14,
        fontWeight: '800',
        color: Colors.black,
        textAlign: 'center',
    },
    sderotText: {
        color: Colors.primary,
    },
    scoreContainer: {
        flex: 1,
        alignItems: 'center',
    },
    scoreDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    scoreNumber: {
        fontSize: 32,
        fontWeight: '900',
        color: Colors.black,
    },
    scoreDash: {
        fontSize: 24,
        fontWeight: '900',
        color: Colors.mediumGray,
    },
    timeDisplay: {
        alignItems: 'center',
    },
    timeText: {
        fontSize: 24,
        fontWeight: '900',
        color: Colors.primary,
    },
    vsLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.mediumGray,
    },
    resultBadge: {
        marginTop: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    resultBadgeText: {
        fontSize: 11,
        fontWeight: '800',
        color: Colors.white,
    },
    matchFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        gap: 6,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.lightGray,
    },
    venueText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.mediumGray,
    },
    standingsContainer: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.lightGray,
        elevation: 10,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
    },
    standingsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    standingsHeaderText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: '800',
        textAlign: 'center',
    },
    standingsCell: {
        width: 32,
    },
    standingsCellWide: {
        width: 40,
    },
    standingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    standingsRowAlt: {
        backgroundColor: Colors.offWhite + '50',
    },
    standingsRowHighlight: {
        backgroundColor: Colors.primary + '15',
    },
    standingsPos: {
        width: 30,
        fontSize: 14,
        fontWeight: '900',
        color: Colors.darkGray,
        textAlign: 'center',
    },
    standingsTeam: {
        flex: 1,
        fontSize: 14,
        fontWeight: '800',
        color: Colors.black,
        textAlign: 'right',
        marginRight: 8,
    },
    standingsCellText: {
        width: 32,
        fontSize: 14,
        fontWeight: '700',
        color: Colors.darkGray,
        textAlign: 'center',
    },
    standingsPoints: {
        width: 40,
        fontSize: 16,
        fontWeight: '900',
        color: Colors.primary,
        textAlign: 'center',
    },
    highlightText: {
        color: Colors.primary,
    },
    highlightPointsText: {
        color: Colors.primary,
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

