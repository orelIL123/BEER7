import AppBackButton from '@/components/AppBackButton';
import { isAdminPhone } from '@/constants/admin';
import Colors from '@/constants/Colors';
import { cityInfo } from '@/constants/MockData';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SettingsScreen() {
    const router = useRouter();
    const { user, signOut } = useAuth();
    const [notifications, setNotifications] = useState(true);
    const [matchAlerts, setMatchAlerts] = useState(true);
    const [newsAlerts, setNewsAlerts] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    return (
        <View style={{ flex: 1 }}>
            <AppBackButton />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Account */}
                <View style={[styles.section, { paddingTop: 100 }]}>
                    <Text style={styles.sectionTitle}>חשבון</Text>
                    <View style={styles.settingCard}>
                        {user ? (
                            <>
                                <View style={styles.settingRow}>
                                    <Ionicons name="person" size={22} color={Colors.primary} />
                                    <View style={styles.settingContent}>
                                        <Text style={styles.settingLabel}>מחובר</Text>
                                        <Text style={styles.userName}>
                                            {user.fullName || user.firstName || user.phoneNumber || 'משתמש רשום'}
                                        </Text>
                                        {user.phoneNumber ? (
                                            <Text style={[styles.settingDesc, { fontSize: 11, marginTop: 2 }]}>{user.phoneNumber}</Text>
                                        ) : null}
                                    </View>
                                </View>
                                <View style={styles.separator} />
                                <TouchableOpacity style={styles.linkRow} onPress={() => signOut()}>
                                    <Ionicons name="log-out-outline" size={22} color={Colors.error} />
                                    <Text style={[styles.linkLabel, { color: Colors.error }]}>התנתק</Text>
                                    <Ionicons name="chevron-back" size={18} color={Colors.error} />
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/auth/login')}>
                                    <Ionicons name="log-in-outline" size={22} color={Colors.primary} />
                                    <View style={styles.settingContent}>
                                        <Text style={[styles.settingLabel, { color: Colors.primary }]}>התחבר</Text>
                                        <Text style={styles.settingDesc}>כבר יש לך חשבון – התחבר עם מספר נייד</Text>
                                    </View>
                                    <Ionicons name="chevron-back" size={18} color={Colors.primary} />
                                </TouchableOpacity>
                                <View style={styles.separator} />
                                <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/auth')}>
                                    <Ionicons name="person-add-outline" size={22} color={Colors.primary} />
                                    <View style={styles.settingContent}>
                                        <Text style={[styles.settingLabel, { color: Colors.primary }]}>הרשם עכשיו</Text>
                                        <Text style={styles.settingDesc}>קופונים, התראות על מבצעים ועוד</Text>
                                    </View>
                                    <Ionicons name="chevron-back" size={18} color={Colors.primary} />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>

                {/* Notifications */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>התראות</Text>
                    <View style={styles.settingCard}>
                        <SettingRow
                            icon="notifications-outline"
                            label="התראות Push"
                            description="קבלת התראות על עדכונים"
                            value={notifications}
                            onToggle={setNotifications}
                        />
                        <View style={styles.separator} />
                        <SettingRow
                            icon="calendar-outline"
                            label="התראות אירועים"
                            description="עדכונים על מפגשים ואירועים"
                            value={matchAlerts}
                            onToggle={setMatchAlerts}
                        />
                        <View style={styles.separator} />
                        <SettingRow
                            icon="newspaper-outline"
                            label="התראות חדשות"
                            description="עדכונים על כתבות חדשות"
                            value={newsAlerts}
                            onToggle={setNewsAlerts}
                        />
                    </View>
                </View>

                {/* Display */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>תצוגה</Text>
                    <View style={styles.settingCard}>
                        <SettingRow
                            icon="moon-outline"
                            label="מצב לילה"
                            description="תצוגה כהה"
                            value={darkMode}
                            onToggle={setDarkMode}
                        />
                    </View>
                </View>

                {/* About */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>אודות</Text>
                    <View style={styles.aboutCard}>
                        <Image
                            source={require('@/assets/images/logo.png')}
                            style={styles.aboutLogo}
                            resizeMode="contain"
                        />
                        <Text style={styles.aboutName}>{cityInfo.fullName}</Text>
                        <Text style={styles.aboutDetail}>{cityInfo.description}</Text>
                        <Text style={styles.aboutDetail}>אתר: {cityInfo.website}</Text>
                        <Text style={styles.aboutDisclaimer}>* אפליקציה זו אינה האפליקציה הרשמית של העיר ומנוהלת ע״י גורמים פרטיים.</Text>
                    </View>
                </View>

                {/* Contribute */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>תרומה</Text>
                    <View style={styles.settingCard}>
                        <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/submit-article')}>
                            <Ionicons name="create-outline" size={22} color={Colors.primary} />
                            <Text style={styles.linkLabel}>הגשת כתבה</Text>
                            <Ionicons name="chevron-back" size={18} color={Colors.mediumGray} />
                        </TouchableOpacity>
                        {user && isAdminPhone(user.phoneNumber ?? undefined) && (
                            <>
                                <View style={styles.separator} />
                                <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/admin/articles')}>
                                    <Ionicons name="shield-checkmark-outline" size={22} color={Colors.success} />
                                    <Text style={[styles.linkLabel, { color: Colors.success }]}>ניהול כתבות (אישור הגשות)</Text>
                                    <Ionicons name="chevron-back" size={18} color={Colors.success} />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>

                {/* Links */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>קישורים</Text>
                    <View style={styles.settingCard}>
                        <LinkRow icon="globe-outline" label="אתר העיר" />
                        <View style={styles.separator} />
                        <LinkRow icon="shield-checkmark-outline" label="מדיניות פרטיות" />
                        <View style={styles.separator} />
                        <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/terms')}>
                            <Ionicons name="document-text-outline" size={22} color={Colors.primary} />
                            <Text style={styles.linkLabel}>תנאי שימוש</Text>
                            <Ionicons name="chevron-back" size={18} color={Colors.mediumGray} />
                        </TouchableOpacity>
                        <View style={styles.separator} />
                        <LinkRow icon="star-outline" label="דרגו אותנו" />
                    </View>
                </View>

                <Text style={styles.version}>גרסה 1.0.0 · באר שבע ©</Text>
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

function SettingRow({
    icon,
    label,
    description,
    value,
    onToggle,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    description: string;
    value: boolean;
    onToggle: (val: boolean) => void;
}) {
    return (
        <View style={styles.settingRow}>
            <Ionicons name={icon} size={22} color={Colors.primary} />
            <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>{label}</Text>
                <Text style={styles.settingDesc}>{description}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: Colors.lightGray, true: Colors.primary + '80' }}
                thumbColor={value ? Colors.primary : Colors.mediumGray}
            />
        </View>
    );
}

function LinkRow({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
    return (
        <TouchableOpacity style={styles.linkRow}>
            <Ionicons name={icon} size={22} color={Colors.primary} />
            <Text style={styles.linkLabel}>{label}</Text>
            <Ionicons name="chevron-back" size={18} color={Colors.mediumGray} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.offWhite,
    },
    section: {
        padding: 16,
        paddingBottom: 0,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: 12,
        textAlign: 'right',
    },
    settingCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    settingContent: {
        flex: 1,
    },
    settingLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.black,
        textAlign: 'right',
    },
    userName: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.darkGray,
        marginTop: 4,
        textAlign: 'right',
    },
    settingDesc: {
        fontSize: 12,
        color: Colors.mediumGray,
        marginTop: 2,
        textAlign: 'right',
    },
    separator: {
        height: 1,
        backgroundColor: Colors.lightGray,
        marginHorizontal: 16,
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    linkLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: Colors.black,
        textAlign: 'right',
    },
    aboutCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        elevation: 2,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    aboutLogo: {
        width: 80,
        height: 80,
        marginBottom: 12,
    },
    aboutName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: 8,
    },
    aboutDetail: {
        fontSize: 14,
        color: Colors.darkGray,
        marginBottom: 4,
        textAlign: 'center',
    },
    aboutDisclaimer: {
        fontSize: 12,
        color: Colors.mediumGray,
        marginTop: 12,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    version: {
        textAlign: 'center',
        fontSize: 12,
        color: Colors.mediumGray,
        marginTop: 24,
    },
});
