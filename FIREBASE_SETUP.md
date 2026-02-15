# Firebase – קולקציות ומשתמש אדמין

## קבצי חיבור Firebase (פרויקט beer-sheva-83442)

שימו בתיקיית שורש הפרויקט את שלושת הקבצים שהורדתם:

| קובץ | שימוש |
|------|--------|
| `beer-sheva-83442-firebase-adminsdk-fbsvc-d0802d28dc.json` | סקריפט seed (Firestore) – **לא לעשות commit** |
| `google-services-16.json` | אנדרואיד (Expo ב-build) |
| `GoogleService-Info-17.plist` | iOS (Expo ב-build) |

ב-`app.json` מוגדר: אנדרואיד משתמש ב-`google-services-16.json`, iOS ב-`GoogleService-Info-17.plist`.  
הסקריפט `npm run firebase:seed` מחפש את קובץ מפתח השירות בשם `beer-sheva-83442-firebase-adminsdk-fbsvc-d0802d28dc.json` (או `beer-sheva-service-account.json`).

---

## למה אין קולקציות ב-Firestore?

ב-Firestore **קולקציה מופיעה רק אחרי שנוצר בה מסמך ראשון**.  
האפליקציה לא יוצרת מסמכים אוטומטית – רק כשמשתמש עושה פעולה:

- **article_submissions** – נוצרת כשמישהו שולח "הגשת כתבה" או כשאדמין לוחץ "הוסף כתבה".
- **gallery_items** – נוצרת כשמישהו מעלה תמונה לגלריה.

אחרי פעולה ראשונה מהאפליקציה הקולקציות יופיעו ב-Console.

---

## Authentication – איפה רואים משתמשים

האפליקציה משתמשת ב-**Firebase Authentication** עם **אימייל/סיסמא**: כל משתמש נרשם עם מספר טלפון וסיסמא, והמערכת יוצרת עבורו משתמש Auth עם אימייל סינטטי (למשל `972523985505@beer-sheva.auth`).

- **Firebase Console → Authentication → Users** – כאן תופיע רשימת כל מי שנרשם/התחבר.
- **Firestore → קולקציה `users`** – כאן נשמר הפרופיל (שם פרטי, שם משפחה, תושבות).

### הפעלת שיטת Sign-in

ב-Firebase Console: **Authentication → Sign-in method** – וודא ש-**Email/Password** מופעל (Enable).

### איך ליצור אדמין

1. **הרשם** באפליקציה עם המספר `0523985505` וסיסמא שבחרת.
2. המשתמש יופיע ב-**Authentication** וב-Firestore **users**.
3. המספר מוגדר כאדמין ב-`constants/admin.ts` – יופיעו "ניהול כתבות" והעלאת תמונות ללא הגבלה.

---

## איך לראות קולקציות ב-Console (בלי להריץ אפליקציה)

אפשר להריץ **סקריפט seed** שיוצר מסמך אחד בכל קולקציה – אז הקולקציות יופיעו ב-Firestore:

1. **מפתח שירות:** שימו בתיקיית הפרויקט את הקובץ שהורדתם: `beer-sheva-83442-firebase-adminsdk-fbsvc-d0802d28dc.json` (או `beer-sheva-service-account.json`). הסקריפט מחפש גם `google-services-16.json` (רק אם יש בו `type: service_account` ו-`private_key` – קובץ client לא מתאים).

2. **הרצה:**
   ```bash
   npm run firebase:seed
   ```
   או עם path מותאם:
   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=./beer-sheva-service-account.json node scripts/seed-firestore.js
   ```

אחרי ההרצה יופיעו הקולקציות **article_submissions** ו-**gallery_items** ב-Console (עם מסמך דוגמה בכל אחת).

---

## סיכום

| מה רוצים | איך |
|----------|-----|
| **לראות משתמש ב-Authentication** | התחברות באפליקציה עם 0523985505 + קוד SMS |
| **לראות קולקציות ב-Firestore** | שימוש באפליקציה (הגשת כתבה / הוספת כתבה / העלאת תמונה) **או** הרצת `npm run firebase:seed` |
