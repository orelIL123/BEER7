# 🚀 הוראות התקנה - SMS Authentication & OTA Updates

## שלב 1: משוך את הקוד לפרויקט שלך

בעורך הקוד שלך (Cursor), הרץ את הפקודות הבאות:

```bash
# משוך את כל העדכונים מGitHub
git fetch origin

# עבור לענף החדש
git checkout copilot/connect-sms-authentication

# או אם אתה רוצה למזג לענף הראשי שלך:
git checkout main
git merge copilot/connect-sms-authentication
```

## שלב 2: התקן תלויות חדשות

```bash
# בתיקיית הפרויקט הראשית
npm install

# בתיקיית Firebase Functions
cd functions
npm install
cd ..
```

## שלב 3: פרוס את Firebase Functions (חשוב!)

זה השלב הכי חשוב - בלי זה ה-SMS לא יעבוד:

```bash
# פרוס את הפונקציות לFirebase
firebase deploy --only functions
```

הפקודה תפרוס 2 פונקציות חדשות:
- `sendOtp` - שולחת קוד SMS
- `verifyOtp` - מאמתת את הקוד

## שלב 4: בדוק שהפריסה הצליחה

אחרי הפריסה, תראה משהו כזה:
```
✔  functions[us-central1-sendOtp]: Successful create operation.
✔  functions[us-central1-verifyOtp]: Successful create operation.

Function URL (sendOtp(us-central1)): https://...
Function URL (verifyOtp(us-central1)): https://...
```

## שלב 5: הרץ את האפליקציה

```bash
# הרץ את האפליקציה
npm start

# או לאנדרואיד
npm run android

# או לiOS
npm run ios
```

## מה השתנה?

### ✅ אימות SMS בהרשמה
- כשמשתמש חדש מזין מספר טלפון, נשלח לו קוד SMS אוטומטית
- הקוד תקף ל-10 דקות
- אפשר לשלוח קוד חדש אחרי 60 שניות
- מוגבל ל-3 ניסיונות בתוך 10 דקות

### ✅ עדכוני OTA
- באפליקציה בלוח הניהול (Admin), יש כפתור "בדוק עדכוני OTA"
- מאפשר לעדכן את האפליקציה בלי לעבור דרך חנות האפליקציות
- עובד רק אם אתה מפרסם דרך EAS (Expo Application Services)

## פרטי ה-SMS API

השתמשתי בפרטים שנתת:
- **API Key**: mgfwkoRBI
- **User**: 0523985505
- **Password**: 73960779
- **Sender**: אפליקציית באר שבע

הפרטים האלה נמצאים ב-`functions/index.js` בפונקציה `sendSMS()`.

## פתרון בעיות

### אם ה-SMS לא נשלח:
1. בדוק שהפונקציות נפרסו: `firebase functions:list`
2. בדוק לוגים: `firebase functions:log --only sendOtp`
3. בדוק שיש לך יתרת SMS בחשבון sms4free

### אם יש שגיאה בפריסה:
```bash
# נקה והתקן מחדש
cd functions
rm -rf node_modules
npm install
cd ..
firebase deploy --only functions
```

## שאלות?

אם משהו לא עובד, תגיד לי ואני אעזור!
