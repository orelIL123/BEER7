import { isAdminPhone } from '@/constants/admin';
import Colors from '@/constants/Colors';
import type { Talent } from '@/constants/Types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { createTalent, getTalents, uploadTalentImage } from '@/lib/talents';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_IMG_HEIGHT = 180;

function AddTalentModal({
  visible,
  onClose,
  onSuccess,
}: {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isAdmin = user ? isAdminPhone(user.phoneNumber ?? undefined) : false;
  const [type, setType] = useState<'video' | 'image'>('video');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function pickImage() {
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
    if (result.canceled || !result.assets[0]) return;
    setUploading(true);
    try {
      const url = await uploadTalentImage(result.assets[0].uri);
      setImages((p) => [...p, url]);
    } catch (e: any) {
      showToast(e?.message ?? 'שגיאה בהעלאה', 'error');
    } finally {
      setUploading(false);
    }
  }

  function removeImage(i: number) {
    setImages((p) => p.filter((_, idx) => idx !== i));
  }

  async function submit() {
    const t = title.trim();
    if (!t) {
      showToast('חובה כותרת', 'error');
      return;
    }
    if (type === 'video') {
      if (!videoUrl.trim()) {
        showToast('חובה קישור לסרטון', 'error');
        return;
      }
    } else {
      if (images.length === 0) {
        showToast('חובה לפחות תמונה אחת', 'error');
        return;
      }
    }
    setSubmitting(true);
    try {
      await createTalent({
        title: t,
        description: description.trim() || undefined,
        type,
        videoUrl: type === 'video' ? videoUrl.trim() : undefined,
        images: type === 'image' ? images : undefined,
        date: new Date().toISOString(),
      });
      showToast('נוסף בהצלחה', 'success');
      setTitle('');
      setDescription('');
      setVideoUrl('');
      setImages([]);
      onSuccess();
      onClose();
    } catch (e: any) {
      showToast(e?.message ?? 'שגיאה', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  if (!isAdmin) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView style={styles.modalBackdrop} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>הוסף כישרון</Text>
                <TouchableOpacity onPress={onClose} hitSlop={12}>
                  <Ionicons name="close" size={28} color={Colors.mediumGray} />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <Text style={styles.inputLabel}>כותרת *</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="כותרת"
                  placeholderTextColor={Colors.mediumGray}
                  textAlign="right"
                />
                <Text style={styles.inputLabel}>סוג</Text>
                <View style={styles.typeRow}>
                  <TouchableOpacity
                    style={[styles.typeBtn, type === 'video' && styles.typeBtnActive]}
                    onPress={() => setType('video')}
                  >
                    <Text style={[styles.typeBtnText, type === 'video' && styles.typeBtnTextActive]}>סרטון</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.typeBtn, type === 'image' && styles.typeBtnActive]}
                    onPress={() => setType('image')}
                  >
                    <Text style={[styles.typeBtnText, type === 'image' && styles.typeBtnTextActive]}>תמונות</Text>
                  </TouchableOpacity>
                </View>
                {type === 'video' ? (
                  <>
                    <Text style={styles.inputLabel}>קישור לסרטון *</Text>
                    <TextInput
                      style={styles.input}
                      value={videoUrl}
                      onChangeText={setVideoUrl}
                      placeholder="https://youtube.com/..."
                      placeholderTextColor={Colors.mediumGray}
                      keyboardType="url"
                      autoCapitalize="none"
                      textAlign="right"
                    />
                  </>
                ) : (
                  <>
                    <Text style={styles.inputLabel}>תמונות *</Text>
                    <View style={styles.imagesRow}>
                      {images.map((url, i) => (
                        <View key={i} style={styles.thumbWrap}>
                          <ExpoImage source={{ uri: url }} style={styles.thumb} />
                          <TouchableOpacity style={styles.removeThumb} onPress={() => removeImage(i)}>
                            <Ionicons name="close" size={16} color={Colors.white} />
                          </TouchableOpacity>
                        </View>
                      ))}
                      <TouchableOpacity style={styles.addThumb} onPress={pickImage} disabled={uploading}>
                        {uploading ? <ActivityIndicator size="small" /> : <Ionicons name="add" size={28} color={Colors.primary} />}
                      </TouchableOpacity>
                    </View>
                  </>
                )}
                <Text style={styles.inputLabel}>תיאור (אופציונלי)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="תיאור – אם קיים, יוצג כפתור המשך לקרוא"
                  placeholderTextColor={Colors.mediumGray}
                  multiline
                  textAlign="right"
                />
              </ScrollView>
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                  <Text style={styles.cancelBtnText}>ביטול</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.submitBtn, submitting && styles.submitBtnDisabled]} onPress={submit} disabled={submitting}>
                  {submitting ? <ActivityIndicator size="small" color={Colors.white} /> : <Text style={styles.submitBtnText}>הוסף</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function TalentCard({
  talent,
  onReadMore,
}: {
  talent: Talent;
  onReadMore: (t: Talent) => void;
}) {
  const hasDescription = Boolean(talent.description?.trim());
  const isVideo = talent.type === 'video';
  const thumbnailUrl = isVideo ? undefined : (talent.images?.[0] ?? null);

  const handlePrimaryAction = () => {
    if (hasDescription) {
      onReadMore(talent);
    } else if (isVideo && talent.videoUrl) {
      Linking.openURL(talent.videoUrl);
    } else if (talent.images?.length) {
      onReadMore(talent);
    }
  };

  const primaryLabel = hasDescription
    ? 'המשך לקרוא'
    : isVideo
      ? 'צפה בסרטון'
      : 'צפה בגלריה';

  return (
    <View style={styles.card}>
      {thumbnailUrl ? (
        <ExpoImage source={{ uri: thumbnailUrl }} style={styles.cardImage} contentFit="cover" />
      ) : isVideo ? (
        <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
          <Ionicons name="videocam" size={48} color={Colors.mediumGray} />
        </View>
      ) : (
        <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
          <Ionicons name="images" size={48} color={Colors.mediumGray} />
        </View>
      )}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{talent.title}</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={handlePrimaryAction} activeOpacity={0.8}>
          <Text style={styles.primaryBtnText}>{primaryLabel}</Text>
          <Ionicons name="chevron-forward" size={18} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function DescriptionModal({ talent, visible, onClose }: { talent: Talent | null; visible: boolean; onClose: () => void }) {
  if (!talent) return null;
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.descModalBackdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.descModalCard} onStartShouldSetResponder={() => true}>
          <Text style={styles.descModalTitle}>{talent.title}</Text>
          {talent.description ? <Text style={styles.descModalText}>{talent.description}</Text> : null}
          <View style={styles.descModalActions}>
            {talent.type === 'video' && talent.videoUrl && (
              <TouchableOpacity
                style={styles.descVideoBtn}
                onPress={() => Linking.openURL(talent.videoUrl!)}
              >
                <Ionicons name="play-circle" size={22} color={Colors.white} />
                <Text style={styles.descVideoBtnText}>צפה בסרטון</Text>
              </TouchableOpacity>
            )}
            {talent.type === 'image' && talent.images?.length ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.descGallery}>
                {talent.images.map((url, i) => (
                  <ExpoImage key={i} source={{ uri: url }} style={styles.descGalleryImg} contentFit="cover" />
                ))}
              </ScrollView>
            ) : null}
            <TouchableOpacity style={styles.descCloseBtn} onPress={onClose}>
              <Text style={styles.descCloseBtnText}>סגור</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default function TalentsScreen() {
  const { user } = useAuth();
  const [list, setList] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [readMoreTalent, setReadMoreTalent] = useState<Talent | null>(null);
  const isAdmin = user ? isAdminPhone(user.phoneNumber ?? undefined) : false;

  const load = useCallback(async () => {
    try {
      const data = await getTalents();
      setList(data);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && list.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={styles.heroIconWrap}>
          <Ionicons name="videocam" size={44} color={Colors.white} />
        </View>
        <Text style={styles.heroTitle}>בואו לפרגן!</Text>
        <Text style={styles.heroSubtitle}>סרטוני כישרונות מקומיים</Text>
      </LinearGradient>

      {isAdmin && (
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add-circle" size={22} color={Colors.white} />
          <Text style={styles.addBtnText}>הוסף כישרון</Text>
        </TouchableOpacity>
      )}

      {list.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="videocam-outline" size={56} color={Colors.mediumGray} />
          <Text style={styles.emptyTitle}>אין כישרונות כרגע</Text>
          <Text style={styles.emptySub}>כישרונות יופיעו כאן כאשר יתווספו.</Text>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TalentCard talent={item} onReadMore={(t) => setReadMoreTalent(t)} />
          )}
        />
      )}

      <AddTalentModal visible={showAddModal} onClose={() => setShowAddModal(false)} onSuccess={load} />
      <DescriptionModal
        talent={readMoreTalent}
        visible={!!readMoreTalent}
        onClose={() => setReadMoreTalent(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  centered: { justifyContent: 'center', alignItems: 'center' },
  hero: { paddingVertical: 32, paddingHorizontal: 24, alignItems: 'center' },
  heroIconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  heroTitle: { fontSize: 28, fontWeight: '900', color: Colors.white },
  heroSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.9)', marginTop: 6 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.primary, marginHorizontal: 16, marginTop: 20, paddingVertical: 14, borderRadius: 16 },
  addBtnText: { color: Colors.white, fontWeight: '800', fontSize: 15 },
  listContent: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: Colors.white, borderRadius: 20, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: Colors.lightGray },
  cardImage: { width: '100%', height: CARD_IMG_HEIGHT },
  cardImagePlaceholder: { backgroundColor: Colors.offWhite, alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: 16 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: Colors.black, marginBottom: 12, textAlign: 'right' },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.primary, paddingVertical: 12, borderRadius: 12 },
  primaryBtnText: { color: Colors.white, fontWeight: '800', fontSize: 15 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: Colors.darkGray, marginTop: 16 },
  emptySub: { fontSize: 15, color: Colors.mediumGray, marginTop: 8, textAlign: 'center' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: Colors.black },
  modalScroll: { maxHeight: 400 },
  inputLabel: { fontSize: 14, fontWeight: '700', color: Colors.darkGray, marginBottom: 8, textAlign: 'right' },
  input: { backgroundColor: Colors.offWhite, borderRadius: 12, padding: 14, fontSize: 16, color: Colors.black, borderWidth: 1, borderColor: Colors.lightGray, marginBottom: 16 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  typeBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: Colors.lightGray, alignItems: 'center' },
  typeBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeBtnText: { fontSize: 15, fontWeight: '700', color: Colors.darkGray },
  typeBtnTextActive: { color: Colors.white },
  imagesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  thumbWrap: { position: 'relative' },
  thumb: { width: 80, height: 80, borderRadius: 12 },
  removeThumb: { position: 'absolute', top: 4, right: 4, width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.error, alignItems: 'center', justifyContent: 'center' },
  addThumb: { width: 80, height: 80, borderRadius: 12, borderWidth: 2, borderColor: Colors.primary, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: Colors.lightGray, alignItems: 'center' },
  cancelBtnText: { fontWeight: '700', color: Colors.darkGray },
  submitBtn: { flex: 2, paddingVertical: 14, borderRadius: 12, backgroundColor: Colors.primary, alignItems: 'center' },
  submitBtnText: { color: Colors.white, fontWeight: '800', fontSize: 16 },
  submitBtnDisabled: { opacity: 0.7 },
  descModalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  descModalCard: { backgroundColor: Colors.white, borderRadius: 24, padding: 24 },
  descModalTitle: { fontSize: 22, fontWeight: '900', color: Colors.black, marginBottom: 16, textAlign: 'right' },
  descModalText: { fontSize: 16, color: Colors.darkGray, lineHeight: 26, marginBottom: 20, textAlign: 'right' },
  descModalActions: { gap: 12 },
  descVideoBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.primary, paddingVertical: 12, borderRadius: 12 },
  descVideoBtnText: { color: Colors.white, fontWeight: '800', fontSize: 15 },
  descGallery: { marginBottom: 12 },
  descGalleryImg: { width: width - 88, height: 200, borderRadius: 12, marginLeft: 8 },
  descCloseBtn: { paddingVertical: 12, alignItems: 'center' },
  descCloseBtnText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
});
