export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', dir: 'ltr' },
  { code: 'ur', label: 'Urdu', native: 'اردو', dir: 'rtl' },
  { code: 'sd', label: 'Sindhi', native: 'سنڌي', dir: 'rtl' },
  { code: 'ar', label: 'Arabic', native: 'العربية', dir: 'rtl' },
]

export function getLanguage(code) {
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0]
}

const STRINGS = {
  'app.tagline': {
    en: 'Image to document composer',
    ur: 'تصویر سے دستاویز تیار کرنے کا آلہ',
    sd: 'تصویران مان دستاويز ٺياهڪندڙ آلہ',
    ar: 'أداة إنشاء المستندات من الصور',
  },
  'nav.home': { en: 'Home', ur: 'ہوم', sd: 'گھر', ar: 'الرئيسية' },
  'nav.dashboard': { en: 'Dashboard', ur: 'ڈیش بورڊ', sd: 'ڊيش بورڊ', ar: 'لوحة التحكم' },
  'nav.upload': { en: 'New Upload', ur: 'نیا اپ لوڈ', sd: 'نئون اپ لوڊ', ar: 'رفع جديد' },
  'nav.settings': { en: 'Settings', ur: 'ترتیبات', sd: 'ترتيبات', ar: 'الإعدادات' },
  'common.save': { en: 'Save', ur: 'محفوظ کریں', sd: 'محفوظ ڪريو', ar: 'حفظ' },
  'common.cancel': { en: 'Cancel', ur: 'منسوخ', sd: 'منسوخ', ar: 'إلغاء' },
  'common.delete': { en: 'Delete', ur: 'حذف کریں', sd: 'ڊاهيو', ar: 'حذف' },
  'common.open': { en: 'Open', ur: 'کھولیں', sd: 'کوليو', ar: 'فتح' },
  'common.rename': { en: 'Rename', ur: 'نام بدلیں', sd: 'نالو بدليو', ar: 'إعادة تسمية' },
  'common.duplicate': { en: 'Duplicate', ur: 'نقل بنائیں', sd: 'نقل ٺاهيو', ar: 'نسخ' },
  'common.search': { en: 'Search', ur: 'تلاش کریں', sd: 'ڳوليو', ar: 'بحث' },
  'common.back': { en: 'Back', ur: 'واپس', sd: 'پيتو', ar: 'رجوع' },
  'common.close': { en: 'Close', ur: 'بند کریں', sd: 'بند ڪريو', ar: 'إغلاق' },
  'common.loading': { en: 'Loading…', ur: 'لوڈ ہو رہا ہے…', sd: 'لوڊ ٿي رهي آهي…', ar: 'جارٍ التحميل…' },
  'dashboard.title': { en: 'Your documents', ur: 'آپ کی دستاویزات', sd: 'تنهنجا دستاويز', ar: 'مستنداتك' },
  'dashboard.subtitle': {
    en: 'Manage drafts and recently edited documents stored in this browser.',
    ur: 'اس براؤزر میں محفوظ شدہ مسودات اور حالیہ دستاویزات کا انتظام کریں۔',
    sd: 'هن برائوزر ۾ محفوظ ڪيل مسودن جو ۽ وارهائين دستاويزن جو انتظام ڪريو.',
    ar: 'أدر المسودات والمستندات المحفوظة في هذا المتصفح.',
  },
  'dashboard.createNew': {
    en: 'Create new document',
    ur: 'نئی دستاویز بنائیں',
    sd: 'نئون دستاويز ٺاهيو',
    ar: 'إنشاء مستند جديد',
  },
  'dashboard.recent': { en: 'Recent documents', ur: 'حالیہ دستاویزات', sd: 'وارهائون دستاويز', ar: 'المستندات الأخيرة' },
  'dashboard.empty.title': { en: 'No documents yet', ur: 'ابھی کوئی دستاویز نہیں', sd: 'اڃ ڪا دستاويز ناهي', ar: 'لا توجد مستندات بعد' },
  'dashboard.empty.desc': {
    en: 'Upload a scanned image to compose your first document.',
    ur: 'اپنی پہلی دستاویز تیار کرنے کے لیے اسکین شدہ تصویر اپ لوڈ کریں۔',
    sd: 'پهرين دستاويز ٺاهڻ لاءِ اسڪين ڪيل تصوير اپ لوڊ ڪريو.',
    ar: 'ارفع صورة ممسوحة لإنشاء مستندك الأول.',
  },
  'dashboard.noResults.title': { en: 'No matching documents', ur: 'کوئی مماثل دستاویز نہیں', sd: 'ڪا ملتو جو دستاويز ناهي', ar: 'لا توجد مستندات مطابقة' },
  'dashboard.noResults.desc': {
    en: 'Try a different search term.',
    ur: 'کسی دوسرے لفظ کی تلاش کریں۔',
    sd: 'ٻيئر لفظ سان ڳوليو.',
    ar: 'جرّب كلمة بحث أخرى.',
  },
  'upload.title': { en: 'Upload document image', ur: 'دستاویز کی تصویر اپ لوڈ کریں', sd: 'دستاويز جي تصوير اپ لوڊ ڪريو', ar: 'رفع صورة المستند' },
  'upload.subtitle': {
    en: 'Start with a JPG or PNG scan. Everything stays in your browser.',
    ur: 'JPG یا PNG اسکین سے شروع کریں۔ سب کچھ آپ کے براؤزر میں ہی رہتا ہے۔',
    sd: 'JPG يا PNG اسڪين سان پهريو ٿو. سڀ ڪجهه توهانجي برائوزر ۾ رهندو آهي.',
    ar: 'ابدأ بمسح ضوئي JPG أو PNG. كل شيء يبقى في متصفحك.',
  },
  'settings.title': { en: 'Settings', ur: 'ترتیبات', sd: 'ترتيبات', ar: 'الإعدادات' },
  'settings.subtitle': {
    en: 'Preferences are saved locally in this browser.',
    ur: 'ترجیحات اس براؤزر میں مقامی طور پر محفوظ ہوتی ہیں۔',
    sd: 'ترجيحات هن برائوزر ۾ مقامي طور تي محفوظ ٿون ٿيون.',
    ar: 'يتم حفظ التفضيلات محليًا في هذا المتصفح.',
  },
  'settings.profile': { en: 'Profile', ur: 'پروفائل', sd: 'پروفائل', ar: 'الملف الشخصي' },
  'settings.appearance': { en: 'Appearance', ur: 'ظاہری شکل', sd: 'ڊيڪھ', ar: 'المظهر' },
  'settings.language': { en: 'Interface language', ur: 'انٹرفیس زبان', sd: 'انٽرفيس ٻولي', ar: 'لغة الواجهة' },
  'settings.exportFormat': { en: 'Default export format', ur: 'ڈیفالٹ برآمد فارمیٹ', sd: 'ڊيفولٽ ايجاءٽ فارميٽ', ar: 'صيغة التصدير الافتراضية' },
  'editor.saveDraft': { en: 'Save draft', ur: 'مسوہ محفوظ کریں', sd: 'مسودو محفوظ ڪريو', ar: 'حفظ المسودة' },
  'editor.export': { en: 'Export', ur: 'برآمد کریں', sd: 'ايجاءٽ ڪريو', ar: 'تصدير' },
  'editor.addText': { en: 'Add text', ur: 'متن شامل کریں', sd: 'متن شامل ڪريو', ar: 'إضافة نص' },
  'editor.properties': { en: 'Properties', ur: 'خصوصیات', sd: 'خصوصيتون', ar: 'الخصائص' },
}

export function translate(key, langCode) {
  const entry = STRINGS[key]
  if (!entry) return key
  return entry[langCode] || entry.en
}
