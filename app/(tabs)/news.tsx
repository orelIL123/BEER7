import Colors from '@/constants/Colors';
import { useApprovedArticles } from '@/hooks/useApprovedArticles';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const categories = [
    { id: 'all', label: 'הכל' },
    { id: 'news', label: 'חדשות' },
    { id: 'culture', label: 'תרבות' },
    { id: 'events', label: 'אירועים' },
    { id: 'business', label: 'עסקים' },
    { id: 'community', label: 'קהילה' },
];

export default function NewsScreen() {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState('all');
    const { articles: newsArticles } = useApprovedArticles();

    function formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        const day = date.getDate();
        const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
        return `${day} ב${months[date.getMonth()]}`;
    }

    function getCategoryLabel(category: string): string {
        const labels: Record<string, string> = {
            news: 'חדשות',
            culture: 'תרבות',
            events: 'אירועים',
            business: 'עסקים',
            community: 'קהילה',
        };
        return labels[category] || category;
    }

    function getCategoryColor(category: string): string {
        const colors: Record<string, string> = {
            news: Colors.blue,
            culture: Colors.secondary,
            events: Colors.yellow,
            business: Colors.success,
            community: Colors.primary,
        };
        return colors[category] || Colors.primary;
    }

    const filteredArticles = activeCategory === 'all'
        ? newsArticles
        : newsArticles.filter(a => a.category === activeCategory);

    const featured = filteredArticles[0];
    const restArticles = filteredArticles.slice(1);

    return (
        <View style={styles.container}>
            {/* Category Filter */}
            <View style={styles.filterOuter}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScroll}
                >
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[
                                styles.filterBadge,
                                activeCategory === cat.id && styles.filterBadgeActive
                            ]}
                            onPress={() => setActiveCategory(cat.id)}
                        >
                            <Text style={[
                                styles.filterText,
                                activeCategory === cat.id && styles.filterTextActive
                            ]}>
                                {cat.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
                {featured && (
                    <TouchableOpacity
                        style={styles.heroCard}
                        onPress={() => router.push(`/news/${featured.id}` as any)}
                        activeOpacity={0.9}
                    >
                        <ExpoImage
                            source={featured.image === 'bino' ? require('@/assets/images/bino.png') : { uri: featured.image }}
                            style={styles.heroImage}
                            contentFit="cover"
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)']}
                            style={styles.heroGradient}
                        />
                        <View style={styles.heroContent}>
                            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(featured.category) }]}>
                                <Text style={styles.categoryBadgeText}>{getCategoryLabel(featured.category)}</Text>
                            </View>
                            <Text style={styles.heroTitle}>{featured.title}</Text>
                            <View style={styles.heroMeta}>
                                <Text style={styles.heroDate}>{formatDate(featured.date)}</Text>
                                <View style={styles.dot} />
                                <Text style={styles.heroReadTime}>4 דקות קריאה</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}

                <View style={styles.listSection}>
                    {restArticles.map((article) => (
                        <TouchableOpacity
                            key={article.id}
                            style={styles.articleCard}
                            onPress={() => router.push(`/news/${article.id}` as any)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.articleImageContainer}>
                                <ExpoImage
                                    source={article.image === 'bino' ? require('@/assets/images/bino.png') : { uri: article.image }}
                                    style={styles.articleImage}
                                    contentFit="cover"
                                />
                                <View style={[styles.articleCategoryPip, { backgroundColor: getCategoryColor(article.category) }]} />
                            </View>
                            <View style={styles.articleContent}>
                                <Text style={{ color: getCategoryColor(article.category), fontSize: 11, fontWeight: '800', marginBottom: 4 }}>
                                    {getCategoryLabel(article.category)}
                                </Text>
                                <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
                                <View style={styles.articleFooter}>
                                    <Text style={styles.articleDateText}>{formatDate(article.date)}</Text>
                                    <Ionicons name="chevron-back" size={14} color={Colors.mediumGray} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {filteredArticles.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="newspaper-outline" size={64} color={Colors.lightGray} />
                        <Text style={styles.emptyText}>לא נמצאו כתבות בקטגוריה זו</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.submitCta} onPress={() => router.push('/submit-article')} activeOpacity={0.8}>
                    <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
                    <Text style={styles.submitCtaText}>הגשת כתבה</Text>
                </TouchableOpacity>

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
    filterOuter: {
        backgroundColor: Colors.white,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.offWhite,
    },
    filterScroll: {
        paddingHorizontal: 16,
        gap: 8,
    },
    filterBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.offWhite,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterBadgeActive: {
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
        paddingBottom: 20,
    },
    heroCard: {
        margin: 20,
        height: 380,
        borderRadius: 32,
        overflow: 'hidden',
        elevation: 12,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '60%',
    },
    heroContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
    },
    categoryBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    categoryBadgeText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    heroTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: Colors.white,
        lineHeight: 32,
        marginBottom: 12,
    },
    heroMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    heroDate: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '600',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.4)',
        marginHorizontal: 8,
    },
    heroReadTime: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '600',
    },
    listSection: {
        paddingHorizontal: 20,
    },
    articleCard: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 24,
        marginBottom: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: Colors.offWhite,
        elevation: 4,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    articleImageContainer: {
        position: 'relative',
    },
    articleImage: {
        width: 100,
        height: 100,
        borderRadius: 16,
        backgroundColor: Colors.offWhite,
    },
    articleCategoryPip: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: Colors.white,
    },
    articleContent: {
        flex: 1,
        paddingLeft: 16,
        justifyContent: 'center',
    },
    articleTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: Colors.black,
        lineHeight: 20,
        marginBottom: 8,
    },
    articleFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    articleDateText: {
        fontSize: 12,
        color: Colors.mediumGray,
        fontWeight: '600',
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
    submitCta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 24,
        paddingVertical: 14,
        paddingHorizontal: 20,
        backgroundColor: Colors.primary + '12',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.primary + '40',
    },
    submitCtaText: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.primary,
    },
});

