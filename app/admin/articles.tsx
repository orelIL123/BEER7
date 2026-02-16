import { isAdminPhone } from '@/constants/admin';
import Colors from '@/constants/Colors';
import type { ArticleSubmission } from '@/constants/Types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { approveSubmission, getPendingSubmissions, rejectSubmission } from '@/lib/articles';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CATEGORY_LABELS: Record<string, string> = { news: 'חדשות', culture: 'תרבות', events: 'אירועים', business: 'עסקים', community: 'קהילה' };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('he-IL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminArticlesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [list, setList] = useState<ArticleSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);
  const isAdmin = isAdminPhone(user?.phoneNumber ?? undefined);

  const load = useCallback(async () => {
    try {
      const pending = await getPendingSubmissions();
      setList(pending);
    } catch (e: any) {
      showToast(e?.message ?? 'שגיאה בטעינה', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (isAdmin) load();
    else setLoading(false);
  }, [isAdmin, load]);

  async function handleApprove(id: string) {
    setActingId(id);
    try {
      await approveSubmission(id);
      setList((prev) => prev.filter((s) => s.id !== id));
      showToast('הכתבה אושרה', 'success');
    } catch (e: any) {
      showToast(e?.message ?? 'שגיאה', 'error');
    } finally {
      setActingId(null);
    }
  }

  async function handleReject(id: string) {
    setActingId(id);
    try {
      await rejectSubmission(id);
      setList((prev) => prev.filter((s) => s.id !== id));
      showToast('הכתבה נדחתה', 'info');
    } catch (e: any) {
      showToast(e?.message ?? 'שגיאה', 'error');
    } finally {
      setActingId(null);
    }
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}><Text style={styles.msg}>יש להתחבר.</Text>
          <TouchableOpacity style={styles.btn} onPress={() => router.replace('/auth')}><Text style={styles.btnText}>התחבר</Text></TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}><Text style={styles.msg}>אין הרשאה.</Text>
          <TouchableOpacity style={styles.btn} onPress={() => router.back()}><Text style={styles.btnText}>חזרה</Text></TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} colors={[Colors.primary]} />}
      >
        <TouchableOpacity style={styles.addArticleBtn} onPress={() => router.push('/admin/add-article')} activeOpacity={0.8}>
          <Ionicons name="add-circle" size={22} color={Colors.white} />
          <Text style={styles.addArticleBtnText}>הוסף כתבה (פרסום ישיר)</Text>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
        ) : list.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="checkmark-done-circle-outline" size={64} color={Colors.success} />
            <Text style={styles.emptyTitle}>אין כתבות ממתינות</Text>
          </View>
        ) : (
          list.map((sub) => (
            <View key={sub.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.categoryBadge}><Text style={styles.categoryText}>{CATEGORY_LABELS[sub.category] ?? sub.category}</Text></View>
                <Text style={styles.dateText}>{formatDate(sub.submittedAt)}</Text>
              </View>
              <Text style={styles.cardTitle}>{sub.title}</Text>
              <Text style={styles.cardSummary} numberOfLines={2}>{sub.summary}</Text>
              {sub.authorName ? <Text style={styles.authorText}>מגיש: {sub.authorName}</Text> : null}
              <View style={styles.actions}>
                <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]} onPress={() => handleReject(sub.id)} disabled={actingId !== null}>
                  {actingId === sub.id ? <ActivityIndicator size="small" color={Colors.white} /> : (<><Ionicons name="close" size={18} color={Colors.white} /><Text style={styles.actionBtnText}>דחה</Text></>)}
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.approveBtn]} onPress={() => handleApprove(sub.id)} disabled={actingId !== null}>
                  {actingId === sub.id ? <ActivityIndicator size="small" color={Colors.white} /> : (<><Ionicons name="checkmark" size={18} color={Colors.white} /><Text style={styles.actionBtnText}>אשר</Text></>)}
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  scrollContent: { padding: 16, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  msg: { fontSize: 16, color: Colors.darkGray, textAlign: 'center' },
  btn: { marginTop: 20, backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  btnText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
  addArticleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.success, paddingVertical: 14, borderRadius: 16, marginBottom: 20 },
  addArticleBtnText: { color: Colors.white, fontWeight: '800', fontSize: 15 },
  loader: { marginTop: 48 },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: Colors.darkGray, marginTop: 16 },
  card: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.lightGray },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  categoryBadge: { backgroundColor: Colors.primary + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  categoryText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  dateText: { fontSize: 12, color: Colors.mediumGray },
  cardTitle: { fontSize: 17, fontWeight: '800', color: Colors.black, marginBottom: 6, textAlign: 'right' },
  cardSummary: { fontSize: 14, color: Colors.darkGray, lineHeight: 20, marginBottom: 8, textAlign: 'right' },
  authorText: { fontSize: 12, color: Colors.mediumGray, marginBottom: 12, textAlign: 'right' },
  actions: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, minWidth: 90, justifyContent: 'center' },
  rejectBtn: { backgroundColor: Colors.error },
  approveBtn: { backgroundColor: Colors.success },
  actionBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
});
