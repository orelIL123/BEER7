import Colors from '@/constants/Colors';
import { isAdminPhone } from '@/constants/admin';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useGalleryItems } from '@/hooks/useGalleryItems';
import { getUserGalleryCount, uploadGalleryImage } from '@/lib/gallery';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const THUMB_SIZE = (width - 48) / 3;
const SHARED_THUMB_SIZE = width * 0.36;
const CATEGORIES = ['נוסטלגיה', 'אירועים', 'העיר', 'קהילה', 'תרבות', 'פנאי', 'אתם משתפים'];

function ShareModal({ visible, onClose, onSuccess }: { visible: boolean; onClose: () => void; onSuccess: () => void }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('אתם משתפים');
  const [userCount, setUserCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const isAdmin = user ? isAdminPhone(user.phoneNumber ?? undefined) : false;
  const canUpload = isAdmin || userCount < 4;

  const loadCount = useCallback(async () => {
    if (!user) return;
    const count = await getUserGalleryCount(user.phoneNumber);
    setUserCount(count);
  }, [user]);

  useEffect(() => {
    if (visible && user) loadCount();
  }, [visible, user, loadCount]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showToast('נדרשת הרשאת גישה לתמונות', 'error');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) setImageUri(result.assets[0].uri);
  };

  const submit = async () => {
    if (!user || !imageUri) {
      showToast('נא לבחור תמונה', 'error');
      return;
    }
    const t = title.trim();
    if (!t) {
      showToast('נא להזין כותרת', 'error');
      return;
    }
    if (!canUpload) {
      showToast('הגעת למכסה (4 תמונות)', 'error');
      return;
    }
    setUploading(true);
    try {
      await uploadGalleryImage(user.phoneNumber, isAdmin, { title: t, imageUri, category });
      showToast('התמונה נוספה', 'success');
      setImageUri(null);
      setTitle('');
      setCategory('אתם משתפים');
      onSuccess();
      onClose();
    } catch (e: any) {
      showToast(e?.message ?? 'שגיאה', 'error');
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>שתפו תמונה</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}><Ionicons name="close" size={28} color={Colors.mediumGray} /></TouchableOpacity>
          </View>
          {isAdmin ? <Text style={styles.quotaText}>כאדמין – אין הגבלה.</Text> : <Text style={styles.quotaText}>עד 4 תמונות. העלאות: {userCount}/4</Text>}
          <TouchableOpacity style={styles.pickArea} onPress={pickImage}>
            {imageUri ? <ExpoImage source={{ uri: imageUri }} style={styles.pickPreview} contentFit="cover" /> : (<><Ionicons name="camera-outline" size={44} color={Colors.primary} /><Text style={styles.pickLabel}>בחירת תמונה</Text></>)}
          </TouchableOpacity>
          <Text style={styles.inputLabel}>כותרת *</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="כותרת" placeholderTextColor={Colors.mediumGray} />
          <Text style={styles.inputLabel}>קטגוריה</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat} style={[styles.catChip, category === cat && styles.catChipActive]} onPress={() => setCategory(cat)}>
                <Text style={[styles.catChipText, category === cat && styles.catChipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}><Text style={styles.cancelBtnText}>ביטול</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.submitBtn, (!canUpload || uploading) && styles.submitBtnDisabled]} onPress={submit} disabled={uploading}>
              {uploading ? <ActivityIndicator size="small" color={Colors.white} /> : <Text style={styles.submitBtnText}>העלאה</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function GalleryScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('הכל');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const { user } = useAuth();
  const { allItems, sharedItems, loading, refresh } = useGalleryItems();
  const categories = ['הכל', ...Array.from(new Set(allItems.map((g) => g.category)))];
  const filtered = activeFilter === 'הכל' ? allItems : allItems.filter((g) => g.category === activeFilter);

  return (
    <View style={styles.container}>
      <View style={styles.sharedSection}>
        <Text style={styles.sharedSectionTitle}>אתם משתפים</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sharedScroll}>
          {sharedItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.sharedThumbContainer} onPress={() => setSelectedImage(item.url)} activeOpacity={0.9}>
              <Image source={{ uri: item.thumbnail }} style={styles.sharedThumbnail} />
              <View style={styles.sharedThumbOverlay}><Text style={styles.sharedThumbTitle} numberOfLines={1}>{item.title}</Text></View>
            </TouchableOpacity>
          ))}
          {user ? (
            <TouchableOpacity style={styles.addShareCard} onPress={() => setShareModalOpen(true)} activeOpacity={0.8}>
              <Ionicons name="add-circle-outline" size={36} color={Colors.primary} />
              <Text style={styles.addShareText}>שתפו גם אתם</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.addShareCardDisabled}>
              <Ionicons name="lock-closed-outline" size={28} color={Colors.mediumGray} />
              <Text style={styles.addShareTextDisabled}>התחברו כדי לשתף</Text>
            </View>
          )}
        </ScrollView>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={styles.filterContent}>
        {categories.map((cat) => (
          <TouchableOpacity key={cat} style={[styles.filterChip, activeFilter === cat && styles.activeFilter]} onPress={() => setActiveFilter(cat)}>
            <Text style={[styles.filterText, activeFilter === cat && styles.activeFilterText]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {loading ? (
        <View style={styles.loaderWrap}><ActivityIndicator size="large" color={Colors.primary} /></View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.gridContainer}>
          <View style={styles.grid}>
            {filtered.map((item) => (
              <TouchableOpacity key={item.id} style={styles.thumbContainer} onPress={() => setSelectedImage(item.url)}>
                <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                <View style={styles.thumbOverlay}><Text style={styles.thumbTitle} numberOfLines={1}>{item.title}</Text></View>
                {item.type === 'video' && <View style={styles.playButton}><Ionicons name="play" size={20} color={Colors.white} /></View>}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
      <Modal visible={!!selectedImage} transparent animationType="fade">
        <View style={styles.lightbox}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedImage(null)}><Ionicons name="close" size={28} color={Colors.white} /></TouchableOpacity>
          {selectedImage && <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />}
        </View>
      </Modal>
      <ShareModal visible={shareModalOpen} onClose={() => setShareModalOpen(false)} onSuccess={refresh} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  sharedSection: { backgroundColor: Colors.white, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.lightGray },
  sharedSectionTitle: { fontSize: 20, fontWeight: '900', color: Colors.black, marginBottom: 12, paddingHorizontal: 16 },
  sharedScroll: { paddingHorizontal: 16 },
  sharedThumbContainer: { width: SHARED_THUMB_SIZE, height: SHARED_THUMB_SIZE, borderRadius: 14, overflow: 'hidden', marginRight: 12, position: 'relative' },
  sharedThumbnail: { width: '100%', height: '100%' },
  sharedThumbOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 8, backgroundColor: 'rgba(0,0,0,0.5)' },
  sharedThumbTitle: { color: Colors.white, fontSize: 11, fontWeight: '600' },
  addShareCard: { width: SHARED_THUMB_SIZE, height: SHARED_THUMB_SIZE, borderRadius: 14, marginRight: 16, backgroundColor: Colors.primary + '12', borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.primary + '60', alignItems: 'center', justifyContent: 'center' },
  addShareText: { fontSize: 13, fontWeight: '700', color: Colors.primary, marginTop: 8 },
  addShareCardDisabled: { width: SHARED_THUMB_SIZE, height: SHARED_THUMB_SIZE, borderRadius: 14, marginRight: 16, backgroundColor: Colors.offWhite, borderWidth: 1, borderColor: Colors.lightGray, alignItems: 'center', justifyContent: 'center' },
  addShareTextDisabled: { fontSize: 12, color: Colors.mediumGray, marginTop: 6 },
  filterBar: { maxHeight: 52, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.lightGray },
  filterContent: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.lightGray, marginRight: 8 },
  activeFilter: { backgroundColor: Colors.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: Colors.darkGray },
  activeFilterText: { color: Colors.white },
  loaderWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 48 },
  gridContainer: { padding: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  thumbContainer: { width: THUMB_SIZE, height: THUMB_SIZE, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  thumbnail: { width: '100%', height: '100%' },
  thumbOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 6, backgroundColor: 'rgba(0,0,0,0.5)' },
  thumbTitle: { color: Colors.white, fontSize: 10, fontWeight: '600' },
  playButton: { position: 'absolute', top: '50%', left: '50%', marginTop: -18, marginLeft: -18, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  lightbox: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
  closeButton: { position: 'absolute', top: 60, right: 20, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  fullImage: { width: width - 20, height: height * 0.7 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.black },
  quotaText: { fontSize: 13, color: Colors.mediumGray, marginBottom: 12 },
  pickArea: { height: 180, borderRadius: 16, backgroundColor: Colors.offWhite, borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.lightGray, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  pickPreview: { width: '100%', height: '100%', borderRadius: 14 },
  pickLabel: { fontSize: 14, color: Colors.primary, marginTop: 8, fontWeight: '600' },
  inputLabel: { fontSize: 14, fontWeight: '700', color: Colors.darkGray, marginBottom: 6 },
  input: { backgroundColor: Colors.offWhite, borderRadius: 12, padding: 14, fontSize: 16, color: Colors.black, borderWidth: 1, borderColor: Colors.lightGray, marginBottom: 16 },
  catScroll: { marginBottom: 20, marginHorizontal: -20, paddingHorizontal: 20 },
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.offWhite, marginLeft: 8 },
  catChipActive: { backgroundColor: Colors.primary + '20', borderWidth: 1, borderColor: Colors.primary },
  catChipText: { fontSize: 13, fontWeight: '600', color: Colors.mediumGray },
  catChipTextActive: { color: Colors.primary },
  modalActions: { flexDirection: 'row', gap: 12, justifyContent: 'flex-end' },
  cancelBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, backgroundColor: Colors.offWhite },
  cancelBtnText: { fontSize: 15, fontWeight: '700', color: Colors.mediumGray },
  submitBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, backgroundColor: Colors.primary, minWidth: 100, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
