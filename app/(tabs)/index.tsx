import { isAdminPhone } from '@/constants/admin';
import Colors from '@/constants/Colors';
import { cityInfo, featuredEvent as mockFeaturedEvent } from '@/constants/MockData';
import { useAuth } from '@/context/AuthContext';
import { useApprovedArticles } from '@/hooks/useApprovedArticles';
import { useCoupons } from '@/hooks/useCoupons';
import { useFeaturedEvent } from '@/hooks/useFeaturedEvent';
import { usePersons } from '@/hooks/usePersons';
import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { Image as ExpoImage } from 'expo-image';
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
  View,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderActions } from './_layout';

const { width, height } = Dimensions.get('window');
const HERO_HEIGHT = 420;
const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

const ADMIN_EDIT_ITEMS = [
  { icon: 'newspaper' as const, label: 'כתבות', route: '/admin/articles' },
  { icon: 'people' as const, label: 'אנשים', route: '/admin/edit-people' },
  { icon: 'calendar' as const, label: 'אירועים', route: '/admin/edit-events' },
  { icon: 'pricetag' as const, label: 'קופונים', route: '/admin/edit-coupons' },
  { icon: 'business' as const, label: 'עסקים', route: '/admin/edit-businesses' },
  { icon: 'home' as const, label: 'מידע עיר', route: '/admin/edit-city' },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { openDrawer } = useHeaderActions();
  const { articles: newsArticles } = useApprovedArticles();
  const persons = usePersons();
  const featured = useFeaturedEvent();
  const coupons = useCoupons();
  const { user } = useAuth();
  const scrollY = useSharedValue(0);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const isAdmin = isAdminPhone(user?.phoneNumber ?? undefined);
  const personOfTheWeek = persons.length > 0 ? persons[0] : null;
  const featuredEvent = featured ?? mockFeaturedEvent;

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-HERO_HEIGHT, 0, HERO_HEIGHT],
            [-HERO_HEIGHT / 2, 0, HERO_HEIGHT * 0.75],
            Extrapolate.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [-HERO_HEIGHT, 0, HERO_HEIGHT],
            [2, 1, 1],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const navBarStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100], [0, 1], Extrapolate.CLAMP);
    return {
      backgroundColor: `rgba(255, 255, 255, ${opacity})`,
      borderBottomWidth: opacity,
      borderBottomColor: 'rgba(0,0,0,0.05)',
    };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        scrollY.value,
        [0, 100],
        ['#FFFFFF', Colors.black]
      ),
    };
  });

  return (
    <View style={[styles.container, styles.rtlContainer]}>
      {/* Admin floating edit button */}
      {isAdmin && (
        <View style={[styles.adminFab, styles.adminFabRtl, { top: insets.top + 60 }]}>
          {adminMenuOpen && (
            <View style={styles.adminMenu}>
              {ADMIN_EDIT_ITEMS.map((item) => (
                <TouchableOpacity
                  key={item.route}
                  style={styles.adminMenuItem}
                  onPress={() => { setAdminMenuOpen(false); router.push(item.route as any); }}
                  activeOpacity={0.8}
                >
                  <Ionicons name={item.icon} size={16} color={Colors.white} />
                  <Text style={styles.adminMenuItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <TouchableOpacity
            style={styles.adminFabBtn}
            onPress={() => setAdminMenuOpen((v) => !v)}
            activeOpacity={0.85}
          >
            <Ionicons name={adminMenuOpen ? 'close' : 'pencil'} size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      )}

      {/* Elegant Top Nav Bar – RTL: כותרת/לוגו מימין, איקונים משמאל */}
      <Animated.View style={[styles.navBar, styles.navBarRtl, { paddingTop: insets.top }, navBarStyle]}>
        <View style={styles.navLogoContainer}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.navLogo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.navBarSpacer} />
        <View style={styles.navIconsRow}>
          <TouchableOpacity style={styles.navIcon} onPress={openDrawer}>
            <AnimatedIonicons name="menu-outline" size={32} style={animatedIconStyle} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navIcon}>
            <AnimatedIonicons name="notifications-outline" size={26} style={animatedIconStyle} />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Animated Hero Header */}
        <Animated.View style={[styles.heroBackgroundContainer, headerStyle]}>
          <ExpoImage
            source={require('@/assets/images/city_view.png')}
            style={styles.heroBackgroundImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)', Colors.white]}
            style={styles.heroOverlay}
          />
        </Animated.View>

        <View style={styles.contentOverlay}>
          {/* Header Info */}
          <View style={[styles.headerInfo, { paddingTop: insets.top + 20 }]}>
            <View>
              <Text style={styles.welcomeText}>אפליקציית</Text>
              <Text style={styles.clubNameText}>{cityInfo.name} שלי</Text>
            </View>
          </View>

          {/* מה חם בעיר – פרסום עסקים, מבצעים, אירועים. לחיצה פותחת את מסך האירועים */}
          {featuredEvent && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>מה חם בעיר</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/events')}>
                  <Text style={styles.seeAllText}>הכל</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.centralEventCard}
                onPress={() => router.push('/(tabs)/events')}
              >
                {featuredEvent.video ? (
                  <Video
                    source={{ uri: featuredEvent.video }}
                    style={styles.centralEventImage}
                    useNativeControls
                    resizeMode={ResizeMode.COVER}
                    isLooping
                  />
                ) : featuredEvent.image ? (
                  <ExpoImage source={{ uri: featuredEvent.image }} style={styles.centralEventImage} contentFit="cover" />
                ) : (
                  <View style={styles.centralEventImagePlaceholder} />
                )}
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(15,23,42,0.98)']}
                  style={styles.centralEventOverlay}
                />
                <View style={styles.centralEventContent}>
                  <View style={styles.centralEventBadge}>
                    <Text style={styles.centralEventBadgeText}>
                      {featuredEvent.kind === 'business_opening' ? 'פתיחת עסק' : featuredEvent.kind === 'live' ? 'לייב' : 'אירוע'}
                    </Text>
                    {featuredEvent.isMembersOnly ? (
                      <Text style={styles.centralEventMembersOnly}> לחברי אפליקציה</Text>
                    ) : null}
                  </View>
                  <Text style={styles.centralEventTitle} numberOfLines={2}>{featuredEvent.title}</Text>
                  {featuredEvent.subtitle ? (
                    <Text style={styles.centralEventSubtitle} numberOfLines={1}>{featuredEvent.subtitle}</Text>
                  ) : null}
                  <View style={styles.centralEventMeta}>
                    <Ionicons name="calendar-outline" size={14} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.centralEventMetaText}>{featuredEvent.date}</Text>
                    {featuredEvent.place ? (
                      <>
                        <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.9)" />
                        <Text style={styles.centralEventMetaText}>{featuredEvent.place}</Text>
                      </>
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* איש השבוע */}
          {personOfTheWeek && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>איש השבוע</Text>
                <TouchableOpacity onPress={() => router.push('/people')}>
                  <Text style={styles.seeAllText}>כל האישים</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.personCard}
                onPress={() => router.push(`/person/${personOfTheWeek.id}` as any)}
                activeOpacity={0.9}
              >
                <Image
                  source={personOfTheWeek.image === 'orel' ? require('@/assets/images/orel_aharon.png') : { uri: personOfTheWeek.image }}
                  style={styles.personImage}
                  resizeMode="cover"
                />
                <View style={styles.personInfo}>
                  <View style={styles.personBadge}>
                    <Text style={styles.personBadgeText}>איש השבוע</Text>
                  </View>
                  <Text style={styles.personName}>{personOfTheWeek.name}</Text>
                  <Text style={styles.personRole}>{personOfTheWeek.role}</Text>
                  <Text style={styles.personBio} numberOfLines={2}>{personOfTheWeek.shortBio}</Text>
                </View>
                <Ionicons name="chevron-back" size={22} color={Colors.mediumGray} />
              </TouchableOpacity>
            </View>
          )}

          {/* כתבות ועדכונים – נפתח גם מהכפתור המרכזי בטאב בר */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>כתבות ועדכונים</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/news')}>
                <Ionicons name="chevron-back" size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={width * 0.82}
              contentContainerStyle={styles.newsList}
            >
              {newsArticles.map((article) => (
                <View key={article.id}>
                  <TouchableOpacity
                    style={styles.newsCard}
                    onPress={() => router.push(`/news/${article.id}` as any)}
                  >
                    <ExpoImage
                      source={article.image === 'bino' ? require('@/assets/images/bino.png') : { uri: article.image }}
                      style={styles.newsImage}
                      contentFit="cover"
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.9)']}
                      style={styles.newsOverlay}
                    >
                      <View style={styles.newsTag}>
                        <Text style={styles.newsTagText}>{getCategoryLabel(article.category)}</Text>
                      </View>
                      <Text style={styles.newsTitleText} numberOfLines={2}>{article.title}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* קופונים – רק מה שמוגדר באדמין (Firestore) */}
          {coupons.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>קופונים ומבצעים</Text>
                <TouchableOpacity onPress={() => router.push('/coupons')}>
                  <Text style={styles.seeAllText}>הכל</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.couponsList}
              >
                {coupons.slice(0, 5).map((c) => {
                  const max = c.maxRedemptions;
                  const used = c.redemptionCount ?? 0;
                  const left = max != null ? Math.max(0, max - used) : null;
                  return (
                    <TouchableOpacity
                      key={c.id}
                      style={styles.couponCard}
                      onPress={() => router.push('/coupons')}
                      activeOpacity={0.9}
                    >
                      <View style={styles.couponHeader}>
                        <Text style={styles.couponBusiness}>{c.businessName}</Text>
                        <Text style={styles.couponValid}>עד {c.validUntil}</Text>
                      </View>
                      <Text style={styles.couponTitle} numberOfLines={2}>{c.title}</Text>
                      {left !== null && (
                        <Text style={styles.couponLimit}>
                          {left === 0 ? 'אזל' : `נותר ל־${left} ממשיכים`}
                        </Text>
                      )}
                      {c.code ? (
                        <View style={styles.couponCodeBox}>
                          <Text style={styles.couponCode}>{c.code}</Text>
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}

          <View style={{ height: 120 }} />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  rtlContainer: {
    direction: 'rtl',
  },
  navBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 100,
  },
  navBarRtl: {
    direction: 'rtl',
  },
  navBarSpacer: {
    flex: 1,
  },
  navIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  navIcon: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  navLogoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLogo: {
    width: 180,
    height: 90,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroBackgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HERO_HEIGHT,
  },
  heroBackgroundImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  contentOverlay: {
    marginTop: 60,
    paddingBottom: 40,
  },
  headerInfo: {
    paddingHorizontal: 24,
    marginBottom: 30,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '700',
    opacity: 0.9,
    textAlign: 'center',
  },
  clubNameText: {
    fontSize: 48,
    color: Colors.white,
    fontWeight: '900',
    letterSpacing: -1.5,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
  },
  statsPanel: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  blurStats: {
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  statItem: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.primary,
  },
  statLab: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.mediumGray,
    marginTop: 2,
  },
  statSep: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  section: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    direction: 'rtl',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.black,
    letterSpacing: -0.5,
    textAlign: 'right',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  centralEventCard: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 220,
    backgroundColor: '#0f172a',
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  centralEventImage: {
    ...StyleSheet.absoluteFillObject,
  },
  centralEventImagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1e293b',
  },
  centralEventOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  centralEventContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 24,
  },
  centralEventBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  centralEventBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.yellow,
    textTransform: 'uppercase',
  },
  centralEventMembersOnly: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  centralEventTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
  },
  centralEventSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  centralEventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  centralEventMetaText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  ticketContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    marginVertical: 10,
  },
  ticketGradient: {
    padding: 24,
    paddingVertical: 32,
  },
  ticketDecorativeCircles: {
    position: 'absolute',
    top: '45%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  ticketCircleLeft: {
    width: 24,
    height: 48,
    backgroundColor: Colors.white,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    marginLeft: -12,
  },
  ticketCircleRight: {
    width: 24,
    height: 48,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    marginRight: -12,
  },
  ticketTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  ticketLeague: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  ticketLiveBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ticketLiveText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.black,
  },
  ticketMatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  eventTitleRow: {
    marginVertical: 10,
    alignItems: 'center',
  },
  ticketTeam: {
    flex: 1,
    alignItems: 'center',
  },
  ticketLogoBox: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  ticketLogoFill: {
    width: '200%',
    height: '200%',
  },
  ticketEmoji: {
    fontSize: 32,
  },
  ticketTeamName: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    width: 120,
  },
  ticketTimeBox: {
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
    paddingVertical: 12,
    minWidth: 100,
  },
  ticketVs: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.accent,
    opacity: 1,
    marginBottom: 4,
    letterSpacing: 1,
  },
  ticketTime: {
    fontSize: 36,
    color: Colors.white,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  ticketDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
  },
  ticketFooter: {
    marginTop: 28,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ticketVenue: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '600',
  },
  personCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.offWhite,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  personImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.lightGray,
  },
  personInfo: {
    flex: 1,
    marginHorizontal: 14,
  },
  personBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.yellowSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  personBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.yellow,
  },
  personName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.black,
  },
  personRole: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  personBio: {
    fontSize: 12,
    color: Colors.mediumGray,
    marginTop: 4,
  },
  couponsList: {
    paddingRight: 20,
    gap: 12,
  },
  couponCard: {
    width: 160,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.offWhite,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  couponBusiness: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    flex: 1,
  },
  couponValid: {
    fontSize: 10,
    color: Colors.mediumGray,
    fontWeight: '600',
  },
  couponTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.black,
  },
  couponLimit: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 4,
  },
  couponCodeBox: {
    marginTop: 10,
    backgroundColor: Colors.offWhite,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  couponCode: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1,
  },
  newsList: {
    paddingRight: 20,
  },
  newsCard: {
    width: width * 0.8,
    height: 220,
    borderRadius: 32,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: Colors.offWhite,
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  newsImage: {
    width: '100%',
    height: '100%',
  },
  newsOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
    justifyContent: 'flex-end',
  },
  newsTag: {
    backgroundColor: Colors.blue,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  newsTagText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '900',
  },
  newsTitleText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
  },
  playerSpotlight: {
    backgroundColor: Colors.white,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    overflow: 'hidden',
  },
  playerImage: {
    width: 110,
    height: 110,
    borderRadius: 24,
    backgroundColor: Colors.offWhite,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 20,
  },
  playerBadge: {
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  playerBadgeText: {
    fontSize: 11,
    color: '#856404',
    fontWeight: '800',
  },
  playerName: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.black,
  },
  playerPosition: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: 12,
  },
  playerStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  miniStat: {
    alignItems: 'center',
  },
  miniStatVal: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.black,
  },
  miniStatLab: {
    fontSize: 10,
    color: Colors.mediumGray,
    fontWeight: '600',
  },
  miniStatSep: {
    width: 1,
    height: 15,
    backgroundColor: Colors.lightGray,
  },
  adminFab: {
    position: 'absolute',
    left: 16,
    zIndex: 200,
    alignItems: 'flex-start',
  },
  adminFabRtl: {
    left: undefined,
    right: 16,
    alignItems: 'flex-end',
  },
  adminFabBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  adminMenu: {
    marginBottom: 8,
    gap: 6,
  },
  adminMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  adminMenuItemText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
