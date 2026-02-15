import { isAdminPhone } from '@/constants/admin';
import Colors from '@/constants/Colors';
import { cityInfo } from '@/constants/MockData';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Tabs, useRouter } from 'expo-router';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type HeaderActions = { openDrawer: () => void; openProfile: () => void };
const HeaderContext = createContext<HeaderActions | null>(null);

export function useHeaderActions() {
  const ctx = useContext(HeaderContext);
  if (!ctx) return { openDrawer: () => {}, openProfile: () => {} };
  return ctx;
}

type MenuItem = { icon: keyof typeof Ionicons.glyphMap; label: string; route: string; color: string };

const BASE_MENU_ITEMS: MenuItem[] = [
  { icon: 'book', label: 'תוכן תורני', route: '/torah', color: Colors.primaryDark },
  { icon: 'people-sharp', label: 'אישים', route: '/people', color: Colors.success },
  { icon: 'images-sharp', label: 'גלריה', route: '/gallery', color: Colors.vibrantGradient[0] },
  { icon: 'home', label: 'נדלן', route: '/real-estate', color: Colors.primaryDark },
  { icon: 'business-sharp', label: 'עסקים', route: '/sponsors', color: Colors.accent },
  { icon: 'people', label: 'קהילה', route: '/(tabs)/community', color: Colors.blue },
  { icon: 'pricetag-sharp', label: 'קופונים', route: '/coupons', color: Colors.error },
  { icon: 'shield-checkmark', label: 'בריאות ובטיחות', route: '/health-safety', color: Colors.yellow },
  { icon: 'create-outline', label: 'הגשת כתבה', route: '/submit-article', color: Colors.primary },
  { icon: 'settings-sharp', label: 'הגדרות', route: '/settings', color: Colors.mediumGray },
];

function CustomHeader() {
  const { openDrawer, openProfile } = useHeaderActions();
  return (
    <View style={styles.headerContainer}>
      <BlurView intensity={Platform.OS === 'ios' ? 80 : 100} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.headerIconButton}>
          <Ionicons name="search-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitleText}>באר שבע</Text>
        </View>

        <View style={styles.headerRightRow}>
          <TouchableOpacity style={styles.headerIconButton} onPress={openDrawer} activeOpacity={0.7}>
            <Ionicons name="menu" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconButton} onPress={openProfile} activeOpacity={0.7}>
            <Ionicons name="person-circle-outline" size={28} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function SideDrawer({
  visible,
  onClose,
  onNavigate,
  menuItems,
}: {
  visible: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  menuItems: MenuItem[];
}) {
  if (!visible) return null;
  return (
    <>
      <Pressable style={styles.drawerBackdrop} onPress={onClose} />
      <View style={styles.drawerPanel}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>{cityInfo.fullName}</Text>
          <TouchableOpacity style={styles.drawerCloseBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.drawerScroll} showsVerticalScrollIndicator={false}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.drawerItem}
              onPress={() => {
                onNavigate(item.route);
                onClose();
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.drawerItemIcon, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon} size={22} color={item.color} />
              </View>
              <Text style={styles.drawerItemLabel}>{item.label}</Text>
              <Ionicons name="chevron-back" size={18} color={Colors.mediumGray} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

function NewsTabButton({ children, onPress }: any) {
  return (
    <View style={styles.centerButtonWrapper}>
      <View style={styles.centerButtonGlow} />
      <TouchableOpacity
        style={styles.centerButton}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Image
          source={require('@/assets/images/spining_bottom.png')}
          style={styles.centerButtonLogo}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <Text style={styles.centerButtonLabel}>כתבות</Text>
    </View>
  );
}

export default function TabLayout() {
  const router = useRouter();
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuItems = useMemo((): MenuItem[] => {
    const items = [...BASE_MENU_ITEMS];
    if (user && isAdminPhone(user.phoneNumber ?? undefined)) {
      const settingsIdx = items.findIndex((i) => i.route === '/settings');
      items.splice(settingsIdx, 0, { icon: 'shield-checkmark', label: 'לוח ניהול', route: '/admin/index', color: Colors.primary });
    }
    return items;
  }, [user]);

  const headerActions: HeaderActions = {
    openDrawer: () => setDrawerOpen(true),
    openProfile: () => router.replace('/(tabs)/profile'),
  };

  return (
    <HeaderContext.Provider value={headerActions}>
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.mediumGray,
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabLabel,
            tabBarItemStyle: styles.tabBarItem,
            header: () => <CustomHeader />,
            tabBarBackground: () => (
              <BlurView
                intensity={Platform.OS === 'ios' ? 80 : 100}
                tint="light"
                style={styles.tabBarBlur}
              />
            ),
          }}
          screenListeners={{
            tabPress: () => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'בית',
              headerShown: false,
              tabBarIcon: ({ color, size, focused }) => (
                <View style={styles.homeIconWrapper}>
                  {focused && <View style={styles.homeIconGlow} />}
                  <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="businesses"
            options={{
              title: 'עסקים',
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name={focused ? "business" : "business-outline"} size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="news"
            options={{
              title: 'כתבות',
              tabBarButton: (props) => <NewsTabButton {...props} />,
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name={focused ? "newspaper" : "newspaper-outline"} size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="community"
            options={{
              title: 'קהילה',
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name={focused ? "people" : "people-outline"} size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen name="events" options={{ href: null }} />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'פרופיל',
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name={focused ? "person-circle" : "person-circle-outline"} size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen name="matches" options={{ href: null }} />
          <Tabs.Screen name="squad" options={{ href: null }} />
          <Tabs.Screen name="youth" options={{ href: null }} />
          <Tabs.Screen
            name="more"
            options={{
              href: null,
              title: 'עוד',
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons name={focused ? "ellipsis-horizontal" : "ellipsis-horizontal-outline"} size={size} color={color} />
              ),
            }}
          />
        </Tabs>
        <SideDrawer
          visible={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onNavigate={(route) => router.push(route as any)}
          menuItems={menuItems}
        />
      </View>
    </HeaderContext.Provider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    height: Platform.OS === 'ios' ? 110 : 90,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerLogo: {
    width: 72,
    height: 72,
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 100,
  },
  drawerPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 300,
    maxWidth: '85%',
    backgroundColor: Colors.white,
    zIndex: 101,
    borderLeftWidth: 1,
    borderLeftColor: Colors.glassBorder,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.offWhite,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primary,
  },
  drawerCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerScroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 4,
    borderRadius: 16,
    backgroundColor: Colors.offWhite,
  },
  drawerItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  drawerItemLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: Colors.black,
  },
  tabBar: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.glassBg,
    borderTopWidth: 0,
    paddingBottom: 0,
    paddingHorizontal: 8,
    elevation: 0,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  tabBarItem: {
    flex: 1,
  },
  tabBarBlur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 8,
  },
  centerButtonWrapper: {
    top: -26,
    width: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButtonGlow: {
    position: 'absolute',
    width: 74,
    height: 74,
    borderRadius: 37,
    left: 7,
    top: -7,
    backgroundColor: Colors.primary + '32',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.75,
    shadowRadius: 16,
    elevation: 0,
  },
  centerButton: {
    width: 66,
    height: 66,
    borderRadius: 33,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.65,
    shadowRadius: 20,
    elevation: 24,
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  centerButtonLogo: {
    width: '100%',
    height: '100%',
    borderRadius: 33,
    transform: [{ scale: 2 }, { translateX: -1 }],
  },
  centerButtonLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 4,
  },
  homeIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
  },
  homeIconGlow: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DC262625',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 12,
  },
});

