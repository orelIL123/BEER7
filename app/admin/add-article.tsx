import { isAdminPhone } from '@/constants/admin';
import Colors from '@/constants/Colors';
import type { NewsArticle } from '@/constants/Types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { addArticleAsAdmin } from '@/lib/articles';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const CATEGORIES: { id: NewsArticle['category']; label: string }[] = [
  { id: 'news', label: 'חדשות' },
  { id: 'culture', label: 'תרבות' },
  { id: 'events', label: 'אירועים' },
  { id: 'business', label: 'עסקים' },
  { id: 'community', label: 'קהילה' },
];

export default function AdminAddArticleScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState<NewsArticle['category']>('news');
  const [businessId, setBusinessId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isAdmin = user ? isAdminPhone(user.phoneNumber ?? undefined) : false;

  if (!user) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'הוספת כתבה' }} />
        <View style={styles.centered}><Text style={styles.msg}>יש להתחבר.</Text>
          <TouchableOpacity style={styles.btn} onPress={() => router.replace('/auth')}><Text style={styles.btnText}>התחבר</Text></TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'הוספת כתבה' }} />
        <View style={styles.centered}><Text style={styles.msg}>אין הרשאה.</Text>
          <TouchableOpacity style={styles.btn} onPress={() => router.back()}><Text style={styles.btnText}>חזרה</Text></TouchableOpacity>
        </View>
      </View>
    );
  }

  async function handleSubmit() {
    const t = title.trim();
    const s = summary.trim();
    const c = content.trim();
    if (!t || !s || !c) {
      showToast('נא למלא כותרת, תקציר ותוכן', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await addArticleAsAdmin(user!.phoneNumber, {
        title: t,
        summary: s,
        content: c,
        image: image.trim() || 'bino',
        category,
        businessId: businessId.trim() || undefined,
      });
      showToast('הכתבה פורסמה', 'success');
      router.back();
    } catch (e: any) {
      showToast(e?.message ?? 'שגיאה', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: 'הוסף כתבה (אדמין)', headerBackTitle: 'חזרה', headerTintColor: Colors.primary }} />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.hint}>הכתבה תפורסם מיד.</Text>
          <Text style={styles.label}>כותרת *</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="כותרת" placeholderTextColor={Colors.mediumGray} />
          <Text style={styles.label}>תקציר *</Text>
          <TextInput style={[styles.input, styles.textArea]} value={summary} onChangeText={setSummary} placeholder="תקציר" placeholderTextColor={Colors.mediumGray} multiline numberOfLines={3} />
          <Text style={styles.label}>תוכן *</Text>
          <TextInput style={[styles.input, styles.textArea, styles.contentArea]} value={content} onChangeText={setContent} placeholder="תוכן" placeholderTextColor={Colors.mediumGray} multiline numberOfLines={6} />
          <Text style={styles.label}>קטגוריה</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat.id} style={[styles.categoryChip, category === cat.id && styles.categoryChipActive]} onPress={() => setCategory(cat.id)}>
                <Text style={[styles.categoryChipText, category === cat.id && styles.categoryChipTextActive]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.label}>קישור לתמונה (אופציונלי)</Text>
          <TextInput style={styles.input} value={image} onChangeText={setImage} placeholder="https://... או ריק לבינו" placeholderTextColor={Colors.mediumGray} keyboardType="url" autoCapitalize="none" />
          <Text style={styles.label}>מזהה עסק (אופציונלי, למשל bino)</Text>
          <TextInput style={styles.input} value={businessId} onChangeText={setBusinessId} placeholder="businessId" placeholderTextColor={Colors.mediumGray} autoCapitalize="none" />
          <TouchableOpacity style={[styles.submitBtn, submitting && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={submitting}>
            {submitting ? <ActivityIndicator color={Colors.white} /> : (<><Ionicons name="checkmark-circle" size={20} color={Colors.white} /><Text style={styles.submitBtnText}>פרסם כתבה</Text></>)}
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  msg: { fontSize: 16, color: Colors.darkGray },
  btn: { marginTop: 20, backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  btnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
  hint: { fontSize: 14, color: Colors.mediumGray, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', color: Colors.darkGray, marginBottom: 8 },
  input: { backgroundColor: Colors.white, borderRadius: 12, padding: 14, fontSize: 16, color: Colors.black, borderWidth: 1, borderColor: Colors.lightGray, marginBottom: 16 },
  textArea: { minHeight: 80, textAlignVertical: 'top' as const },
  contentArea: { minHeight: 160 },
  categoryScroll: { marginBottom: 16, marginHorizontal: -20, paddingHorizontal: 20 },
  categoryChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.lightGray, marginLeft: 8 },
  categoryChipActive: { backgroundColor: Colors.primary + '18', borderColor: Colors.primary },
  categoryChipText: { fontSize: 14, fontWeight: '600', color: Colors.mediumGray },
  categoryChipTextActive: { color: Colors.primary },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8, paddingVertical: 16, borderRadius: 16, backgroundColor: Colors.success },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { color: Colors.white, fontWeight: '800', fontSize: 16 },
});
