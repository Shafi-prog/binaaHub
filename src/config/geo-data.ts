// @ts-nocheck
// src/config/geo-data.ts
// Country, region, city, and district data for project location selection

export const ARAB_COUNTRIES = [
  { value: 'SA', label: 'المملكة العربية السعودية' },
  { value: 'EG', label: 'مصر' },
  { value: 'AE', label: 'الإمارات' },
  { value: 'KW', label: 'الكويت' },
  { value: 'QA', label: 'قطر' },
  { value: 'OM', label: 'عمان' },
  { value: 'BH', label: 'البحرين' },
  { value: 'JO', label: 'الأردن' },
  { value: 'LB', label: 'لبنان' },
  { value: 'MA', label: 'المغرب' },
  { value: 'DZ', label: 'الجزائر' },
  { value: 'TN', label: 'تونس' },
  { value: 'IQ', label: 'العراق' },
  { value: 'SD', label: 'السودان' },
  { value: 'YE', label: 'اليمن' },
  { value: 'LY', label: 'ليبيا' },
  { value: 'SY', label: 'سوريا' },
];

export const SAUDI_REGIONS = [
  { value: 'central', label: 'المنطقة الوسطى', cities: [
    { value: 'riyadh', label: 'الرياض' },
    { value: 'dawadmi', label: 'الدوادمي' },
    { value: 'majmaah', label: 'المجمعة' },
    { value: 'wadi-dawaser', label: 'وادي الدواسر' },
    { value: 'afif', label: 'عفيف' },
    { value: 'shaqra', label: 'شقراء' },
    { value: 'hotat-bani-tamim', label: 'حوطة بني تميم' },
  ]},
  { value: 'western', label: 'المنطقة الغربية', cities: [
    { value: 'jeddah', label: 'جدة' },
    { value: 'makkah', label: 'مكة المكرمة' },
    { value: 'madinah', label: 'المدينة المنورة' },
    { value: 'taif', label: 'الطائف' },
    { value: 'yanbu', label: 'ينبع' },
    { value: 'rabigh', label: 'رابغ' },
  ]},
  { value: 'eastern', label: 'المنطقة الشرقية', cities: [
    { value: 'dammam', label: 'الدمام' },
    { value: 'khobar', label: 'الخبر' },
    { value: 'dhahran', label: 'الظهران' },
    { value: 'al-hasa', label: 'الأحساء' },
    { value: 'jubail', label: 'الجبيل' },
    { value: 'qatif', label: 'القطيف' },
    { value: 'hafr-al-batin', label: 'حفر الباطن' },
  ]},
  { value: 'northern', label: 'المنطقة الشمالية', cities: [
    { value: 'ar-ar', label: 'عرعر' },
    { value: 'rafha', label: 'رفحاء' },
    { value: 'turaif', label: 'طريف' },
    { value: 'sakaka', label: 'سكاكا' },
    { value: 'domat-al-jandal', label: 'دومة الجندل' },
  ]},
  { value: 'southern', label: 'المنطقة الجنوبية', cities: [
    { value: 'abha', label: 'أبها' },
    { value: 'khamis-mushait', label: 'خميس مشيط' },
    { value: 'najran', label: 'نجران' },
    { value: 'jazan', label: 'جازان' },
    { value: 'bishah', label: 'بيشة' },
    { value: 'baha', label: 'الباحة' },
  ]},
];

// For demo: districts are not exhaustive, just a few for each city
export const SAUDI_DISTRICTS: Record<string, { value: string; label: string }[]> = {
  riyadh: [
    { value: 'al-murabba', label: 'المربع' },
    { value: 'al-olaya', label: 'العليا' },
    { value: 'al-naseem', label: 'النسيم' },
    { value: 'al-yasmin', label: 'الياسمين' },
  ],
  jeddah: [
    { value: 'al-safa', label: 'الصفا' },
    { value: 'al-rawda', label: 'الروضة' },
    { value: 'al-nahda', label: 'النهضة' },
    { value: 'al-hamra', label: 'الحمرا' },
  ],
  dammam: [
    { value: 'al-shati', label: 'الشاطئ' },
    { value: 'al-faisaliah', label: 'الفيصلية' },
    { value: 'al-badiyah', label: 'البادية' },
  ],
};


