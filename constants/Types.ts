// Article / כתבות (city news)
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  date: string;
  category: 'news' | 'culture' | 'events' | 'business' | 'community';
  /** כשיש עסק מקושר – מציג כפתור "נווט לבינו" */
  businessId?: string;
}

/** הגשת כתבה על ידי משתמש – מחכה לאישור אדמין */
export type ArticleSubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface ArticleSubmission {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: NewsArticle['category'];
  /** @deprecated use submittedByPhone */
  submittedByUid?: string;
  submittedByPhone?: string;
  authorName?: string;
  submittedAt: string;
  status: ArticleSubmissionStatus;
  reviewedAt?: string;
  businessId?: string;
}

// Business / עסקים (for directory and future paid listings)
export interface Business {
  id: string;
  name: string;
  logo: string;
  category?: string;
  description?: string;
  phone?: string;
  address?: string;
  website?: string;
  tier?: 'platinum' | 'gold' | 'silver';
}

// Legacy alias for sponsors screen
export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  tier: 'platinum' | 'gold' | 'silver';
  website?: string;
}

// Person / אישים מהעיר
export interface Person {
  id: string;
  name: string;
  role: string;
  image: string;
  shortBio: string;
}

// Coupon / קופונים
// החזון: בעתיד רק למשתמשים רשומים (membersOnly). מגבלת ממשיכים – העסק סורק/מאשר בחנות.
export interface Coupon {
  id: string;
  businessId: string;
  businessName: string;
  title: string;
  description: string;
  validUntil: string;
  /** קוד להצגה (אופציונלי – כשהאישור בסריקה בחנות) */
  code?: string;
  /** מוגבל ל-X ממשיכים – העסק מכניס/סורק את הקופון במערכת ורואה אם נותר מקום */
  maxRedemptions?: number;
  /** כמה כבר נוצלו (מגיע מבקאנד) */
  redemptionCount?: number;
  /** בעתיד: רק לחברי אפליקציה רשומים – כרגע לא נאכף */
  membersOnly?: boolean;
}

// Event / מפגשים
export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  place: string;
  description: string;
}

// לוח מודעות קהילתי – חיפוש עבודה, עזרה לנזקקים, חונכות ולימוד
// בהמשך: חיבור Firestore, פרסום מודעות עם כל הפרטים
export type CommunityCategory = 'job' | 'help_needed' | 'tutoring' | 'other';

export interface CommunityPost {
  id: string;
  category: CommunityCategory;
  title: string;
  description: string;
  /** טלפון ליצירת קשר (מוצג וניתן לחיצה לחיוג) */
  contact?: string;
  /** טלפון מובנה – לשימוש עתידי */
  phone?: string;
  /** מיקום/כתובת – לשימוש עתידי */
  location?: string;
  /** אימייל – לשימוש עתידי */
  email?: string;
  authorName?: string;
  date: string;
  /** תמונה (אופציונלי) – לשימוש עתידי */
  image?: string;
}

// אירוע מרכזי – מוצג בדף הבית (עסק שנפתח, לייב לחברים, אירוע)
export interface FeaturedEvent {
  id: string;
  kind: 'business_opening' | 'live' | 'event';
  title: string;
  subtitle?: string;
  date: string;
  time?: string;
  place?: string;
  description?: string;
  image?: string;
  businessId?: string;
  isMembersOnly?: boolean;
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  title: string;
  date: string;
  category: string;
}

// בריאות ובטיחות – מספרי חירום, נקודות עזרה, הנחיות חירום
export interface EmergencyNumber {
  id: string;
  name: string;
  number: string;
  description?: string;
}

export type HelpPointType = 'mda' | 'clinic' | 'pharmacy' | 'hospital';

export interface HelpPoint {
  id: string;
  type: HelpPointType;
  name: string;
  address: string;
  phone?: string;
  hours?: string;
}

// Legacy types (kept for backward compatibility during migration)
export interface Player {
  id: string;
  name: string;
  number: number;
  position: 'שוער' | 'בלם' | 'קשר' | 'חלוץ';
  positionEn: 'GK' | 'DEF' | 'MID' | 'FWD';
  age: number;
  image: string;
  goals: number;
  assists: number;
  appearances: number;
  nationality: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  venue: string;
  league: string;
  status: 'upcoming' | 'live' | 'completed';
  homeLogo?: string;
  awayLogo?: string;
}

export interface StandingsTeam {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  isSderot?: boolean;
}

export interface YouthTeam {
  id: string;
  name: string;
  ageGroup: string;
  coach: string;
  league: string;
  players: number;
}

// תוכן תורני – ניהול על ידי אדמין
/** פרשת השבוע – ניתן לעדכון על ידי האדמין */
export interface ParashaShavua {
  /** שם הפרשה (למשל "תרומה") */
  name: string;
  /** תיאור קצר או הפניה (אופציונלי) */
  summary?: string;
  /** תאריך/שבוע – לצורך הצגה (אופציונלי) */
  weekLabel?: string;
}

/** דבר תורה יומי או שבועי – ניהול על ידי אדמין */
export interface DvarTorah {
  id: string;
  title: string;
  content: string;
  /** יומי או שבועי */
  type: 'daily' | 'weekly';
  date: string;
  /** שם המחבר/המגיד (אופציונלי) */
  author?: string;
  /** תמונת הרב/מחבר (אופציונלי) */
  authorImage?: string;
  /** קישור לסרטון YouTube (אופציונלי) */
  videoUrl?: string;
}

/** כישרון מקומי – סרטון או גלריית תמונות */
export interface Talent {
  id: string;
  title: string;
  /** תיאור מלא – אם קיים, כפתור "המשך לקרוא" */
  description?: string;
  type: 'video' | 'image';
  /** קישור לסרטון (כשtype=video) */
  videoUrl?: string;
  /** תמונות (כשtype=image) */
  images?: string[];
  date: string;
}

/** נכס להשכרה או מכירה */
export interface RealEstateListing {
  id: string;
  title: string;
  description: string;
  address: string;
  /** מחיר או שכר דירה – אופציונלי */
  price?: string;
  type: 'sale' | 'rent';
  /** תמונות הנכס – תאימות לאחור: אם קיים רק image, נשתמש ב-[image] */
  images: string[];
  /** שם המתווך */
  agentName?: string;
  /** תמונת המתווך */
  agentImage?: string;
}
