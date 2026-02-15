/**
 * משתמש מנהל: 0523985505 – התחברות באימות טלפון (קוד SMS). אין סיסמה במסך.
 * לסיסמה (למשל 112233) – צור משתמש ב-Firebase Console → Authentication → Email/Password.
 */
export const ADMIN_PHONE_NUMBERS: string[] = ['0523985505'];

export function isAdminPhone(phone: string | null | undefined): boolean {
  if (!phone) return false;
  const normalized = phone.replace(/\D/g, '').replace(/^972/, '0');
  return ADMIN_PHONE_NUMBERS.some(
    (admin) => admin.replace(/\D/g, '') === normalized || normalized.endsWith(admin.replace(/\D/g, '').slice(-9))
  );
}
