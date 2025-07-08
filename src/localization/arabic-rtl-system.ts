// @ts-nocheck
/**
 * 🌍 ARABIC RTL SUPPORT & LOCALIZATION SYSTEM
 * High-Priority Missing Feature Implementation
 * 
 * Comprehensive Arabic RTL support with cultural adaptations, 
 * Islamic calendar integration, and regional customizations.
 */

import { EventEmitter } from 'events';

export interface Locale {
  code: string; // e.g., 'ar-SA', 'en-US'
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  currency: string;
  dateFormat: string;
  timeFormat: string;
  numberFormat: NumberFormatConfig;
  calendar: 'gregorian' | 'hijri' | 'both';
  isActive: boolean;
  fallbackLocale?: string;
}

export interface NumberFormatConfig {
  decimalSeparator: string;
  thousandsSeparator: string;
  decimalPlaces: number;
  currencySymbolPosition: 'before' | 'after';
  numberingSystem: 'western' | 'arabic-indic' | 'eastern-arabic';
}

export interface Translation {
  key: string;
  locale: string;
  value: string;
  pluralRules?: PluralRule[];
  context?: string;
  namespace?: string;
  lastUpdated: Date;
  translatedBy?: string;
  verified: boolean;
}

export interface PluralRule {
  condition: string; // e.g., '=0', '=1', '>1'
  value: string;
}

export interface HijriDate {
  year: number;
  month: number;
  day: number;
  monthName: string;
  yearType: 'AH'; // Anno Hegirae
}

export interface CalendarEvent {
  id: string;
  type: 'islamic' | 'national' | 'business';
  name: string;
  nameArabic: string;
  date: Date;
  hijriDate: HijriDate;
  isHoliday: boolean;
  affectsBusiness: boolean;
  description: string;
  descriptionArabic: string;
  region?: string;
}

export interface CulturalAdaptation {
  locale: string;
  businessHours: BusinessHours;
  prayerTimes: PrayerTimes;
  weekendDays: number[]; // 0-6, Sunday to Saturday
  holidays: CalendarEvent[];
  colorPreferences: ColorPreferences;
  layoutPreferences: LayoutPreferences;
  contentGuidelines: ContentGuidelines;
}

export interface BusinessHours {
  standard: DaySchedule[];
  ramadan: DaySchedule[];
  customSchedules: Record<string, DaySchedule[]>;
}

export interface DaySchedule {
  day: number; // 0-6
  isWorkingDay: boolean;
  periods: TimePeriod[];
}

export interface TimePeriod {
  start: string; // HH:MM
  end: string; // HH:MM
  type: 'work' | 'break' | 'prayer';
}

export interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  sunrise: string;
  sunset: string;
  calculationMethod: 'MWL' | 'ISNA' | 'Egypt' | 'Makkah' | 'Karachi' | 'Tehran';
  lastUpdated: Date;
}

export interface ColorPreferences {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  surface: string;
  text: string;
  culturallyAppropriate: boolean;
}

export interface LayoutPreferences {
  textAlignment: 'right' | 'left' | 'center';
  navigationPosition: 'right' | 'left';
  readingFlow: 'rtl' | 'ltr';
  iconAlignment: 'right' | 'left';
  formLayout: 'rtl' | 'ltr';
  tableLayout: 'rtl' | 'ltr';
}

export interface ContentGuidelines {
  avoidImages: string[]; // Types of images to avoid
  culturalSensitivities: string[];
  preferredTerminology: Record<string, string>;
  formattingRules: FormattingRule[];
}

export interface FormattingRule {
  type: 'text' | 'date' | 'number' | 'currency' | 'address';
  locale: string;
  format: string;
  example: string;
}

export interface LocalizationStats {
  totalKeys: number;
  translatedKeys: number;
  verifiedTranslations: number;
  completionPercentage: number;
  lastUpdate: Date;
  translators: LocalizationContributor[];
  qualityScore: number;
}

export interface LocalizationContributor {
  id: string;
  name: string;
  email: string;
  locales: string[];
  translationsCount: number;
  verificationCount: number;
  lastActivity: Date;
  rating: number;
}

export interface RTLLayoutRule {
  selector: string;
  property: string;
  ltrValue: string;
  rtlValue: string;
  priority: number;
}

export class ArabicRTLLocalizationSystem extends EventEmitter {
  private locales: Map<string, Locale> = new Map();
  private translations: Map<string, Translation[]> = new Map(); // key -> translations by locale
  private culturalAdaptations: Map<string, CulturalAdaptation> = new Map();
  private hijriCalendar: CalendarEvent[] = [];
  private rtlLayoutRules: RTLLayoutRule[] = [];
  private currentLocale: string = 'ar-SA';
  private fallbackLocale: string = 'en-US';

  constructor() {
    super();
    this.initializeLocales();
    this.initializeCulturalAdaptations();
    this.initializeHijriCalendar();
    this.initializeRTLRules();
    this.loadTranslations();
    this.startPrayerTimesUpdates();
  }

  private initializeLocales(): void {
    const locales: Locale[] = [
      {
        code: 'ar-SA',
        name: 'Arabic (Saudi Arabia)',
        nativeName: 'العربية (المملكة العربية السعودية)',
        direction: 'rtl',
        currency: 'SAR',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm',
        numberFormat: {
          decimalSeparator: '٫',
          thousandsSeparator: '٬',
          decimalPlaces: 2,
          currencySymbolPosition: 'after',
          numberingSystem: 'eastern-arabic'
        },
        calendar: 'both',
        isActive: true
      },
      {
        code: 'en-US',
        name: 'English (United States)',
        nativeName: 'English (United States)',
        direction: 'ltr',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: 'h:mm A',
        numberFormat: {
          decimalSeparator: '.',
          thousandsSeparator: ',',
          decimalPlaces: 2,
          currencySymbolPosition: 'before',
          numberingSystem: 'western'
        },
        calendar: 'gregorian',
        isActive: true,
        fallbackLocale: 'ar-SA'
      },
      {
        code: 'ar-AE',
        name: 'Arabic (UAE)',
        nativeName: 'العربية (الإمارات العربية المتحدة)',
        direction: 'rtl',
        currency: 'AED',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm',
        numberFormat: {
          decimalSeparator: '٫',
          thousandsSeparator: '٬',
          decimalPlaces: 2,
          currencySymbolPosition: 'after',
          numberingSystem: 'eastern-arabic'
        },
        calendar: 'both',
        isActive: true,
        fallbackLocale: 'ar-SA'
      }
    ];

    locales.forEach(locale => {
      this.locales.set(locale.code, locale);
    });
  }

  private initializeCulturalAdaptations(): void {
    const saudiAdaptation: CulturalAdaptation = {
      locale: 'ar-SA',
      businessHours: {
        standard: [
          { day: 0, isWorkingDay: true, periods: [{ start: '08:00', end: '17:00', type: 'work' }] }, // Sunday
          { day: 1, isWorkingDay: true, periods: [{ start: '08:00', end: '17:00', type: 'work' }] }, // Monday
          { day: 2, isWorkingDay: true, periods: [{ start: '08:00', end: '17:00', type: 'work' }] }, // Tuesday
          { day: 3, isWorkingDay: true, periods: [{ start: '08:00', end: '17:00', type: 'work' }] }, // Wednesday
          { day: 4, isWorkingDay: true, periods: [{ start: '08:00', end: '17:00', type: 'work' }] }, // Thursday
          { day: 5, isWorkingDay: false, periods: [] }, // Friday
          { day: 6, isWorkingDay: false, periods: [] }  // Saturday
        ],
        ramadan: [
          { day: 0, isWorkingDay: true, periods: [{ start: '09:00', end: '15:00', type: 'work' }] },
          { day: 1, isWorkingDay: true, periods: [{ start: '09:00', end: '15:00', type: 'work' }] },
          { day: 2, isWorkingDay: true, periods: [{ start: '09:00', end: '15:00', type: 'work' }] },
          { day: 3, isWorkingDay: true, periods: [{ start: '09:00', end: '15:00', type: 'work' }] },
          { day: 4, isWorkingDay: true, periods: [{ start: '09:00', end: '15:00', type: 'work' }] },
          { day: 5, isWorkingDay: false, periods: [] },
          { day: 6, isWorkingDay: false, periods: [] }
        ],
        customSchedules: {}
      },
      prayerTimes: {
        fajr: '05:30',
        dhuhr: '12:15',
        asr: '15:45',
        maghrib: '18:30',
        isha: '20:00',
        sunrise: '06:45',
        sunset: '18:15',
        calculationMethod: 'Makkah',
        lastUpdated: new Date()
      },
      weekendDays: [5, 6], // Friday, Saturday
      holidays: [],
      colorPreferences: {
        primary: '#2E7D32', // Islamic green
        secondary: '#FFC107', // Gold
        accent: '#8E24AA',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        background: '#FAFAFA',
        surface: '#FFFFFF',
        text: '#212121',
        culturallyAppropriate: true
      },
      layoutPreferences: {
        textAlignment: 'right',
        navigationPosition: 'right',
        readingFlow: 'rtl',
        iconAlignment: 'right',
        formLayout: 'rtl',
        tableLayout: 'rtl'
      },
      contentGuidelines: {
        avoidImages: ['alcohol', 'pork', 'gambling', 'inappropriate_clothing'],
        culturalSensitivities: ['religious_respect', 'gender_appropriateness', 'family_values'],
        preferredTerminology: {
          'customer': 'عميل',
          'user': 'مستخدم',
          'product': 'منتج',
          'service': 'خدمة',
          'order': 'طلب',
          'payment': 'دفع',
          'delivery': 'توصيل'
        },
        formattingRules: [
          { type: 'text', locale: 'ar-SA', format: 'RTL with proper word spacing', example: 'مرحباً بكم في منصة بنّا' },
          { type: 'date', locale: 'ar-SA', format: 'DD/MM/YYYY', example: '١٥/٠٧/٢٠٢٥' },
          { type: 'number', locale: 'ar-SA', format: 'Eastern Arabic numerals', example: '١٬٢٣٤٫٥٦' },
          { type: 'currency', locale: 'ar-SA', format: 'Amount + Currency', example: '١٢٣٫٤٥ ر.س' },
          { type: 'address', locale: 'ar-SA', format: 'Building, Street, District, City', example: 'مبنى ١٢٣، شارع الملك فهد، حي العليا، الرياض' }
        ]
      }
    };

    this.culturalAdaptations.set('ar-SA', saudiAdaptation);
  }

  private initializeHijriCalendar(): void {
    this.hijriCalendar = [
      {
        id: 'muharram_1',
        type: 'islamic',
        name: 'Islamic New Year',
        nameArabic: 'رأس السنة الهجرية',
        date: new Date('2025-06-26'), // Approximate Gregorian date
        hijriDate: { year: 1447, month: 1, day: 1, monthName: 'محرم', yearType: 'AH' },
        isHoliday: true,
        affectsBusiness: true,
        description: 'The first day of the Islamic calendar',
        descriptionArabic: 'اليوم الأول من التقويم الإسلامي',
        region: 'SA'
      },
      {
        id: 'ashura',
        type: 'islamic',
        name: 'Day of Ashura',
        nameArabic: 'يوم عاشوراء',
        date: new Date('2025-07-05'),
        hijriDate: { year: 1447, month: 1, day: 10, monthName: 'محرم', yearType: 'AH' },
        isHoliday: true,
        affectsBusiness: true,
        description: 'Day of remembrance in Islam',
        descriptionArabic: 'يوم الذكرى في الإسلام'
      },
      {
        id: 'national_day',
        type: 'national',
        name: 'Saudi National Day',
        nameArabic: 'اليوم الوطني السعودي',
        date: new Date('2025-09-23'),
        hijriDate: { year: 1447, month: 3, day: 18, monthName: 'ربيع الأول', yearType: 'AH' },
        isHoliday: true,
        affectsBusiness: true,
        description: 'Celebration of Saudi Arabia unification',
        descriptionArabic: 'احتفال بتوحيد المملكة العربية السعودية',
        region: 'SA'
      }
    ];
  }

  private initializeRTLRules(): void {
    this.rtlLayoutRules = [
      { selector: '.container', property: 'direction', ltrValue: 'ltr', rtlValue: 'rtl', priority: 1 },
      { selector: '.text-align', property: 'text-align', ltrValue: 'left', rtlValue: 'right', priority: 2 },
      { selector: '.float', property: 'float', ltrValue: 'left', rtlValue: 'right', priority: 3 },
      { selector: '.margin-left', property: 'margin-left', ltrValue: '10px', rtlValue: '0', priority: 4 },
      { selector: '.margin-right', property: 'margin-right', ltrValue: '0', rtlValue: '10px', priority: 4 },
      { selector: '.padding-left', property: 'padding-left', ltrValue: '15px', rtlValue: '0', priority: 5 },
      { selector: '.padding-right', property: 'padding-right', ltrValue: '0', rtlValue: '15px', priority: 5 },
      { selector: '.border-left', property: 'border-left', ltrValue: '1px solid #ccc', rtlValue: 'none', priority: 6 },
      { selector: '.border-right', property: 'border-right', ltrValue: 'none', rtlValue: '1px solid #ccc', priority: 6 },
      { selector: '.flex-row', property: 'flex-direction', ltrValue: 'row', rtlValue: 'row-reverse', priority: 7 },
      { selector: '.navbar', property: 'padding', ltrValue: '0 20px 0 0', rtlValue: '0 0 0 20px', priority: 8 },
      { selector: '.dropdown', property: 'left', ltrValue: '0', rtlValue: 'auto', priority: 9 },
      { selector: '.dropdown', property: 'right', ltrValue: 'auto', rtlValue: '0', priority: 9 }
    ];
  }

  private loadTranslations(): void {
    // Core translations for Arabic
    const coreTranslations = [
      { key: 'welcome', locale: 'ar-SA', value: 'مرحباً بكم', namespace: 'common', verified: true },
      { key: 'welcome', locale: 'en-US', value: 'Welcome', namespace: 'common', verified: true },
      { key: 'dashboard', locale: 'ar-SA', value: 'لوحة التحكم', namespace: 'nav', verified: true },
      { key: 'dashboard', locale: 'en-US', value: 'Dashboard', namespace: 'nav', verified: true },
      { key: 'products', locale: 'ar-SA', value: 'المنتجات', namespace: 'nav', verified: true },
      { key: 'products', locale: 'en-US', value: 'Products', namespace: 'nav', verified: true },
      { key: 'orders', locale: 'ar-SA', value: 'الطلبات', namespace: 'nav', verified: true },
      { key: 'orders', locale: 'en-US', value: 'Orders', namespace: 'nav', verified: true },
      { key: 'customers', locale: 'ar-SA', value: 'العملاء', namespace: 'nav', verified: true },
      { key: 'customers', locale: 'en-US', value: 'Customers', namespace: 'nav', verified: true },
      { key: 'settings', locale: 'ar-SA', value: 'الإعدادات', namespace: 'nav', verified: true },
      { key: 'settings', locale: 'en-US', value: 'Settings', namespace: 'nav', verified: true },
      { key: 'save', locale: 'ar-SA', value: 'حفظ', namespace: 'actions', verified: true },
      { key: 'save', locale: 'en-US', value: 'Save', namespace: 'actions', verified: true },
      { key: 'cancel', locale: 'ar-SA', value: 'إلغاء', namespace: 'actions', verified: true },
      { key: 'cancel', locale: 'en-US', value: 'Cancel', namespace: 'actions', verified: true },
      { key: 'delete', locale: 'ar-SA', value: 'حذف', namespace: 'actions', verified: true },
      { key: 'delete', locale: 'en-US', value: 'Delete', namespace: 'actions', verified: true },
      { key: 'edit', locale: 'ar-SA', value: 'تعديل', namespace: 'actions', verified: true },
      { key: 'edit', locale: 'en-US', value: 'Edit', namespace: 'actions', verified: true },
      { key: 'add', locale: 'ar-SA', value: 'إضافة', namespace: 'actions', verified: true },
      { key: 'add', locale: 'en-US', value: 'Add', namespace: 'actions', verified: true },
      
      // Plural examples
      { 
        key: 'items_count', 
        locale: 'ar-SA', 
        value: 'عنصر', 
        pluralRules: [
          { condition: '=0', value: 'لا توجد عناصر' },
          { condition: '=1', value: 'عنصر واحد' },
          { condition: '=2', value: 'عنصران' },
          { condition: '>2', value: '{count} عناصر' }
        ],
        namespace: 'common',
        verified: true 
      },
      { 
        key: 'items_count', 
        locale: 'en-US', 
        value: 'item', 
        pluralRules: [
          { condition: '=0', value: 'no items' },
          { condition: '=1', value: '1 item' },
          { condition: '>1', value: '{count} items' }
        ],
        namespace: 'common',
        verified: true 
      }
    ];

    coreTranslations.forEach(translation => {
      const key = translation.key;
      if (!this.translations.has(key)) {
        this.translations.set(key, []);
      }
      
      const translationRecord: Translation = {
        ...translation,
        lastUpdated: new Date(),
        translatedBy: 'system'
      };
      
      this.translations.get(key)!.push(translationRecord);
    });
  }

  private startPrayerTimesUpdates(): void {
    // Update prayer times daily
    setInterval(() => {
      this.updatePrayerTimes();
    }, 86400000); // 24 hours
  }

  private updatePrayerTimes(): void {
    // Simulate prayer times update (would use real API in production)
    const adaptation = this.culturalAdaptations.get('ar-SA');
    if (adaptation) {
      adaptation.prayerTimes.lastUpdated = new Date();
      this.emit('prayer_times_updated', adaptation.prayerTimes);
    }
  }

  public setLocale(localeCode: string): boolean {
    const locale = this.locales.get(localeCode);
    if (!locale || !locale.isActive) {
      return false;
    }

    this.currentLocale = localeCode;
    this.emit('locale_changed', { previous: this.currentLocale, current: localeCode });
    return true;
  }

  public getCurrentLocale(): Locale {
    return this.locales.get(this.currentLocale)!;
  }

  public translate(key: string, params?: Record<string, any>, locale?: string): string {
    const targetLocale = locale || this.currentLocale;
    const translations = this.translations.get(key);
    
    if (!translations) {
      return key; // Return key if no translation found
    }

    let translation = translations.find(t => t.locale === targetLocale);
    
    // Fallback to default locale
    if (!translation) {
      translation = translations.find(t => t.locale === this.fallbackLocale);
    }

    // Still no translation, return key
    if (!translation) {
      return key;
    }

    let result = translation.value;

    // Handle pluralization
    if (translation.pluralRules && params?.count !== undefined) {
      const count = params.count;
      const pluralRule = translation.pluralRules.find(rule => {
        if (rule.condition === '=0') return count === 0;
        if (rule.condition === '=1') return count === 1;
        if (rule.condition === '=2') return count === 2;
        if (rule.condition === '>1') return count > 1;
        if (rule.condition === '>2') return count > 2;
        return false;
      });

      if (pluralRule) {
        result = pluralRule.value;
      }
    }

    // Replace parameters
    if (params) {
      Object.keys(params).forEach(param => {
        result = result.replace(`{${param}}`, params[param]);
      });
    }

    return result;
  }

  public formatNumber(number: number, locale?: string): string {
    const targetLocale = locale || this.currentLocale;
    const localeConfig = this.locales.get(targetLocale);
    
    if (!localeConfig) return number.toString();

    const format = localeConfig.numberFormat;
    let formattedNumber = number.toFixed(format.decimalPlaces);

    // Apply decimal separator
    formattedNumber = formattedNumber.replace('.', format.decimalSeparator);

    // Apply thousands separator
    const parts = formattedNumber.split(format.decimalSeparator);
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, format.thousandsSeparator);
    
    formattedNumber = parts.join(format.decimalSeparator);

    // Convert to appropriate numbering system
    if (format.numberingSystem === 'eastern-arabic') {
      formattedNumber = this.convertToEasternArabicNumerals(formattedNumber);
    }

    return formattedNumber;
  }

  public formatCurrency(amount: number, currencyCode?: string, locale?: string): string {
    const targetLocale = locale || this.currentLocale;
    const localeConfig = this.locales.get(targetLocale);
    const currency = currencyCode || localeConfig?.currency || 'SAR';
    
    const formattedAmount = this.formatNumber(amount, targetLocale);
    const currencySymbol = this.getCurrencySymbol(currency);

    if (localeConfig?.numberFormat.currencySymbolPosition === 'before') {
      return `${currencySymbol} ${formattedAmount}`;
    } else {
      return `${formattedAmount} ${currencySymbol}`;
    }
  }

  public formatDate(date: Date, locale?: string, includeHijri?: boolean): string {
    const targetLocale = locale || this.currentLocale;
    const localeConfig = this.locales.get(targetLocale);
    
    if (!localeConfig) return date.toLocaleDateString();

    let gregorianDate = this.formatGregorianDate(date, localeConfig.dateFormat);
    
    if (localeConfig.numberFormat.numberingSystem === 'eastern-arabic') {
      gregorianDate = this.convertToEasternArabicNumerals(gregorianDate);
    }

    if (includeHijri && (localeConfig.calendar === 'hijri' || localeConfig.calendar === 'both')) {
      const hijriDate = this.convertToHijri(date);
      const hijriFormatted = `${hijriDate.day} ${hijriDate.monthName} ${hijriDate.year} ${hijriDate.yearType}`;
      return `${gregorianDate} (${hijriFormatted})`;
    }

    return gregorianDate;
  }

  private formatGregorianDate(date: Date, format: string): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year);
  }

  private convertToHijri(gregorianDate: Date): HijriDate {
    // Simplified Hijri conversion (would use proper library in production)
    const hijriMonths = [
      'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الثانية',
      'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
    ];

    // Approximate conversion (real implementation would be more accurate)
    const hijriYear = gregorianDate.getFullYear() - 579;
    const hijriMonth = gregorianDate.getMonth() + 1;
    const hijriDay = gregorianDate.getDate();

    return {
      year: hijriYear,
      month: hijriMonth,
      day: hijriDay,
      monthName: hijriMonths[hijriMonth - 1],
      yearType: 'AH'
    };
  }

  private convertToEasternArabicNumerals(text: string): string {
    const westernToEastern = {
      '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
      '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
    };

    return text.replace(/[0-9]/g, (digit) => westernToEastern[digit as keyof typeof westernToEastern] || digit);
  }

  private getCurrencySymbol(currencyCode: string): string {
    const currencySymbols: Record<string, string> = {
      'SAR': 'ر.س',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'AED': 'د.إ',
      'KWD': 'د.ك',
      'QAR': 'ر.ق',
      'BHD': '.د.ب'
    };

    return currencySymbols[currencyCode] || currencyCode;
  }

  public generateRTLCSS(): string {
    let css = '';
    
    this.rtlLayoutRules.forEach(rule => {
      css += `[dir="rtl"] ${rule.selector} { ${rule.property}: ${rule.rtlValue}; }\n`;
      css += `[dir="ltr"] ${rule.selector} { ${rule.property}: ${rule.ltrValue}; }\n`;
    });

    return css;
  }

  public getPrayerTimes(locale: string = 'ar-SA'): PrayerTimes | null {
    const adaptation = this.culturalAdaptations.get(locale);
    return adaptation ? adaptation.prayerTimes : null;
  }

  public getBusinessHours(locale: string = 'ar-SA', isRamadan: boolean = false): DaySchedule[] {
    const adaptation = this.culturalAdaptations.get(locale);
    if (!adaptation) return [];

    return isRamadan ? adaptation.businessHours.ramadan : adaptation.businessHours.standard;
  }

  public getHolidays(locale: string = 'ar-SA'): CalendarEvent[] {
    return this.hijriCalendar.filter(event => 
      !event.region || event.region === locale.split('-')[1]
    );
  }

  public getLocalizationStats(locale: string): LocalizationStats {
    const totalKeys = this.translations.size;
    const translatedKeys = Array.from(this.translations.values())
      .filter(translations => translations.some(t => t.locale === locale)).length;
    const verifiedTranslations = Array.from(this.translations.values())
      .reduce((count, translations) => {
        const localeTranslation = translations.find(t => t.locale === locale);
        return count + (localeTranslation?.verified ? 1 : 0);
      }, 0);

    return {
      totalKeys,
      translatedKeys,
      verifiedTranslations,
      completionPercentage: (translatedKeys / totalKeys) * 100,
      lastUpdate: new Date(),
      translators: [], // Would be populated from database
      qualityScore: (verifiedTranslations / translatedKeys) * 100
    };
  }

  public addTranslation(key: string, locale: string, value: string, namespace?: string): void {
    if (!this.translations.has(key)) {
      this.translations.set(key, []);
    }

    const translation: Translation = {
      key,
      locale,
      value,
      namespace,
      lastUpdated: new Date(),
      verified: false
    };

    const translations = this.translations.get(key)!;
    const existingIndex = translations.findIndex(t => t.locale === locale);
    
    if (existingIndex !== -1) {
      translations[existingIndex] = translation;
    } else {
      translations.push(translation);
    }

    this.emit('translation_added', translation);
  }

  public getAvailableLocales(): Locale[] {
    return Array.from(this.locales.values()).filter(locale => locale.isActive);
  }

  public getCulturalAdaptation(locale: string): CulturalAdaptation | null {
    return this.culturalAdaptations.get(locale) || null;
  }
}

// Export singleton instance
export const arabicRTLLocalizationSystem = new ArabicRTLLocalizationSystem();


