import {
  Business,
  CommunityPost,
  Coupon,
  DvarTorah,
  EmergencyNumber,
  Event,
  FeaturedEvent,
  GalleryItem,
  HelpPoint,
  Match,
  NewsArticle,
  ParashaShavua,
  Person,
  Player,
  Sponsor,
  StandingsTeam,
  YouthTeam,
} from './Types';

// ========== CITY INFO ==========
export const cityInfo = {
  name: 'באר שבע',
  fullName: 'אפליקציית באר שבע – העיר',
  description: 'כל מה שקורה בעיר באר שבע: עסקים, כתבות, אירועים ואישים',
  website: 'https://www.netivot.muni.il',
  socialMedia: {
    facebook: 'https://facebook.com/netivot',
    instagram: 'https://instagram.com/netivot',
    twitter: 'https://twitter.com/netivot',
  },
};

// ========== בריאות ובטיחות (Health & Safety) ==========
export const emergencyNumbers: EmergencyNumber[] = [
  { id: '1', name: 'משטרה', number: '100', description: 'חירום משטרת ישראל' },
  { id: '2', name: 'מד״א', number: '101', description: 'מגן דוד אדום' },
  { id: '3', name: 'כיבוי אש', number: '102', description: 'שירותי כבאות והצלה' },
  { id: '4', name: 'חירום עירייה', number: '08-9921212', description: 'מרכזיית עיריית באר שבע' },
];

export const helpPoints: HelpPoint[] = [
  { id: '1', type: 'mda', name: 'תחנת מד״א באר שבע', address: 'רחוב הרצל 50', phone: '08-9923344', hours: '24/7' },
  { id: '2', type: 'clinic', name: 'טיפת חלב', address: 'רחוב ויצמן 12', phone: '08-9912345', hours: 'א\'-ה\' 08:00-15:00' },
  { id: '3', type: 'clinic', name: 'מרפאת כללית', address: 'שדרות העצמאות 8', phone: '08-9956789', hours: 'א\'-ה\' 08:00-19:00' },
  { id: '4', type: 'pharmacy', name: 'סופר פארם באר שבע', address: 'רחוב הרצל 12', phone: '08-1234567', hours: 'א\'-ה\' 08:00-21:00, ו\' 08:00-14:00' },
  { id: '5', type: 'pharmacy', name: 'בית מרקחת הרצל', address: 'רחוב הרצל 22', phone: '08-9876543', hours: '24/7' },
];

/** קישור להנחיות פיקוד העורף / דף חירום עירוני */
export const emergencyGuidelinesUrl = 'https://www.oref.org.il/12481-he/Pakar.aspx';

// ========== ARTICLES – רק דביר/בינו; השאר מ-Firestore ==========
export const binoArticle: NewsArticle = {
  id: 'bino',
  title: 'הפיתה של בינו – קיוסק עם נשמה גדולה',
  summary: 'עם נשמה גדולה 💙 דביר עמר והסיפור מאחורי "בינו" ברחוב הארזים',
  content: `מה הייתם עושים בגיל 22 אחרי ארבע שנים בישיבה וקרבי בכפיר?

רובנו היינו רוצים לנוח, לטוס, לשכוח קצת מהכל.

אבל דביר עמר לא חיכה לרגע המושלם.
הוא לקח אחריות והיום הוא האיש מאחורי "בינו", קיוסק קטן עם נשמה גדולה ברחוב הארזים, ליד סופר חומרי הבניין.

בלי רעש, בלי יח"צ.
פשוט עומד מאחורי הדלפק, מגיש חביתת ירק, שקשוקה, בגאט טונה ותקשיבו טוב — סנדוויץ' טוניסאי שלא תמצאו בשום מקום.

וכל זה כשהוא עדיין עושה מילואים בגזרת עזה. כן, גם עכשיו.

כי דביר לא חיפש קיצורי דרך. הוא בחר דרך.
ועושה את זה כמו לוחם, בשקט, בעקביות, עם לב ענק.

🥪 אם אתם באיזור תקפצו ל"בינו". תזמינו משהו טעים, תגידו שלום.
כי זה הרבה יותר מסנדוויץ'. זה סיפור ישראלי שעושה חשק לפרגן.

📍 רחוב הארזים, מול סופר חומרי בניין
⏰ פתוח מ-8:00 עד 17:00
כשר. טעים. עם נשמה.

— עם דביר עמר.`,
  image: 'bino',
  date: '2026-02-12',
  category: 'business',
  businessId: 'bino',
};

export const newsArticles: NewsArticle[] = [binoArticle];

// ========== BUSINESSES – רק בינו; השאר מ-Firestore בעתיד ==========
export const businesses: Business[] = [
  { id: 'bino', name: 'הפיתה של בינו', logo: '', category: 'מזון | קיוסק', tier: 'gold', address: 'רחוב הארזים, מול סופר חומרי בניין', website: '#', phone: '' },
];

// Legacy: sponsors (same as businesses for compatibility)
export const sponsors: Sponsor[] = businesses.map((b) => ({
  id: b.id,
  name: b.name,
  logo: b.logo,
  tier: (b.tier || 'silver') as 'platinum' | 'gold' | 'silver',
  website: b.website,
}));

// ========== PERSONS (אישים) ==========
export const persons: Person[] = [
  { id: '1', name: 'אוראל אהרון', role: 'יזם', image: 'orel', shortBio: 'מפתח אפליקציות ומערכות מידע.' },
  { id: '2', name: 'שרה כהן', role: 'מנהלת המרכז הקהילתי', image: 'https://i.pravatar.cc/300?img=5', shortBio: 'מנהלת המרכז הקהילתי, מובילה תוכניות תרבות ופנאי.' },
  { id: '3', name: 'משה אברהם', role: 'פעיל קהילה', image: 'https://i.pravatar.cc/300?img=12', shortBio: 'פעיל קהילתי ותיק, מייסד עמותת "יחד בבאר שבע".' },
  { id: '4', name: 'רחל מזרחי', role: 'מנהלת ספריית העיר', image: 'https://i.pravatar.cc/300?img=9', shortBio: 'מנהלת ספריית העיר, מקדמת קריאה ותרבות.' },
  { id: '5', name: 'יוסי דהן', role: 'בעל עסק מקומי', image: 'https://i.pravatar.cc/300?img=15', shortBio: 'בעל "מסעדת הנגב", תורם לקהילה ולנוער.' },
];

// ========== EVENTS (מפגשים / אירועים) ==========
export const events: Event[] = [
  { id: '1', title: 'חגיגות פורים', date: '2026-03-14', time: '17:00', place: 'רחבת העירייה', description: 'מופעים, דוכנים ומתנפחים לילדים.' },
  { id: '2', title: 'שוק איכרים', date: '2026-02-20', time: '09:00', place: 'פארק העיר', description: 'דוכני ירקות, גבינות ומאפים מיצרנים מקומיים.' },
  { id: '3', title: 'ערב סיפורים – יוצאי מרוקו', date: '2026-02-18', time: '19:00', place: 'המרכז הקהילתי', description: 'ערב סיפורים ומסורות.' },
  { id: '4', title: 'שבוע הקריאה', date: '2026-02-10', time: '16:00', place: 'ספריית העיר', description: 'פעילויות וסדנאות קריאה.' },
  { id: '5', title: 'יום ניקיון שכונתי', date: '2026-02-25', time: '08:00', place: 'שכונת המזרח', description: 'מתנדבים ומשפחות ליום ניקיון בשכונה.' },
];

// ========== אירוע מרכזי (Featured / Central Event) ==========
// מוצג בדף הבית – עסק שנפתח השבוע, לייב לחברי אפליקציה, אירוע מיוחד. בעתיד יגיע מאדמין.
export const featuredEvent: FeaturedEvent | null = {
  id: 'fe1',
  kind: 'business_opening',
  title: 'אלקטרו באר שבע – פתיחה השבוע',
  subtitle: 'חנות אלקטרוניקה ומוצרי חשמל במרכז העיר',
  date: '2026-02-15',
  time: '10:00',
  place: 'רחוב הרצל 30',
  description: 'מבצעי פתיחה ומגוון מוצרי חשמל ואלקטרוניקה.',
  image: 'https://picsum.photos/seed/opening1/800/400',
  businessId: '5',
};

// ========== לוח מודעות קהילתי – ריק; בהמשך מ-Firestore עם מיקום, טלפון וכל הפרטים ==========
export const communityPosts: CommunityPost[] = [];

// ========== COUPONS (קופונים) ==========
// זרימה: לקוח מגיע פיזית לחנות, מציג את הקופון (הודעת אישור), בעל העסק סורק/מכניס למערכת – אם נותר מקום מקבל הנחה.
// בעתיד: רק למשתמשים רשומים (membersOnly). כרגע פתוח לכולם עד חיבור בקאנד.
export const coupons: Coupon[] = [
  { id: '1', businessId: '4', businessName: 'מסעדת הנגב', title: '20% הנחה לארוחה', description: 'הנחה על כל מנה שנייה', validUntil: '2026-03-01', code: 'NETIVOT20', maxRedemptions: 100, redemptionCount: 42, membersOnly: false },
  { id: '2', businessId: '5', businessName: 'אלקטרו באר שבע', title: '10% על מוצרי חשמל', description: 'לקנייה מעל 500 ₪', validUntil: '2026-02-28', code: 'ELEC10', maxRedemptions: 50, redemptionCount: 50, membersOnly: false },
  { id: '3', businessId: '1', businessName: 'סופר פארם באר שבע', title: 'מתנה בקנייה', description: 'מתנה בקנייה מעל 100 ₪', validUntil: '2026-02-20', maxRedemptions: 200, redemptionCount: 87, membersOnly: true },
];

// ========== תוכן תורני (פרשת השבוע + דבר תורה) ==========
// ניהול על ידי אדמין – פרשת השבוע ניתנת לשינוי, דברי תורה יומיים/שבועיים
export const parashaShavua: ParashaShavua = {
  name: 'תרומה',
  summary: 'הפרשה עוסקת בציווי על תרומת המשכן וכליו: ארון העדות, השולחן, המנורה, המזבח והיריעות.',
  weekLabel: 'שבוע 12–18 בפברואר 2026',
};

export const dvarTorahList: DvarTorah[] = [
  {
    id: 'dt1',
    title: 'מעט מן האור דוחה הרבה מן החושך',
    content: 'בפרשת תרומה אנחנו מצווים על עשיית המנורה. חז"ל דורשים: "אין צריך לאורו" – הקב"ה לא צריך את האור שלנו, אלא אנחנו צריכים להאיר. כל מעשה טוב, כל מילה טובה, כל עזרה לזולת – הם נר קטן שמדליקים בעולם. מעט מן האור דוחה הרבה מן החושך.',
    type: 'weekly',
    date: '2026-02-14',
    author: 'רב העיר',
  },
  {
    id: 'dt2',
    title: 'תרומה – נתינה מהלב',
    content: '"דַּבֵּר אֶל בְּנֵי יִשְׂרָאֵל וְיִקְחוּ לִי תְּרוּמָה" – לא "ויתנו" אלא "ויקחו". כשאדם נותן צדקה או תורם לקהילה, הוא בעצם לוקח – לוקח זכות, לוקח קדושה, לוקח חיבור. הנתינה היא קבלה.',
    type: 'daily',
    date: '2026-02-12',
    author: 'מרכז קהילתי',
  },
  {
    id: 'dt3',
    title: 'בית כנסת – מקום של חיבור',
    content: 'המשכן היה מקום שבו כל אחד תרם לפי יכולתו – "כל נדיב לבו". כך גם בית הכנסת והקהילה: כל אחד מביא את חלקו, ויחד בונים מקום של תפילה, לימוד וחסד.',
    type: 'weekly',
    date: '2026-02-07',
  },
];

// ========== GALLERY – ריק; תמונות מ-Firestore ==========
export const galleryItems: GalleryItem[] = [];
export const sharedGalleryItems: GalleryItem[] = [];

// Legacy alias for screens still using clubInfo
export const clubInfo = {
  name: cityInfo.name,
  fullName: cityInfo.fullName,
  stadium: 'עיריית באר שבע',
  founded: '',
  coach: '',
  president: '',
  league: '',
  capacity: 0,
  city: cityInfo.name,
  colors: [] as string[],
  website: cityInfo.website,
  socialMedia: cityInfo.socialMedia,
};

// Legacy: empty arrays for hidden screens (matches, squad, youth)
export const matches: Match[] = [];
export const standings: StandingsTeam[] = [];
export const players: Player[] = [];
export const youthTeams: YouthTeam[] = [];
