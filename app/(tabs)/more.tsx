import Colors from '@/constants/Colors';
import { cityInfo } from '@/constants/MockData';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface MenuItem {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    route: string;
    color: string;
    description: string;
}

export default function MoreScreen() {
    const router = useRouter();

    const menuItems: MenuItem[] = [
        {
            icon: 'people-sharp',
            label: 'אישים',
            route: '/people',
            color: Colors.success,
            description: 'אישים מהעיר באר שבע',
        },
        {
            icon: 'images-sharp',
            label: 'גלריה',
            route: '/gallery',
            color: Colors.vibrantGradient[0],
            description: 'סיפורים ותמונות מהעיר',
        },
        {
            icon: 'people',
            label: 'קהילה',
            route: '/(tabs)/community',
            color: Colors.blue,
            description: 'לוח מודעות – עבודה, עזרה, חונכות',
        },
        {
            icon: 'business-sharp',
            label: 'עסקים',
            route: '/sponsors',
            color: Colors.accent,
            description: 'עסקים מקומיים בבאר שבע',
        },
        {
            icon: 'pricetag-sharp',
            label: 'קופונים',
            route: '/coupons',
            color: Colors.error,
            description: 'הנחות ומבצעים',
        },
        {
            icon: 'shield-checkmark',
            label: 'בריאות ובטיחות',
            route: '/health-safety',
            color: Colors.yellow,
            description: 'מספרי חירום, נקודות עזרה והנחיות',
        },
        {
            icon: 'settings-sharp',
            label: 'הגדרות',
            route: '/settings',
            color: Colors.mediumGray,
            description: 'התראות וניהול חשבון',
        },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
            {/* Header / Club Branding */}
            <View style={styles.headerCard}>
                <LinearGradient
                    colors={[Colors.blue, Colors.primary, Colors.secondary] as any}
                    style={styles.headerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
                <View style={styles.headerContent}>
                    <View style={styles.logoOrb}>
                        <Image
                            source={require('@/assets/images/logo.png')}
                            style={styles.clubLogo}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.headerText}>
                        <Text style={styles.clubName}>{cityInfo.fullName}</Text>
                        <View style={styles.stadiumRow}>
                            <Ionicons name="location-sharp" size={14} color="rgba(255,255,255,0.8)" />
                            <Text style={styles.clubDetail}>{cityInfo.description}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Menu Sections */}
            <View style={styles.menuContainer}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={() => router.push(item.route as any)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.menuIconBox, { backgroundColor: item.color + '15' }]}>
                            <Ionicons name={item.icon} size={24} color={item.color} />
                        </View>
                        <View style={styles.menuInfo}>
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            <Text style={styles.menuDescription}>{item.description}</Text>
                        </View>
                        <View style={styles.chevronBox}>
                            <Ionicons name="chevron-back" size={18} color={Colors.mediumGray} />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Social Media - Modern Horizontal Row */}
            <View style={styles.socialCard}>
                <Text style={styles.socialTitle}>הצטרפו לקהילה</Text>
                <View style={styles.socialGrid}>
                    {[
                        { icon: 'logo-facebook', color: '#1877F2', label: 'פייסבוק' },
                        { icon: 'logo-instagram', color: '#E4405F', label: 'אינסטגרם' },
                        { icon: 'logo-whatsapp', color: '#25D366', label: 'וואטסאפ' },
                        { icon: 'logo-youtube', color: '#FF0000', label: 'יוטיוב' },
                    ].map((s, i) => (
                        <TouchableOpacity key={i} style={styles.socialItem}>
                            <View style={[styles.socialIconBox, { backgroundColor: s.color + '10' }]}>
                                <Ionicons name={s.icon as any} size={24} color={s.color} />
                            </View>
                            <Text style={styles.socialLabel}>{s.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Footer Info */}
            <View style={styles.footer}>
                <Text style={styles.versionText}>גרסה 1.0.0 (2026 Edition)</Text>
                <Text style={styles.copyrightText}>כל הזכויות שמורות לאפליקציית באר שבע ©</Text>
            </View>

            <View style={{ height: 120 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    scrollPadding: {
        paddingBottom: 20,
    },
    headerCard: {
        margin: 20,
        height: 160,
        borderRadius: 32,
        overflow: 'hidden',
        elevation: 12,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
    },
    headerGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    headerContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
    },
    logoOrb: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    clubLogo: {
        width: '100%',
        height: '100%',
    },
    headerText: {
        flex: 1,
        marginRight: 20,
    },
    clubName: {
        fontSize: 22,
        fontWeight: '900',
        color: Colors.white,
        marginBottom: 6,
    },
    stadiumRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    clubDetail: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
    },
    menuContainer: {
        paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.offWhite,
        elevation: 4,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    menuIconBox: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 16,
    },
    menuInfo: {
        flex: 1,
    },
    menuLabel: {
        fontSize: 16,
        fontWeight: '900',
        color: Colors.black,
    },
    menuDescription: {
        fontSize: 12,
        color: Colors.mediumGray,
        fontWeight: '600',
        marginTop: 2,
    },
    chevronBox: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.offWhite,
        alignItems: 'center',
        justifyContent: 'center',
    },
    socialCard: {
        margin: 20,
        padding: 24,
        backgroundColor: Colors.offWhite,
        borderRadius: 32,
    },
    socialTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: Colors.black,
        marginBottom: 20,
    },
    socialGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    socialItem: {
        alignItems: 'center',
        gap: 8,
    },
    socialIconBox: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
    },
    socialLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: Colors.darkGray,
    },
    footer: {
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 20,
    },
    versionText: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.mediumGray,
        marginBottom: 4,
    },
    copyrightText: {
        fontSize: 11,
        fontWeight: '600',
        color: Colors.lightGray,
    },
});

