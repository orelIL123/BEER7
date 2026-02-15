import Colors from '@/constants/Colors';
import type { NewsArticle } from '@/constants/Types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { submitArticle } from '@/lib/articles';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const CATEGORIES: { id: NewsArticle['category']; label: string }[] = [
  { id: 'news', label: 'חדשות' },
  { id: 'culture', label: 'תרבות' },
  { id: 'events', label: 'אירועים' },
  { id: 'business', label: 'עסקים' },
  { id: 'community', label: 'קהילה' },
];

export default function SubmitArticleScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState<NewsArticle['category']>('news');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'הגשת כתבה' }} />
        <View style={styles.centered}>
          <Ionicons name="lock-closed-outline" size={64} color={Colors.mediumGray} />
          <Text style={styles.loginPrompt}>יש להתחבר כדי להגיש כתבה</Text>
          <TouchableOpacity style={styles.authBtn} onPress={() => router.replace('/auth')}>
            <Text style={styles.authBtnText}>התחבר</Text>
          </TouchableOpacity>
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
      await submitArticle({
        title: t,
        summary: s,
        content: c,
        image: image.trim() || 'bino',
        category,
        submittedByPhone: user!.phoneNumber,
        authorName: authorName.trim() || undefined,
      });
      showToast('הכתבה נשלחה לאישור. תופיע לאחר שאושרה.', 'success');
      router.back();
    } catch (e: any) {
      showToast(e?.message ?? 'אירעה שגיאה בשליחה', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: 'הגשת כתבה', headerBackTitle: 'חזרה', headerTintColor: Colors.primary }} />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.hint}>הכתבה תישלח לאישור ותפורסם לאחר שאושרה.</Text>
          <Text style={styles.label}>כותרת *</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="כותרת הכתבה" placeholderTextColor={Colors.mediumGray} />
          <Text style={styles.label}>תקציר *</Text>
          <TextInput style={[styles.input, styles.textArea]} value={summary} onChangeText={setSummary} placeholder="תקציר קצר" placeholderTextColor={Colors.mediumGray} multiline numberOfLines={3} />
          <Text style={styles.label}>תוכן *</Text>
          <TextInput style={[styles.input, styles.textArea, styles.contentArea]} value={content} onChangeText={setContent} placeholder="גוף הכתבה" placeholderTextColor={Colors.mediumGray} multiline numberOfLines={6} />
          <Text style={styles.label}>קטגוריה</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat.id} style={[styles.categoryChip, category === cat.id && styles.categoryChipActive]} onPress={() => setCategory(cat.id)}>
                <Text style={[styles.categoryChipText, category === cat.id && styles.categoryChipTextActive]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.label}>קישור לתמונה (אופציונלי)</Text>
          <TextInput style={styles.input} value={image} onChangeText={setImage} placeholder="https://..." placeholderTextColor={Colors.mediumGray} keyboardType="url" autoCapitalize="none" />
          <Text style={styles.label}>שם המחבר (אופציונלי)</Text>
          <TextInput style={styles.input} value={authorName} onChangeText={setAuthorName} placeholder="איך להציג את שמך" placeholderTextColor={Colors.mediumGray} />
          <TouchableOpacity style={[styles.submitBtn, submitting && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={submitting}>
            {submitting ? <ActivityIndicator color={Colors.white} /> : (
              <>
                <Ionicons name="send" size={20} color={Colors.white} />
                <Text style={styles.submitBtnText}>שליחה לאישור</Text>
              </>
            )}
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
  loginPrompt: { fontSize: 16, color: Colors.darkGray, marginTop: 16, textAlign: 'center' },
  authBtn: { marginTop: 20, backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  authBtnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
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
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8, paddingVertical: 16, borderRadius: 16, backgroundColor: Colors.primary },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { color: Colors.white, fontWeight: '800', fontSize: 16 },
});
