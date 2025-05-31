import { useState } from 'react';

type Locale = 'en' | 'ar';

const translations = {
  en: {
    // Add English translations here
    login: 'Login',
    email: 'Email',
    password: 'Password',
    submit: 'Submit',
    // Add more translations as needed
  },
  ar: {
    // Add Arabic translations here
    login: 'تسجيل الدخول',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    submit: 'إرسال',
    // Add more translations as needed
  },
};

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>('ar');

  const t = (key: string): string => {
    // @ts-expect-error - We know these translations exist
    return translations[locale][key] || key;
  };

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  return {
    t,
    locale,
    changeLocale,
  };
}
