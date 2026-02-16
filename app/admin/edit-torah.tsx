import { isAdminPhone } from '@/constants/admin';
import Colors from '@/constants/Colors';
import type { DvarTorah } from '@/constants/Types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  createDvarTorah,
  deleteDvarTorah,
  getDvarTorahList,
  getShabbatTimes,
  saveShabbatTimes,
  updateDvarTorah,
  uploadTorahImage,
} from '@/lib/torah';
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
  content: string;
  type: 'daily' | 'weekly';
  date: string;
  author: string;
  authorImage: string;
  videoUrl: string;
};

const EMPTY_FORM: FormData = {
  title: '',
  content: '',
  type: 'daily',
  date: new Date().toISOString().slice(0, 10),
  author: '',
  authorImage: '',
  videoUrl: '',
};

export default function EditTorahScreen() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isAdmin = isAdminPhone(user?.phoneNumber ?? undefined);
  const [list, setList] = useState<DvarTorah[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<DvarTorah | { id: '__new__' } | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [shabbatCandle, setShabbatCandle] = useState('');
  const [shabbatHavdalah, setShabbatHavdalah] = useState('');
  const [savingShabbat, setSavingShabbat] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) load();
    else setLoading(false);
  }, [isAdmin]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [dvarim, shabbat] = await Promise.all([getDvarTorahList(), getShabbatTimes()]);
      setList(dvarim);
      setShabbatCandle(shabbat?.candleLighting ?? '');
      setShabbatHavdalah(shabbat?.havdalah ?? '');
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

  async function pickAuthorImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showToast('נדרשת הרשאת גישה לתמונות', 'error');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;
    setUploadingImg(true);
    try {
      const url = await uploadTorahImage(result.assets[0].uri);
      f('authorImage', url);
    } catch (e: any) {
      showToast(e?.message ?? 'שגיאה בהעלאה', 'error');
    } finally {
      setUploadingImg(false);
    }
  }

  async function save() {
    if (!form.title.trim() || !form.content.trim()) {
      showToast('חובה כותרת ותוכן', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        type: form.type,
        date: form.date,
        author: form.author.trim() || undefined,
        authorImage: form.authorImage || undefined,
        videoUrl: form.videoUrl.trim() || undefined,
      };
      if (editing && editing.id !== '__new__') {
        await updateDvarTorah(editing.id, payload);
      } else {
        await createDvarTorah(payload);
      }
      showToast('נשמר', 'success');
      setEditing(null);
      setForm(EMPTY_FORM);
      load();
    } catch (e: any) {
      const msg = e?.message ?? String(e);
      setError(msg);
      showToast('שגיאה: ' + msg, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function saveShabbat() {
    setSavingShabbat(true);
    try {
      await saveShabbatTimes({ candleLighting: shabbatCandle.trim(), havdalah: shabbatHavdalah.trim() });
      showToast('שעות שבת נשמרו', 'success');
    } catch (e: any) {
      showToast(e?.message ?? 'שגיאה', 'error');
    } finally {
      setSavingShabbat(false);
    }
  }

  async function remove(id: string) {
    Alert.alert('מחיקה', 'למחוק דבר תורה?', [
      { text: 'ביטול', style: 'cancel' },
      {
        text: 'מחק',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDvarTorah(id);
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
        <Stack.Screen options={{ title: 'עריכת תוכן תורני' }} />
        <Ionicons name="lock-closed" size={48} color={Colors.error} />
        <Text style={styles.msg}>אין הרשאה</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'עריכת תוכן תורני' }} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {error && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color={Colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>שעות כניסת שבת (יום שישי)</Text>
              <Text style={styles.label}>הדלקת נרות</Text>
              <TextInput
                style={styles.input}
                value={shabbatCandle}
                onChangeText={setShabbatCandle}
                placeholder="לדוגמה: 17:45"
                placeholderTextColor={Colors.mediumGray}
                textAlign="right"
              />
              <Text style={styles.label}>הבדלה</Text>
              <TextInput
                style={styles.input}
                value={shabbatHavdalah}
                onChangeText={setShabbatHavdalah}
                placeholder="לדוגמה: 19:02"
                placeholderTextColor={Colors.mediumGray}
                textAlign="right"
              />
              <TouchableOpacity style={styles.saveShabbatBtn} onPress={saveShabbat} disabled={savingShabbat}>
                {savingShabbat ? <ActivityIndicator color={Colors.white} size="small" /> : <Text style={styles.saveShabbatText}>שמור שעות שבת</Text>}
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addBtn} onPress={() => { setEditing({ id: '__new__' }); setForm(EMPTY_FORM); }}>
              <Ionicons name="add-circle" size={20} color={Colors.white} />
              <Text style={styles.addBtnText}>הוסף דבר תורה</Text>
            </TouchableOpacity>

            {editing && (
              <View style={styles.formCard}>
                <Text style={styles.formTitle}>דבר תורה</Text>
                <Text style={styles.label}>כותרת *</Text>
                <TextInput style={styles.input} value={form.title} onChangeText={(v) => f('title', v)} placeholder="כותרת" placeholderTextColor={Colors.mediumGray} textAlign="right" />
                <Text style={styles.label}>תוכן *</Text>
                <TextInput style={[styles.input, styles.inputMulti]} value={form.content} onChangeText={(v) => f('content', v)} placeholder="תוכן" placeholderTextColor={Colors.mediumGray} multiline textAlign="right" />
                <Text style={styles.label}>סוג</Text>
                <View style={styles.typeRow}>
                  <TouchableOpacity style={[styles.typeBtn, form.type === 'daily' && styles.typeBtnActive]} onPress={() => f('type', 'daily')}>
                    <Text style={[styles.typeBtnText, form.type === 'daily' && styles.typeBtnTextActive]}>יומי</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.typeBtn, form.type === 'weekly' && styles.typeBtnActive]} onPress={() => f('type', 'weekly')}>
                    <Text style={[styles.typeBtnText, form.type === 'weekly' && styles.typeBtnTextActive]}>שבועי</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.label}>תאריך</Text>
                <TextInput style={styles.input} value={form.date} onChangeText={(v) => f('date', v)} placeholder="YYYY-MM-DD" placeholderTextColor={Colors.mediumGray} textAlign="right" />
                <Text style={styles.label}>מחבר</Text>
                <TextInput style={styles.input} value={form.author} onChangeText={(v) => f('author', v)} placeholder="שם המחבר" placeholderTextColor={Colors.mediumGray} textAlign="right" />
                <Text style={styles.label}>תמונת מחבר</Text>
                {form.authorImage ? (
                  <View style={styles.authorImgWrap}>
                    <ExpoImage source={{ uri: form.authorImage }} style={styles.authorImg} />
                    <TouchableOpacity style={styles.removeAuthorImg} onPress={() => f('authorImage', '')}>
                      <Ionicons name="trash" size={18} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.uploadAuthorBtn} onPress={pickAuthorImage} disabled={uploadingImg}>
                    <Ionicons name="image-outline" size={24} color={Colors.primary} />
                    <Text style={styles.uploadAuthorText}>העלה תמונת מחבר</Text>
                  </TouchableOpacity>
                )}
                <Text style={styles.label}>קישור לסרטון YouTube (אופציונלי)</Text>
                <TextInput style={styles.input} value={form.videoUrl} onChangeText={(v) => f('videoUrl', v)} placeholder="https://youtube.com/..." placeholderTextColor={Colors.mediumGray} keyboardType="url" autoCapitalize="none" textAlign="right" />
                <View style={styles.formActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => { setEditing(null); setForm(EMPTY_FORM); }}>
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
                <Ionicons name="book-outline" size={48} color={Colors.mediumGray} />
                <Text style={styles.emptyText}>אין דברי תורה. לחץ הוסף.</Text>
              </View>
            ) : (
              list.map((item) => (
                <View key={item.id} style={styles.itemCard}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.title}</Text>
                    <Text style={styles.itemSub}>{item.type === 'daily' ? 'יומי' : 'שבועי'} • {item.date}</Text>
                  </View>
                  <TouchableOpacity style={styles.editBtn} onPress={() => { setEditing(item); setForm({ title: item.title, content: item.content, type: item.type, date: item.date.slice(0, 10), author: item.author ?? '', authorImage: item.authorImage ?? '', videoUrl: item.videoUrl ?? '' }); }}>
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
  section: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.lightGray },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: Colors.primary, marginBottom: 12, textAlign: 'right' },
  label: { fontSize: 13, fontWeight: '700', color: Colors.darkGray, marginBottom: 6, textAlign: 'right' },
  input: { backgroundColor: Colors.offWhite, borderRadius: 12, borderWidth: 1, borderColor: Colors.lightGray, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: Colors.black, marginBottom: 12 },
  inputMulti: { minHeight: 100, textAlignVertical: 'top' },
  saveShabbatBtn: { backgroundColor: Colors.accent, paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  saveShabbatText: { color: Colors.white, fontWeight: '800', fontSize: 15 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.primary, paddingVertical: 14, borderRadius: 16, marginBottom: 16 },
  addBtnText: { color: Colors.white, fontWeight: '800', fontSize: 15 },
  formCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.lightGray },
  formTitle: { fontSize: 18, fontWeight: '900', color: Colors.black, marginBottom: 12, textAlign: 'right' },
  typeRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  typeBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: Colors.lightGray, alignItems: 'center' },
  typeBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeBtnText: { fontSize: 15, fontWeight: '700', color: Colors.darkGray },
  typeBtnTextActive: { color: Colors.white },
  authorImgWrap: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  authorImg: { width: 56, height: 56, borderRadius: 28 },
  removeAuthorImg: { padding: 8 },
  uploadAuthorBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: Colors.lightGray, borderStyle: 'dashed', marginBottom: 12 },
  uploadAuthorText: { fontSize: 14, color: Colors.primary, fontWeight: '700' },
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
