import { isAdminPhone } from '@/constants/admin';
import Colors from '@/constants/Colors';
import type { RealEstateListing } from '@/constants/Types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  createRealEstateListing,
  deleteRealEstateListing,
  getRealEstateListings,
  updateRealEstateListing,
  uploadRealEstateImage,
} from '@/lib/realEstate';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type FormData = {
  title: string;
  description: string;
  address: string;
  price: string;
  type: 'sale' | 'rent';
  images: string[];
  agentName: string;
  agentImage: string;
};

const EMPTY: FormData = {
  title: '',
  description: '',
  address: '',
  price: '',
  type: 'sale',
  images: [],
  agentName: '',
  agentImage: '',
};

export default function EditRealEstateScreen() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isAdmin = isAdminPhone(user?.phoneNumber ?? undefined);
  const [list, setList] = useState<RealEstateListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<RealEstateListing | { id: '__new__' } | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) load();
    else setLoading(false);
  }, [isAdmin]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getRealEstateListings();
      setList(data);
    } catch (e: any) {
      const msg = e?.message ?? String(e);
      setError(msg);
      showToast('שגיאה: ' + msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  function f<K extends keyof FormData>(field: K, v: FormData[K]) {
    setForm((p) => ({ ...p, [field]: v }));
  }

  async function pickAndUploadImage(field: 'images' | 'agentImage') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showToast('נדרשת הרשאת גישה לתמונות', 'error');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: field === 'agentImage',
      aspect: field === 'agentImage' ? [1, 1] : [4, 3],
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;

    setUploadingImg(true);
    try {
      const path = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const url = await uploadRealEstateImage(result.assets[0].uri, path);
      if (field === 'agentImage') {
        f('agentImage', url);
      } else {
        f('images', [...form.images, url]);
      }
    } catch (e: any) {
      showToast(e?.message ?? 'שגיאה בהעלאה', 'error');
    } finally {
      setUploadingImg(false);
    }
  }

  function removeImage(index: number) {
    f('images', form.images.filter((_, i) => i !== index));
  }

  async function save() {
    if (!form.title.trim()) {
      showToast('חובה כותרת', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        address: form.address.trim(),
        price: form.price.trim() || undefined,
        type: form.type,
        images: form.images,
        agentName: form.agentName.trim() || undefined,
        agentImage: form.agentImage.trim() || undefined,
      };
      if (editing && editing.id !== '__new__') {
        await updateRealEstateListing(editing.id, payload);
      } else {
        await createRealEstateListing(payload);
      }
      showToast('נשמר', 'success');
      setEditing(null);
      setForm(EMPTY);
      load();
    } catch (e: any) {
      const msg = e?.message ?? String(e);
      setError(msg);
      showToast('שגיאה: ' + msg, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    Alert.alert('מחיקה', 'למחוק נכס?', [
      { text: 'ביטול', style: 'cancel' },
      {
        text: 'מחק',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteRealEstateListing(id);
            showToast('נמחק', 'info');
            load();
          } catch (e: any) {
            showToast(e?.message ?? 'שגיאה', 'error');
          }
        },
      },
    ]);
  }

  if (!isAdmin) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Stack.Screen options={{ title: 'עריכת נדלן' }} />
        <Ionicons name="lock-closed" size={48} color={Colors.error} />
        <Text style={styles.msg}>אין הרשאה</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'עריכת נדלן' }} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {error && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color={Colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.addBtn} onPress={() => { setEditing({ id: '__new__' }); setForm(EMPTY); }}>
              <Ionicons name="add-circle" size={20} color={Colors.white} />
              <Text style={styles.addBtnText}>הוסף נכס חדש</Text>
            </TouchableOpacity>

            {editing && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>פרטי נכס</Text>

              <Text style={styles.label}>כותרת *</Text>
              <TextInput
                style={styles.input}
                value={form.title}
                onChangeText={(v) => f('title', v)}
                placeholder="כותרת הנכס"
                placeholderTextColor={Colors.mediumGray}
                textAlign="right"
              />

              <Text style={styles.label}>תיאור</Text>
              <TextInput
                style={[styles.input, styles.inputMulti]}
                value={form.description}
                onChangeText={(v) => f('description', v)}
                placeholder="תיאור הנכס"
                placeholderTextColor={Colors.mediumGray}
                multiline
                textAlign="right"
              />

              <Text style={styles.label}>כתובת</Text>
              <TextInput
                style={styles.input}
                value={form.address}
                onChangeText={(v) => f('address', v)}
                placeholder="כתובת"
                placeholderTextColor={Colors.mediumGray}
                textAlign="right"
              />

              <Text style={styles.label}>מחיר / שכר דירה (אופציונלי)</Text>
              <TextInput
                style={styles.input}
                value={form.price}
                onChangeText={(v) => f('price', v)}
                placeholder="לדוגמה: 5,000 ₪ או ריק"
                placeholderTextColor={Colors.mediumGray}
                keyboardType="numeric"
                textAlign="right"
              />

              <Text style={styles.label}>סוג</Text>
              <View style={styles.typeRow}>
                <TouchableOpacity
                  style={[styles.typeBtn, form.type === 'sale' && styles.typeBtnActive]}
                  onPress={() => f('type', 'sale')}
                >
                  <Text style={[styles.typeBtnText, form.type === 'sale' && styles.typeBtnTextActive]}>מכירה</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeBtn, form.type === 'rent' && styles.typeBtnActive]}
                  onPress={() => f('type', 'rent')}
                >
                  <Text style={[styles.typeBtnText, form.type === 'rent' && styles.typeBtnTextActive]}>השכרה</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>תמונות נכס</Text>
              <View style={styles.imagesRow}>
                {form.images.map((url, i) => (
                  <View key={i} style={styles.thumbWrap}>
                    <ExpoImage source={{ uri: url }} style={styles.thumb} />
                    <TouchableOpacity style={styles.removeThumb} onPress={() => removeImage(i)}>
                      <Ionicons name="close" size={16} color={Colors.white} />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.addThumb}
                  onPress={() => pickAndUploadImage('images')}
                  disabled={uploadingImg}
                >
                  {uploadingImg ? <ActivityIndicator size="small" /> : <Ionicons name="add" size={28} color={Colors.primary} />}
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>שם מתווך</Text>
              <TextInput
                style={styles.input}
                value={form.agentName}
                onChangeText={(v) => f('agentName', v)}
                placeholder="שם המתווך"
                placeholderTextColor={Colors.mediumGray}
                textAlign="right"
              />

              <Text style={styles.label}>תמונת מתווך</Text>
              {form.agentImage ? (
                <View style={styles.agentImgWrap}>
                  <ExpoImage source={{ uri: form.agentImage }} style={styles.agentImg} />
                  <TouchableOpacity style={styles.removeAgentImg} onPress={() => f('agentImage', '')}>
                    <Ionicons name="trash" size={18} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadAgentBtn}
                  onPress={() => pickAndUploadImage('agentImage')}
                  disabled={uploadingImg}
                >
                  <Ionicons name="image-outline" size={24} color={Colors.primary} />
                  <Text style={styles.uploadAgentText}>העלה תמונת מתווך</Text>
                </TouchableOpacity>
              )}

              <View style={styles.formActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => { setEditing(null); setForm(EMPTY); }}>
                  <Text style={styles.cancelBtnText}>ביטול</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={saving}>
                  {saving ? <ActivityIndicator color={Colors.white} size="small" /> : <Text style={styles.saveBtnText}>שמור</Text>}
                </TouchableOpacity>
              </View>
            </View>
            )}

            {loading ? (
              <ActivityIndicator color={Colors.primary} style={styles.loader} />
            ) : list.length === 0 ? (
              <View style={styles.empty}>
                <Ionicons name="home-outline" size={48} color={Colors.mediumGray} />
                <Text style={styles.emptyText}>אין נכסים. לחץ הוסף נכס חדש.</Text>
              </View>
            ) : (
              list.map((item) => (
                <View key={item.id} style={styles.itemCard}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.title}</Text>
                    <Text style={styles.itemSub}>{item.type === 'rent' ? 'השכרה' : 'מכירה'} • {item.address}</Text>
                  </View>
                  <TouchableOpacity style={styles.editBtn} onPress={() => { setEditing(item as RealEstateListing); setForm({ title: item.title, description: item.description, address: item.address, price: item.price ?? '', type: item.type, images: item.images ?? [], agentName: item.agentName ?? '', agentImage: item.agentImage ?? '' }); }}>
                    <Ionicons name="pencil" size={18} color={Colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => remove(item.id)}>
                    <Ionicons name="trash" size={18} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              ))
            )}
            <View style={{ height: 40 }} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  content: { padding: 16 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  msg: { fontSize: 18, fontWeight: '700', color: Colors.darkGray },
  errorBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: Colors.error + '15', borderRadius: 12, padding: 12, marginBottom: 12 },
  errorText: { flex: 1, fontSize: 12, color: Colors.error },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.primary, paddingVertical: 14, borderRadius: 16, marginBottom: 16 },
  addBtnText: { color: Colors.white, fontWeight: '800', fontSize: 15 },
  formCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.lightGray },
  formTitle: { fontSize: 18, fontWeight: '900', color: Colors.black, marginBottom: 12, textAlign: 'right' },
  label: { fontSize: 13, fontWeight: '700', color: Colors.darkGray, marginBottom: 6, textAlign: 'right' },
  input: { backgroundColor: Colors.offWhite, borderRadius: 12, borderWidth: 1, borderColor: Colors.lightGray, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: Colors.black, marginBottom: 12 },
  inputMulti: { minHeight: 80, textAlignVertical: 'top' },
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  typeBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: Colors.lightGray, alignItems: 'center' },
  typeBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeBtnText: { fontSize: 15, fontWeight: '700', color: Colors.darkGray },
  typeBtnTextActive: { color: Colors.white },
  imagesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  thumbWrap: { position: 'relative' },
  thumb: { width: 80, height: 80, borderRadius: 12 },
  removeThumb: { position: 'absolute', top: 4, right: 4, width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.error, alignItems: 'center', justifyContent: 'center' },
  addThumb: { width: 80, height: 80, borderRadius: 12, borderWidth: 2, borderColor: Colors.primary, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  agentImgWrap: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  agentImg: { width: 60, height: 60, borderRadius: 30 },
  removeAgentImg: { padding: 8 },
  uploadAgentBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: Colors.lightGray, borderStyle: 'dashed', marginBottom: 12 },
  uploadAgentText: { fontSize: 14, color: Colors.primary, fontWeight: '700' },
  formActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: Colors.lightGray, alignItems: 'center' },
  cancelBtnText: { fontWeight: '700', color: Colors.darkGray },
  saveBtn: { flex: 2, paddingVertical: 12, borderRadius: 12, backgroundColor: Colors.primary, alignItems: 'center' },
  saveBtnText: { fontWeight: '800', color: Colors.white, fontSize: 16 },
  loader: { marginTop: 32 },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyText: { fontSize: 15, color: Colors.mediumGray },
  itemCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: Colors.lightGray },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '800', color: Colors.black, textAlign: 'right' },
  itemSub: { fontSize: 12, color: Colors.mediumGray, textAlign: 'right' },
  editBtn: { padding: 10 },
  deleteBtn: { padding: 10 },
});
