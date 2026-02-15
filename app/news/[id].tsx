import Colors from '@/constants/Colors';
import { businesses } from '@/constants/MockData';
import { useApprovedArticles } from '@/hooks/useApprovedArticles';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Linking,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function NewsDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { articles, loading } = useApprovedArticles();
    const article = id ? articles.find(a => a.id === id) : undefined;

    if (!article) {
        return (
            <View style={styles.errorContainer}>
                {loading ? <ActivityIndicator size="large" color={Colors.primary} /> : <Text style={styles.errorText}>הכתבה לא נמצאה</Text>}
            </View>
        );
    }

    function formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        const day = date.getDate();
        const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
        return `${day} ב${months[date.getMonth()]} ${date.getFullYear()}`;
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
            news: Colors.primary,
            culture: Colors.secondary,
            events: Colors.accent,
            business: Colors.success,
            community: Colors.primary,
        };
        return colors[category] || Colors.primary;
    }

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${article.title}\n\n${article.summary}\n\nאפליקציית באר שבע`,
            });
        } catch (error) { }
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
                headerRight: () => (
                    <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
                        <Ionicons name="share-social" size={22} color={Colors.white} />
                    </TouchableOpacity>
                )
            }} />

            <View style={styles.heroContainer}>
                <ExpoImage
                    source={article.image === 'bino' ? require('@/assets/images/bino.png') : { uri: article.image }}
                    style={styles.heroImage}
                    contentFit="cover"
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.heroGradient}
                />
                <View style={styles.heroContent}>
                    <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(article.category) }]}>
                        <Text style={styles.categoryText}>{getCategoryLabel(article.category)}</Text>
                    </View>
                    <Text style={styles.title}>{article.title}</Text>
                    <View style={styles.heroMeta}>
                        <Ionicons name="calendar-outline" size={14} color="rgba(255,255,255,0.7)" />
                        <Text style={styles.dateText}>{formatDate(article.date)}</Text>
                        <View style={styles.dot} />
                        <Text style={styles.readTime}>5 דקות קריאה</Text>
                    </View>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.summary}>{article.summary}</Text>

                <View style={styles.divider} />

                <Text style={styles.bodyText}>
                    {article.content}
                </Text>

                <View style={styles.footerActions}>
                    {article.businessId && (() => {
                        const business = businesses.find((b) => b.id === article.businessId);
                        const address = business?.address ? `${business.address}, באר שבע` : 'רחוב הארזים באר שבע';
                        return (
                            <TouchableOpacity
                                style={[styles.actionButton, styles.navigateButton]}
                                onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(address)}`)}
                            >
                                <Ionicons name="navigate" size={20} color={Colors.white} />
                                <Text style={styles.actionButtonText}>נווט לבינו</Text>
                            </TouchableOpacity>
                        );
                    })()}
                    <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                        <LinearGradient
                            colors={Colors.premiumGradient as any}
                            style={styles.actionGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Ionicons name="share-social" size={20} color={Colors.white} />
                            <Text style={styles.actionButtonText}>שתף עם חברים</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Related Articles */}
                <View style={styles.relatedSection}>
                    <Text style={styles.relatedTitle}>כתבות נוספות</Text>
                    {articles.filter(a => a.id !== id).slice(0, 3).map((related) => (
                        <TouchableOpacity
                            key={related.id}
                            style={styles.relatedCard}
                            onPress={() => router.push(`/news/${related.id}` as any)}
                        >
                            <ExpoImage
                                source={related.image === 'bino' ? require('@/assets/images/bino.png') : { uri: related.image }}
                                style={styles.relatedImage}
                                contentFit="cover"
                            />
                            <View style={styles.relatedInfo}>
                                <Text style={{ color: getCategoryColor(related.category), fontSize: 10, fontWeight: '800', marginBottom: 2 }}>
                                    {getCategoryLabel(related.category)}
                                </Text>
                                <Text style={styles.relatedArticleTitle} numberOfLines={2}>
                                    {related.title}
                                </Text>
                                <Text style={styles.relatedDate}>{formatDate(related.date)}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <View style={{ height: 60 }} />
        </ScrollView>
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
        marginHorizontal: 8,
    },
    heroContainer: {
        height: 450,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
    categoryText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: Colors.white,
        lineHeight: 36,
        marginBottom: 16,
    },
    heroMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '600',
        marginRight: 6,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.4)',
        marginHorizontal: 8,
    },
    readTime: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
        fontWeight: '600',
    },
    content: {
        padding: 24,
        backgroundColor: Colors.white,
        marginTop: -30,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    summary: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.black,
        lineHeight: 28,
        marginBottom: 24,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.offWhite,
        marginBottom: 24,
    },
    bodyText: {
        fontSize: 16,
        color: Colors.darkGray,
        lineHeight: 28,
        fontWeight: '500',
    },
    footerActions: {
        marginTop: 40,
        marginBottom: 40,
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    navigateButton: {
        backgroundColor: Colors.blue,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    actionGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    actionButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '800',
    },
    relatedSection: {
        marginTop: 20,
        paddingTop: 30,
        borderTopWidth: 1,
        borderTopColor: Colors.offWhite,
    },
    relatedTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: Colors.black,
        marginBottom: 20,
    },
    relatedCard: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.offWhite,
    },
    relatedImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
    },
    relatedInfo: {
        flex: 1,
        paddingLeft: 16,
        justifyContent: 'center',
    },
    relatedArticleTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: Colors.black,
        lineHeight: 20,
    },
    relatedDate: {
        fontSize: 11,
        color: Colors.mediumGray,
        fontWeight: '600',
        marginTop: 4,
    },
});
