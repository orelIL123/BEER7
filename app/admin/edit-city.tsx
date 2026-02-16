import { isAdminPhone } from '@/constants/admin';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { db } from '@/lib/firebase';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View,
} from 'react-native';

type CityConfig = {
  name: string;
  fullName: string;
  description: string;
  population: string;
  founded: string;
  mayor: string;
  website: string;
  facebook: string;
  instagram: string;
  parashaName: string;
  parashaDate: string;
  parashaDescription: string;
  featuredEventTitle: string;
  featuredEventSubtitle: string;
  featuredEventDate: string;
  featuredEventPlace: string;
  featuredEventImage: string;
  featuredEventKind: string;
};

const EMPTY: CityConfig = {
  name: 'באר שבע', fullName: 'עיריית באר שבע', description: '', population: '', founded: '', mayor: '',
  website: '', facebook: '', instagram: '',
  parashaName: '', parashaDate: '', parashaDescription: '',
  featuredEventTitle: '', featuredEventSubtitle: '', featuredEventDate: '', featuredEventPlace: '', featuredEventImage: '', featuredEventKind: 'event',
};

const DOC_ID = 'main';

export default function EditCityScreen() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isAdmin = isAdminPhone(user?.phoneNumber ?? undefined);
  const [form, setForm] = useState<CityConfig>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[EditCity] isAdmin:', isAdmin, 'phone:', user?.phoneNumber);
    if (isAdmin) load();
    else setLoading(false);
  }, [isAdmin]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const snap = await getDoc(doc(db, 'cityConfig', DOC_ID));
      if (snap.exists()) setForm({ ...EMPTY, ...snap.data() as CityConfig });
      console.log('[EditCity] loaded', snap.exists() ? 1 : 0, 'items');
    } catch (e: any) {
      const msg = e?.message ?? String(e);
      console.error('[EditCity] load error:', msg, e);
      setError(msg);
      showToast('שגיאה: ' + msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  function f(field: keyof CityConfig, v: string) { setForm((p) => ({ ...p, [field]: v })); }

  async function save() {
    setSaving(true);
    try {
      await setDoc(doc(db, 'cityConfig', DOC_ID), form);
      showToast('נשמר בהצלחה', 'success');
    } catch (e: any) {
      const msg = e?.message ?? String(e);
      console.error('[EditCity] save error:', msg, e);
      setError(msg);
      showToast('שגיאה: ' + msg, 'error');
    } finally {
      setSaving(false);
    }
  }

  if (!isAdmin) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Stack.Screen options={{ title: 'עריכת מידע עיר' }} />
        <Ionicons name="lock-closed" size={48} color={Colors.error} />
        <Text style={styles.msg}>אין הרשאה</Text>
        <Text style={styles.msgSub} selectable>{user?.phoneNumber ?? 'לא מחובר'}</Text>
      </View>
    );
  }

  const sections: { title: string; fields: [keyof CityConfig, string, boolean?][] }[] = [
    {
      title: 'פרטי העיר',
      fields: [
        ['name', 'שם קצר (באר שבע)'],
        ['fullName', 'שם מלא (עיריית באר שבע)'],
        ['description', 'תיאור קצר', true],
        ['population', 'אוכלוסיה'],
        ['founded', 'שנת ייסוד'],
        ['mayor', 'ראש העיר'],
        ['website', 'אתר רשמי'],
        ['facebook', 'Facebook URL'],
        ['instagram', 'Instagram URL'],
      ],
    },
    {
      title: 'פרשת השבוע',
      fields: [
        ['parashaName', 'שם הפרשה'],
        ['parashaDate', 'תאריך/שבת'],
        ['parashaDescription', 'תיאור קצר', true],
      ],
    },
    {
      title: 'אירוע מרכזי (דף הבית)',
      fields: [
        ['featuredEventTitle', 'כותרת'],
        ['featuredEventSubtitle', 'תת-כותרת'],
        ['featuredEventDate', 'תאריך'],
        ['featuredEventPlace', 'מיקום'],
        ['featuredEventImage', 'קישור תמונה (URL)'],
        ['featuredEventKind', 'סוג (event / business_opening / live)'],
      ],
    },
  ];

  if (loading) return (
    <View style={[styles.container, styles.centered]}>
      <Stack.Screen options={{ title: 'עריכת מידע עיר', headerTintColor: Colors.primary }} />
      <ActivityIndicator color={Colors.primary} size="large" />
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ title: 'עריכת מידע עיר', headerBackTitle: 'חזרה', headerTintColor: Colors.primary }} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={Colors.error} />
              <Text style={styles.errorText} selectable>{error}</Text>
            </View>
          )}

          {sections.map((sec) => (
            <View key={sec.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{sec.title}</Text>
              {sec.fields.map(([field, label, multi]) => (
                <View key={field} style={styles.fieldWrap}>
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                    style={[styles.input, multi && styles.inputMulti]}
                    value={form[field]}
                    onChangeText={(v) => f(field, v)}
                    multiline={!!multi}
                    textAlign="right"
                    placeholderTextColor={Colors.mediumGray}
                  />
                </View>
              ))}
            </View>
          ))}

          <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={saving}>
            {saving ? <ActivityIndicator color={Colors.white} size="small" /> : (
              <>
                <Ionicons name="save" size={20} color={Colors.white} />
                <Text style={styles.saveBtnText}>שמור הכל</Text>
              </>
            )}
          </TouchableOpacity>
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
  msgSub: { fontSize: 13, color: Colors.mediumGray },
  errorBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: Colors.error + '15', borderRadius: 12, padding: 12, marginBottom: 12 },
  errorText: { flex: 1, fontSize: 12, color: Colors.error, lineHeight: 18 },
  section: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.lightGray },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: Colors.primary, marginBottom: 16, textAlign: 'right' },
  fieldWrap: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '700', color: Colors.darkGray, marginBottom: 6, textAlign: 'right' },
  input: { backgroundColor: Colors.offWhite, borderRadius: 12, borderWidth: 1, borderColor: Colors.lightGray, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: Colors.black },
  inputMulti: { minHeight: 80, textAlignVertical: 'top' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: 16 },
  saveBtnText: { color: Colors.white, fontWeight: '800', fontSize: 17 },
});
