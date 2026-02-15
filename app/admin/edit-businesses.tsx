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

type Business = {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  description: string;
  image: string;
  website: string;
  hours: string;
};

const EMPTY: Omit<Business, 'id'> = { name: '', category: '', address: '', phone: '', description: '', image: '', website: '', hours: '' };

const CATEGORIES = ['מזון ומסעדות', 'בריאות', 'אופנה', 'טכנולוגיה', 'שירותים', 'חינוך', 'ספורט', 'בידור', 'אחר'];

export default function EditBusinessesScreen() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isAdmin = isAdminPhone(user?.phoneNumber ?? undefined);
  const [list, setList] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Business | null>(null);
  const [form, setForm] = useState<Omit<Business, 'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[EditBusinesses] isAdmin:', isAdmin, 'phone:', user?.phoneNumber);
    if (isAdmin) load();
    else setLoading(false);
  }, [isAdmin]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const snap = await getDocs(query(collection(db, 'businesses')));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Business));
      data.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
      console.log('[EditBusinesses] loaded', data.length, 'items');
      setList(data);
    } catch (e: any) {
      const msg = e?.message ?? String(e);
      console.error('[EditBusinesses] load error:', msg, e);
      setError(msg);
      showToast('שגיאה: ' + msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  function f(field: keyof typeof form, v: string) { setForm((p) => ({ ...p, [field]: v })); }

  async function save() {
    if (!form.name.trim()) { showToast('חובה שם עסק', 'error'); return; }
    setSaving(true);
    try {
      if (editing?.id === '__new__') await addDoc(collection(db, 'businesses'), form);
      else if (editing) await updateDoc(doc(db, 'businesses', editing.id), { ...form });
      showToast('נשמר', 'success');
      setEditing(null);
      load();
    } catch (e: any) {
      const msg = e?.message ?? String(e);
      console.error('[EditBusinesses] save error:', msg, e);
      setError(msg);
      showToast('שגיאה: ' + msg, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    Alert.alert('מחיקה', 'למחוק עסק?', [
      { text: 'ביטול', style: 'cancel' },
      {
        text: 'מחק', style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'businesses', id));
            showToast('נמחק', 'info');
            load();
          } catch (e: any) {
            const msg = e?.message ?? String(e);
            console.error('[EditBusinesses] delete error:', msg, e);
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
        <Stack.Screen options={{ title: 'עריכת עסקים' }} />
        <Ionicons name="lock-closed" size={48} color={Colors.error} />
        <Text style={styles.msg}>אין הרשאה</Text>
        <Text style={styles.msgSub} selectable>{user?.phoneNumber ?? 'לא מחובר'}</Text>
      </View>
    );
  }

  const fields: [keyof Omit<Business, 'id'>, string][] = [
    ['name', 'שם העסק'],
    ['address', 'כתובת'],
    ['phone', 'טלפון'],
    ['hours', 'שעות פעילות'],
    ['website', 'אתר אינטרנט'],
    ['image', 'קישור תמונה (URL)'],
    ['description', 'תיאור'],
  ];

  return (
    <>
      <Stack.Screen options={{ title: 'עריכת עסקים', headerBackTitle: 'חזרה', headerTintColor: Colors.primary }} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <TouchableOpacity style={styles.addBtn} onPress={() => { setEditing({ id: '__new__', ...EMPTY }); setForm(EMPTY); }}>
            <Ionicons name="add-circle" size={20} color={Colors.white} />
            <Text style={styles.addBtnText}>הוסף עסק חדש</Text>
          </TouchableOpacity>

          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={Colors.error} />
              <Text style={styles.errorText} selectable>{error}</Text>
            </View>
          )}

          {editing && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>{editing.id === '__new__' ? 'עסק חדש' : 'עריכה'}</Text>

              <Text style={styles.label}>קטגוריה</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity key={cat} style={[styles.catChip, form.category === cat && styles.catChipActive]} onPress={() => f('category', cat)}>
                    <Text style={[styles.catChipText, form.category === cat && styles.catChipTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {fields.map(([field, label]) => (
                <View key={field} style={styles.fieldWrap}>
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                    style={[styles.input, field === 'description' && styles.inputMulti]}
                    value={form[field]}
                    onChangeText={(v) => f(field, v)}
                    multiline={field === 'description'}
                    keyboardType={field === 'phone' ? 'phone-pad' : 'default'}
                    textAlign="right"
                    placeholderTextColor={Colors.mediumGray}
                  />
                </View>
              ))}

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
              <Ionicons name="storefront-outline" size={48} color={Colors.mediumGray} />
              <Text style={styles.emptyText}>אין עסקים עדיין. לחץ הוסף.</Text>
            </View>
          ) : (
            list.map((b) => (
              <View key={b.id} style={styles.itemCard}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{b.name}</Text>
                  <Text style={styles.itemSub}>{b.category} • {b.address}</Text>
                </View>
                <TouchableOpacity style={styles.editBtn} onPress={() => { setEditing(b); setForm({ name: b.name, category: b.category, address: b.address, phone: b.phone, description: b.description, image: b.image, website: b.website, hours: b.hours }); }}>
                  <Ionicons name="pencil" size={18} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => remove(b.id)}>
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
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.blue, paddingVertical: 14, borderRadius: 16, marginBottom: 16 },
  addBtnText: { color: Colors.white, fontWeight: '800', fontSize: 15 },
  loader: { marginTop: 32 },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyText: { fontSize: 15, color: Colors.mediumGray },
  errorBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: Colors.error + '15', borderRadius: 12, padding: 12, marginBottom: 12 },
  errorText: { flex: 1, fontSize: 12, color: Colors.error, lineHeight: 18 },
  formCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.lightGray },
  formTitle: { fontSize: 18, fontWeight: '900', color: Colors.black, marginBottom: 12, textAlign: 'right' },
  catScroll: { marginBottom: 16 },
  catChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: Colors.lightGray, marginRight: 8 },
  catChipActive: { backgroundColor: Colors.blue, borderColor: Colors.blue },
  catChipText: { fontSize: 13, color: Colors.darkGray, fontWeight: '600' },
  catChipTextActive: { color: Colors.white },
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
  itemSub: { fontSize: 12, color: Colors.mediumGray, textAlign: 'right' },
  editBtn: { padding: 10 },
  deleteBtn: { padding: 10 },
});
