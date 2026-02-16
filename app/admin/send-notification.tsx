import { isAdminPhone } from '@/constants/admin';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { db } from '@/lib/firebase';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import {
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

/**
 * Sends a push notification to all users including admins.
 * No filter excludes admins – they receive notifications like everyone else.
 *
 * Current implementation: saves to Firestore `notifications_outbox`.
 * A Cloud Function can listen for new docs and send via FCM/Expo Push.
 * Until that's wired, the notification is queued for later delivery.
 */
export default function SendNotificationScreen() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isAdmin = isAdminPhone(user?.phoneNumber ?? undefined);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSend() {
    const t = title.trim();
    const b = body.trim();
    if (!t || !b) {
      showToast('חובה כותרת ותוכן', 'error');
      return;
    }
    setSending(true);
    try {
      await addDoc(collection(db, 'notifications_outbox'), {
        title: t,
        body: b,
        sentAt: new Date().toISOString(),
        sentByPhone: user?.phoneNumber ?? null,
        audience: 'all', // all = כולל אדמינים. No filter excludes admins.
      });
      showToast('ההתראה נשלחה לכל המשתמשים (כולל אדמינים)', 'success');
      setTitle('');
      setBody('');
    } catch (e: any) {
      showToast(e?.message ?? 'שגיאה בשליחה', 'error');
    } finally {
      setSending(false);
    }
  }

  if (!isAdmin) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Stack.Screen options={{ title: 'שליחת התראה' }} />
        <Ionicons name="lock-closed" size={48} color={Colors.error} />
        <Text style={styles.msg}>אין הרשאה</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'שליחת התראה' }} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.noteCard}>
              <Ionicons name="information-circle" size={24} color={Colors.primary} />
              <Text style={styles.noteText}>ההתראה תשלח לכל המשתמשים שנרשמו להתראות – כולל אדמינים.</Text>
            </View>

            <Text style={styles.label}>כותרת *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="כותרת ההתראה"
              placeholderTextColor={Colors.mediumGray}
              textAlign="right"
            />

            <Text style={styles.label}>תוכן *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={body}
              onChangeText={setBody}
              placeholder="תוכן ההתראה"
              placeholderTextColor={Colors.mediumGray}
              multiline
              numberOfLines={4}
              textAlign="right"
            />

            <TouchableOpacity
              style={[styles.sendBtn, sending && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={sending}
            >
              <Ionicons name="send" size={22} color={Colors.white} />
              <Text style={styles.sendBtnText}>שלח התראה</Text>
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
  content: { padding: 20 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  msg: { fontSize: 18, fontWeight: '700', color: Colors.darkGray },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.primary + '14',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  noteText: { flex: 1, fontSize: 14, color: Colors.darkGray, lineHeight: 22, textAlign: 'right' },
  label: { fontSize: 14, fontWeight: '700', color: Colors.darkGray, marginBottom: 8, textAlign: 'right' },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: Colors.black,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginBottom: 16,
  },
  textArea: { minHeight: 120, textAlignVertical: 'top' },
  sendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
  },
  sendBtnText: { color: Colors.white, fontWeight: '800', fontSize: 17 },
  sendBtnDisabled: { opacity: 0.7 },
});
