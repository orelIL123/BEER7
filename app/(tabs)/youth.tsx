import Colors from '@/constants/Colors';
import { useApprovedArticles } from '@/hooks/useApprovedArticles';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
type TabType = 'news' | 'teams' | 'matches';

const teams = [
    { id: 'u19', name: 'נוער' },
    { id: 'u17', name: 'נערים א' },
    { id: 'u16', name: 'נערים ב' },
    { id: 'u15', name: 'נערים ג' },
    { id: 'u14', name: 'ילדים א' },
    { id: 'u12', name: 'ילדים ג' },
];

const youthMatches: Record<string, any[]> = {
    'u19': [
        { id: '1', opponent: 'מכבי ת"א', date: '2026-02-14', score: 'Upcoming', status: 'upcoming' },
        { id: '2', opponent: 'הפועל ב"ש', date: '2026-02-07', score: '2-1', status: 'completed' },
    ],
    'u17': [
        { id: '1', opponent: 'בית"ר ירושלים', date: '2026-02-15', score: 'Upcoming', status: 'upcoming' },
        { id: '2', opponent: 'מכבי חיפה', date: '2026-02-08', score: '0-0', status: 'completed' },
    ],
    // Default mock data for others
    'default': [
        { id: '1', opponent: 'הפועל אשדוד', date: '2026-02-16', score: 'Upcoming', status: 'upcoming' },
        { id: '2', opponent: 'מכבי באר שבע', date: '2026-02-09', score: '3-1', status: 'completed' },
    ]
};

const staffData: Record<string, { coach: string; assistant: string }> = {
    'u19': { coach: 'אבי לוי', assistant: 'מאור כהן' },
    'u17': { coach: 'יוסי מזרחי', assistant: 'דניאל אברהם' },
    'u16': { coach: 'רועי גבאי', assistant: 'שחר נאור' },
    'u15': { coach: 'איתי לוי', assistant: 'עמית כהן' },
    'u14': { coach: 'ניר דוד', assistant: 'גל אביב' },
    'u12': { coach: 'דורון משה', assistant: 'חיים אוחנה' },
};

export default function YouthScreen() {
    const router = useRouter();
    const { articles: newsArticles } = useApprovedArticles();
    const [activeTab, setActiveTab] = useState<TabType>('news');
    const [activeTeamId, setActiveTeamId] = useState('u19');

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [activeTab, activeTeamId]);

    const handleTabChange = (tab: TabType) => {
        fadeAnim.setValue(0);
        setActiveTab(tab);
    };

    const handleTeamChange = (teamId: string) => {
        fadeAnim.setValue(0);
        setActiveTeamId(teamId);
    };

    const youthNews = newsArticles.filter(a => a.category === 'community' || a.category === 'culture');
    const currentStaff = staffData[activeTeamId];
    const currentMatches = youthMatches[activeTeamId] || youthMatches['default'];

    function formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <LinearGradient
                    colors={Colors.vibrantGradient as any}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>מחלקת הנוער</Text>
                    <Text style={styles.headerSubtitle}>באר שבע</Text>
                </View>
            </View>

            <View style={styles.tabBarContainer}>
                <View style={styles.tabBar}>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'news' && styles.tabButtonActive]}
                        onPress={() => handleTabChange('news')}
                    >
                        <Text style={[styles.tabText, activeTab === 'news' && styles.tabTextActive]}>כתבות</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'teams' && styles.tabButtonActive]}
                        onPress={() => handleTabChange('teams')}
                    >
                        <Text style={[styles.tabText, activeTab === 'teams' && styles.tabTextActive]}>קבוצות</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'matches' && styles.tabButtonActive]}
                        onPress={() => handleTabChange('matches')}
                    >
                        <Text style={[styles.tabText, activeTab === 'matches' && styles.tabTextActive]}>משחקים</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
                <Animated.View style={{ opacity: fadeAnim }}>
                    {activeTab === 'news' && (
                        <View style={styles.section}>
                            {youthNews.map((article) => (
                                <TouchableOpacity
                                    key={article.id}
                                    style={styles.articleCard}
                                    onPress={() => router.push(`/news/${article.id}` as any)}
                                >
                                    <Image source={{ uri: article.image }} style={styles.articleImage} />
                                    <View style={styles.articleInfo}>
                                        <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
                                        <View style={styles.articleFooter}>
                                            <Text style={styles.articleDate}>{formatDate(article.date)}</Text>
                                            <Ionicons name="arrow-back" size={14} color={Colors.mediumGray} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                            {youthNews.length === 0 && (
                                <View style={styles.emptyState}>
                                    <Ionicons name="newspaper-outline" size={48} color={Colors.lightGray} />
                                    <Text style={styles.emptyText}>אין כתבות נוער כרגע</Text>
                                </View>
                            )}
                        </View>
                    )}

                    {activeTab === 'teams' && (
                        <View>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.teamsSelector}
                                contentContainerStyle={styles.teamsSelectorContent}
                            >
                                {teams.map((team) => (
                                    <TouchableOpacity
                                        key={team.id}
                                        style={[
                                            styles.teamChip,
                                            activeTeamId === team.id && styles.teamChipActive
                                        ]}
                                        onPress={() => handleTeamChange(team.id)}
                                    >
                                        <Text style={[
                                            styles.teamChipText,
                                            activeTeamId === team.id && styles.teamChipTextActive
                                        ]}>
                                            {team.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <View style={styles.staffHeader}>
                                <Text style={styles.staffTitle}>צוות מקצועי - {teams.find(t => t.id === activeTeamId)?.name}</Text>
                            </View>

                            <View style={styles.staffContainer}>
                                <View style={styles.staffCard}>
                                    <View style={styles.staffImageWrapper}>
                                        <Image
                                            source={{ uri: `https://i.pravatar.cc/300?u=${activeTeamId}-coach` }}
                                            style={styles.staffImage}
                                        />
                                        <LinearGradient
                                            colors={['transparent', 'rgba(0,0,0,0.7)']}
                                            style={styles.staffImageGradient}
                                        />
                                        <View style={styles.staffBadge}>
                                            <Text style={styles.staffBadgeText}>מאמן</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.staffName}>{currentStaff.coach}</Text>
                                </View>

                                <View style={styles.staffCard}>
                                    <View style={styles.staffImageWrapper}>
                                        <Image
                                            source={{ uri: `https://i.pravatar.cc/300?u=${activeTeamId}-assistant` }}
                                            style={styles.staffImage}
                                        />
                                        <LinearGradient
                                            colors={['transparent', 'rgba(0,0,0,0.7)']}
                                            style={styles.staffImageGradient}
                                        />
                                        <View style={[styles.staffBadge, { backgroundColor: Colors.secondary }]}>
                                            <Text style={styles.staffBadgeText}>עוזר מאמן</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.staffName}>{currentStaff.assistant}</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {activeTab === 'matches' && (
                        <View>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.teamsSelector}
                                contentContainerStyle={styles.teamsSelectorContent}
                            >
                                {teams.map((team) => (
                                    <TouchableOpacity
                                        key={team.id}
                                        style={[
                                            styles.teamChip,
                                            activeTeamId === team.id && styles.teamChipActive
                                        ]}
                                        onPress={() => handleTeamChange(team.id)}
                                    >
                                        <Text style={[
                                            styles.teamChipText,
                                            activeTeamId === team.id && styles.teamChipTextActive
                                        ]}>
                                            {team.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <View style={styles.staffHeader}>
                                <Text style={styles.staffTitle}>לו"ז ותוצאות - {teams.find(t => t.id === activeTeamId)?.name}</Text>
                            </View>

                            {currentMatches.map((m) => (
                                <View key={m.id} style={styles.youthMatchCard}>
                                    <View style={styles.youthMatchTeam}>
                                        <Text style={styles.youthMatchSderot}>באר שבע</Text>
                                    </View>
                                    <View style={styles.youthMatchScoreContainer}>
                                        <Text style={styles.youthMatchScore}>{m.score}</Text>
                                        <Text style={styles.youthMatchDate}>{m.date}</Text>
                                    </View>
                                    <View style={styles.youthMatchTeam}>
                                        <Text style={styles.youthMatchOpponent}>{m.opponent}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </Animated.View>

                <View style={{ height: 120 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        height: 140,
        justifyContent: 'flex-end',
        padding: 24,
    },
    headerContent: {
        zIndex: 1,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: Colors.white,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
    },
    tabBarContainer: {
        paddingHorizontal: 20,
        marginTop: -24,
        zIndex: 10,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 6,
        elevation: 10,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
    },
    tabButtonActive: {
        backgroundColor: Colors.primary + '10',
    },
    tabText: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.mediumGray,
    },
    tabTextActive: {
        color: Colors.primary,
    },
    scrollPadding: {
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    section: {
        gap: 16,
    },
    articleCard: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.offWhite,
        elevation: 2,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    articleImage: {
        width: 100,
        height: 100,
    },
    articleInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    articleTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: Colors.black,
        lineHeight: 20,
    },
    articleFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    articleDate: {
        fontSize: 12,
        color: Colors.mediumGray,
        fontWeight: '600',
    },
    teamsSelector: {
        marginBottom: 24,
    },
    teamsSelectorContent: {
        gap: 10,
        paddingRight: 4,
    },
    teamChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: Colors.offWhite,
        borderWidth: 1,
        borderColor: Colors.lightGray,
    },
    teamChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    teamChipText: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.darkGray,
    },
    teamChipTextActive: {
        color: Colors.white,
    },
    staffHeader: {
        marginBottom: 16,
    },
    staffTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: Colors.black,
    },
    staffContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    staffCard: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.lightGray,
        elevation: 4,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    staffImageWrapper: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 18,
        overflow: 'hidden',
        marginBottom: 12,
        position: 'relative',
    },
    staffImage: {
        width: '100%',
        height: '100%',
    },
    staffImageGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    staffBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: Colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    staffBadgeText: {
        color: Colors.white,
        fontSize: 10,
        fontWeight: '800',
    },
    staffName: {
        fontSize: 16,
        fontWeight: '800',
        color: Colors.black,
        textAlign: 'center',
    },
    statsOverview: {
        flexDirection: 'row',
        gap: 16,
    },
    overviewCard: {
        flex: 1,
        backgroundColor: Colors.offWhite,
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        gap: 4,
    },
    overviewValue: {
        fontSize: 24,
        fontWeight: '900',
        color: Colors.black,
    },
    overviewLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.mediumGray,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.mediumGray,
        marginTop: 12,
    },
    youthMatchCard: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: Colors.lightGray,
        elevation: 2,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    youthMatchTeam: {
        flex: 1,
        alignItems: 'center',
    },
    youthMatchSderot: {
        fontSize: 14,
        fontWeight: '900',
        color: Colors.primary,
        textAlign: 'center',
    },
    youthMatchOpponent: {
        fontSize: 14,
        fontWeight: '800',
        color: Colors.black,
        textAlign: 'center',
    },
    youthMatchScoreContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    youthMatchScore: {
        fontSize: 20,
        fontWeight: '900',
        color: Colors.black,
    },
    youthMatchDate: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.mediumGray,
        marginTop: 4,
    },
});
