import Colors from '@/constants/Colors';
import { cityInfo } from '@/constants/MockData';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function TermsScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
                    <Ionicons name="arrow-forward" size={24} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>תנאי שימוש</Text>
                <View style={styles.backBtn} />
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.hero}>
                    <View style={styles.heroIconWrap}>
                        <Ionicons name="document-text" size={36} color={Colors.primary} />
                    </View>
                    <Text style={styles.heroTitle}>תנאי שימוש</Text>
                    <Text style={styles.heroSubtitle}>{cityInfo.fullName}</Text>
                </View>

                <View style={styles.card}>
                    <SectionTitle icon="information-circle">אודות האפליקציה</SectionTitle>
                    <Paragraph>
                        אפליקציה זו הינה יוזמה פרטית, המופעלת למען רווחת תושבי האזור. היא אינה אפליקציה רשמית של העירייה או של גוף ציבורי, ומנוהלת באופן פרטי על ידי המפעיל.
                    </Paragraph>
                </View>

                <View style={styles.card}>
                    <SectionTitle icon="megaphone">תוכן ופרסומים</SectionTitle>
                    <Paragraph>
                        המפעיל שומר לעצמו את מלוא הזכות להחליט אילו תכנים יפורסמו באפליקציה. פרסום, עריכה, הסרה או אי־פרסום של כל תוכן (כתבות, מודעות, אירועים, תמונות ועוד) נתון לשיקול דעתו הבלעדי של המפעיל, ללא צורך בהנמקה או בהודעה מוקדמת.
                    </Paragraph>
                </View>

                <View style={styles.card}>
                    <SectionTitle icon="checkmark-done">שימוש באפליקציה</SectionTitle>
                    <Paragraph>
                        השימוש באפליקציה מהווה הסכמה לתנאים אלה. המפעיל רשאי לשנות את תנאי השימוש מעת לעת; המשך השימוש לאחר עדכון ייחשב להסכמה לגרסה המעודכנת.
                    </Paragraph>
                </View>

                <View style={styles.card}>
                    <SectionTitle icon="shield-outline">אחריות ומגבלות</SectionTitle>
                    <Paragraph>
                        האפליקציה ניתנת לשימוש "כמות שהיא" (As Is). המפעיל לא מתחייב לדיוק, לזמינות או להתאמה של התכנים, ואינו נושא באחריות לנזקים ישירים או עקיפים הנובעים משימוש או מאי־שימוש באפליקציה או בתכניה.
                    </Paragraph>
                </View>

                <View style={styles.card}>
                    <SectionTitle icon="hand-left">התנהגות משתמשים</SectionTitle>
                    <Paragraph>
                        משתמש מתחייב שלא להעלות או לשתף תכנים בלתי־חוקיים, פוגעניים או מנוגדים לכללי הצניעות והכבוד. המפעיל רשאי להסיר תכנים, לחסום משתמשים או להפסיק שירות בהתאם לשיקול דעתו.
                    </Paragraph>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>תנאי שימוש · גרסה 1.0</Text>
                    <Text style={styles.footerText}>© {new Date().getFullYear()} {cityInfo.name}</Text>
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

function SectionTitle({ icon, children }: { icon: keyof typeof Ionicons.glyphMap; children: string }) {
    return (
        <View style={styles.sectionTitleRow}>
            <Ionicons name={icon} size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>{children}</Text>
        </View>
    );
}

function Paragraph({ children }: { children: string }) {
    return <Text style={styles.paragraph}>{children}</Text>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.offWhite,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 56,
        paddingBottom: 12,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGray,
    },
    backBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.black,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingTop: 24,
    },
    hero: {
        alignItems: 'center',
        marginBottom: 24,
    },
    heroIconWrap: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: Colors.primary + '18',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: Colors.primaryDark,
        marginBottom: 4,
    },
    heroSubtitle: {
        fontSize: 14,
        color: Colors.mediumGray,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 18,
        marginBottom: 14,
        elevation: 2,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.primaryDark,
    },
    paragraph: {
        fontSize: 14,
        lineHeight: 22,
        color: Colors.darkGray,
        textAlign: 'right',
    },
    footer: {
        alignItems: 'center',
        marginTop: 16,
    },
    footerText: {
        fontSize: 12,
        color: Colors.mediumGray,
        marginTop: 4,
    },
});
