import { isAdminPhone } from '@/constants/admin';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { db } from '@/lib/firebase';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';

type AppEvent = {
  id: string;
  title: string;
  date: string;
  place: string;
  description: string;
  image: string;
  kind: string;
  isMembersOnly: boolean;
  isFeatured: boolean;
};

const EMPTY: Omit<AppEvent, 'id'> = { title: '', date: '', place: '', description: '', image: '', kind: 'event', isMembersOnly: false, isFeatured: false };

export default function EditEventsScreen() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isAdmin = isAdminPhone(user?.phoneNumber ?? undefined);
  const [list, setList] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AppEvent | null>(null);
  const [form, setForm] = useState<Omit<AppEvent, 'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[EditEvents] isAdmin:', isAdmin, 'phone:', user?.phoneNumber);
    if (isAdmin) load();
    else setLoading(false);
  }, [isAdmin]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const snap = await getDocs(query(collection(db, 'events')));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AppEvent));
      data.sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''));
      console.log('[EditEvents] loaded', data.length, 'items');
      setList(data);
    } catch (e: any) {
      const msg = e?.message ?? String(e);
      console.error('[EditEvents] load error:', msg, e);
      setError(msg);
      showToast('שגיאה: ' + msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  function f(field: keyof typeof form, v: string | boolean) { setForm((prev) => ({ ...prev, [field]: v })); }

  async function save() {
    if (!form.title.trim() || !form.date.trim()) { showToast('חובה כותרת ותאריך', 'error'); return; }
    setSaving(true);
    try {
      if (editing?.id === '__new__') await addDoc(collection(db, 'events'), form);
      else if (editing) await updateDoc(doc(db, 'events', editing.id), { ...form });
      showToast('נשמר', 'success');
      setEditing(null);
      load();
    } catch (e: any) {
      const msg = e?.message ?? String(e);
      console.error('[EditEvents] save error:', msg, e);
      setError(msg);
      showToast('שגיאה: ' + msg, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    Alert.alert('מחיקה', 'למחוק את האירוע?', [
      { text: 'ביטול', style: 'cancel' },
      {
        text: 'מחק', style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'events', id));
            showToast('נמחק', 'info');
            load();
          } catch (e: any) {
            const msg = e?.message ?? String(e);
            console.error('[EditEvents] delete error:', msg, e);
            setError(msg);
            showToast('שגיאה: ' + msg, 'error');
          }
        },
      },
    ]);
  }

  if (!isAdmin) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Stack.Screen options={{ title: 'עריכת אירועים' }} />
        <Ionicons name="lock-closed" size={48} color={Colors.error} />
        <Text style={styles.msg}>אין הרשאה</Text>
        <Text style={styles.msgSub} selectable>{user?.phoneNumber ?? 'לא מחובר'}</Text>
      </View>
    );
  }

  const kindOptions = [{ label: 'אירוע', value: 'event' }, { label: 'פתיחת עסק', value: 'business_opening' }, { label: 'לייב', value: 'live' }];

  return (
    <>
      <Stack.Screen options={{ title: 'עריכת אירועים', headerBackTitle: 'חזרה', headerTintColor: Colors.primary }} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <TouchableOpacity style={styles.addBtn} onPress={() => { setEditing({ id: '__new__', ...EMPTY }); setForm(EMPTY); }}>
            <Ionicons name="add-circle" size={20} color={Colors.white} />
            <Text style={styles.addBtnText}>הוסף אירוע חדש</Text>
          </TouchableOpacity>

          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={Colors.error} />
              <Text style={styles.errorText} selectable>{error}</Text>
            </View>
          )}

          {editing && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>{editing.id === '__new__' ? 'אירוע חדש' : 'עריכה'}</Text>

              {([['title', 'כותרת'], ['date', 'תאריך (למשל: 15 ביוני)'], ['place', 'מיקום'], ['image', 'קישור תמונה (URL)'], ['description', 'תיאור']] as [keyof typeof form, string][]).map(([field, label]) => (
                <View key={field} style={styles.fieldWrap}>
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                    style={[styles.input, field === 'description' && styles.inputMulti]}
                    value={String(form[field])}
                    onChangeText={(v) => f(field, v)}
                    multiline={field === 'description'}
                    textAlign="right"
                    placeholderTextColor={Colors.mediumGray}
                  />
                </View>
              ))}

              <Text style={styles.label}>סוג אירוע</Text>
              <View style={styles.optionsRow}>
                {kindOptions.map((o) => (
                  <TouchableOpacity key={o.value} style={[styles.optionChip, form.kind === o.value && styles.optionChipActive]} onPress={() => f('kind', o.value)}>
                    <Text style={[styles.optionChipText, form.kind === o.value && styles.optionChipTextActive]}>{o.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.toggleRow}>
                <TouchableOpacity style={[styles.toggle, form.isFeatured && styles.toggleActive]} onPress={() => f('isFeatured', !form.isFeatured)}>
                  <Text style={[styles.toggleText, form.isFeatured && styles.toggleTextActive]}>אירוע מרכזי</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.toggle, form.isMembersOnly && styles.toggleActive]} onPress={() => f('isMembersOnly', !form.isMembersOnly)}>
                  <Text style={[styles.toggleText, form.isMembersOnly && styles.toggleTextActive]}>לחברים בלבד</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(null)}><Text style={styles.cancelBtnText}>ביטול</Text></TouchableOpacity>
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
              <Ionicons name="calendar-outline" size={48} color={Colors.mediumGray} />
              <Text style={styles.emptyText}>אין אירועים עדיין. לחץ הוסף.</Text>
            </View>
          ) : (
            list.map((e) => (
              <View key={e.id} style={styles.itemCard}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{e.title}</Text>
                  <Text style={styles.itemSub}>{e.date} • {e.place}</Text>
                </View>
                <TouchableOpacity style={styles.editBtn} onPress={() => { setEditing(e); setForm({ title: e.title, date: e.date, place: e.place, description: e.description, image: e.image, kind: e.kind, isMembersOnly: e.isMembersOnly, isFeatured: e.isFeatured }); }}>
                  <Ionicons name="pencil" size={18} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => remove(e.id)}>
                  <Ionicons name="trash" size={18} color={Colors.error} />
                </TouchableOpacity>
              </View>
            ))
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  content: { padding: 16 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  msg: { fontSize: 18, fontWeight: '700', color: Colors.darkGray },
  msgSub: { fontSize: 13, color: Colors.mediumGray },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.accent, paddingVertical: 14, borderRadius: 16, marginBottom: 16 },
  addBtnText: { color: Colors.white, fontWeight: '800', fontSize: 15 },
  loader: { marginTop: 32 },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyText: { fontSize: 15, color: Colors.mediumGray },
  errorBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: Colors.error + '15', borderRadius: 12, padding: 12, marginBottom: 12 },
  errorText: { flex: 1, fontSize: 12, color: Colors.error, lineHeight: 18 },
  formCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.lightGray },
  formTitle: { fontSize: 18, fontWeight: '900', color: Colors.black, marginBottom: 16, textAlign: 'right' },
  fieldWrap: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '700', color: Colors.darkGray, marginBottom: 6, textAlign: 'right' },
  input: { backgroundColor: Colors.offWhite, borderRadius: 12, borderWidth: 1, borderColor: Colors.lightGray, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: Colors.black },
  inputMulti: { minHeight: 80, textAlignVertical: 'top' },
  optionsRow: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  optionChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: Colors.lightGray },
  optionChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  optionChipText: { fontSize: 13, color: Colors.darkGray, fontWeight: '600' },
  optionChipTextActive: { color: Colors.white },
  toggleRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  toggle: { flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: Colors.lightGray, alignItems: 'center' },
  toggleActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  toggleText: { fontSize: 13, fontWeight: '700', color: Colors.darkGray },
  toggleTextActive: { color: Colors.white },
  formActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: Colors.lightGray, alignItems: 'center' },
  cancelBtnText: { fontWeight: '700', color: Colors.darkGray },
  saveBtn: { flex: 2, paddingVertical: 12, borderRadius: 12, backgroundColor: Colors.primary, alignItems: 'center' },
  saveBtnText: { fontWeight: '800', color: Colors.white, fontSize: 16 },
  itemCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: Colors.lightGray },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '800', color: Colors.black, textAlign: 'right' },
  itemSub: { fontSize: 12, color: Colors.mediumGray, textAlign: 'right' },
  editBtn: { padding: 10 },
  deleteBtn: { padding: 10 },
});
