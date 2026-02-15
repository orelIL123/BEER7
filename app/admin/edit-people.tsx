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

type Person = {
  id: string;
  name: string;
  role: string;
  shortBio: string;
  image: string;
  order: number;
};

const EMPTY: Omit<Person, 'id'> = { name: '', role: '', shortBio: '', image: '', order: 0 };

export default function EditPeopleScreen() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isAdmin = isAdminPhone(user?.phoneNumber ?? undefined);

  const [list, setList] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Person | null>(null);
  const [form, setForm] = useState<Omit<Person, 'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[EditPeople] isAdmin:', isAdmin, 'phone:', user?.phoneNumber);
    if (isAdmin) loadPeople();
    else setLoading(false);
  }, [isAdmin]);

  async function loadPeople() {
    setLoading(true);
    setError(null);
    try {
      // No orderBy to avoid index errors on empty collections
      const snap = await getDocs(query(collection(db, 'persons')));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Person));
      data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      console.log('[EditPeople] loaded', data.length, 'persons');
      setList(data);
    } catch (e: any) {
      const msg = e?.message ?? String(e);
      console.error('[EditPeople] loadPeople error:', msg, e);
      setError(msg);
      showToast('שגיאה: ' + msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  function startEdit(p: Person) {
    setEditing(p);
    setForm({ name: p.name, role: p.role, shortBio: p.shortBio, image: p.image, order: p.order });
  }

  function startNew() {
    setEditing({ id: '__new__', ...EMPTY });
    setForm({ ...EMPTY, order: list.length });
  }

  async function save() {
    if (!form.name.trim()) { showToast('חובה להזין שם', 'error'); return; }
    setSaving(true);
    try {
      if (editing?.id === '__new__') {
        const ref = await addDoc(collection(db, 'persons'), form);
        console.log('[EditPeople] added', ref.id);
        showToast('נוסף בהצלחה ✓', 'success');
      } else if (editing) {
        await updateDoc(doc(db, 'persons', editing.id), { ...form });
        console.log('[EditPeople] updated', editing.id);
        showToast('עודכן ✓', 'success');
      }
      setEditing(null);
      loadPeople();
    } catch (e: any) {
      const msg = e?.message ?? String(e);
      console.error('[EditPeople] save error:', msg, e);
      showToast('שגיאת שמירה: ' + msg, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    Alert.alert('מחיקה', 'למחוק את האיש?', [
      { text: 'ביטול', style: 'cancel' },
      {
        text: 'מחק', style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'persons', id));
            console.log('[EditPeople] deleted', id);
            showToast('נמחק', 'info');
            loadPeople();
          } catch (e: any) {
            console.error('[EditPeople] delete error:', e?.message, e);
            showToast('שגיאת מחיקה: ' + (e?.message ?? ''), 'error');
          }
        },
      },
    ]);
  }

  if (!isAdmin) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Stack.Screen options={{ title: 'עריכת אנשים' }} />
        <Ionicons name="lock-closed" size={48} color={Colors.error} />
        <Text style={styles.msg}>אין הרשאה</Text>
        <Text style={styles.msgSub} selectable>{user?.phoneNumber ?? 'לא מחובר'}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'עריכת אנשים', headerBackTitle: 'חזרה', headerTintColor: Colors.primary }} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <TouchableOpacity style={styles.addBtn} onPress={startNew} activeOpacity={0.8}>
            <Ionicons name="add-circle" size={20} color={Colors.white} />
            <Text style={styles.addBtnText}>הוסף איש חדש</Text>
          </TouchableOpacity>

          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={Colors.error} />
              <Text style={styles.errorText} selectable>{error}</Text>
            </View>
          )}

          {editing && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>{editing.id === '__new__' ? 'איש חדש' : 'עריכה'}</Text>
              {([
                ['name', 'שם'],
                ['role', 'תפקיד'],
                ['shortBio', 'ביוגרפיה קצרה'],
                ['image', 'קישור תמונה (URL)'],
              ] as [keyof typeof form, string][]).map(([field, label]) => (
                <View key={field} style={styles.fieldWrap}>
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                    style={[styles.input, field === 'shortBio' && styles.inputMulti]}
                    value={String(form[field])}
                    onChangeText={(v) => setForm((f) => ({ ...f, [field]: v }))}
                    multiline={field === 'shortBio'}
                    textAlign="right"
                    placeholderTextColor={Colors.mediumGray}
                  />
                </View>
              ))}
              <View style={styles.fieldWrap}>
                <Text style={styles.label}>סדר תצוגה</Text>
                <TextInput
                  style={styles.input}
                  value={String(form.order)}
                  onChangeText={(v) => setForm((f) => ({ ...f, order: parseInt(v) || 0 }))}
                  keyboardType="number-pad"
                  textAlign="right"
                />
              </View>
              <View style={styles.formActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(null)}>
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
              <Ionicons name="people-outline" size={48} color={Colors.mediumGray} />
              <Text style={styles.emptyText}>אין אנשים עדיין. לחץ הוסף.</Text>
            </View>
          ) : (
            list.map((p) => (
              <View key={p.id} style={styles.itemCard}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{p.name}</Text>
                  <Text style={styles.itemSub}>{p.role}</Text>
                </View>
                <TouchableOpacity style={styles.editBtn} onPress={() => startEdit(p)}>
                  <Ionicons name="pencil" size={18} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => remove(p.id)}>
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
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.success, paddingVertical: 14, borderRadius: 16, marginBottom: 16 },
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
  formActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: Colors.lightGray, alignItems: 'center' },
  cancelBtnText: { fontWeight: '700', color: Colors.darkGray },
  saveBtn: { flex: 2, paddingVertical: 12, borderRadius: 12, backgroundColor: Colors.primary, alignItems: 'center' },
  saveBtnText: { fontWeight: '800', color: Colors.white, fontSize: 16 },
  itemCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: Colors.lightGray },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '800', color: Colors.black, textAlign: 'right' },
  itemSub: { fontSize: 13, color: Colors.mediumGray, textAlign: 'right' },
  editBtn: { padding: 10 },
  deleteBtn: { padding: 10 },
});
