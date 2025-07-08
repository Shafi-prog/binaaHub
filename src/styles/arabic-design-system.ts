// @ts-nocheck
/**
 * Arabic Design System
 * نظام التصميم العربي لمنصة بِنَّا
 */

export const arabicDesignSystem = {
  // الألوان - Colors
  colors: {
    // الألوان الأساسية
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    
    // الألوان الثانوية
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },

    // ألوان النجاح
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },

    // ألوان التحذير
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },

    // ألوان الخطر
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },

    // الألوان المحايدة
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
  },

  // المسافات - Spacing
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '2rem',   // 32px
    '4xl': '2.5rem', // 40px
    '5xl': '3rem',   // 48px
    '6xl': '4rem',   // 64px
    '7xl': '5rem',   // 80px
    '8xl': '6rem',   // 96px
  },

  // خصائص الخط العربي
  typography: {
    fonts: {
      primary: ['Tajawal', 'Arial Unicode MS', 'Tahoma', 'sans-serif'],
      secondary: ['Noto Sans Arabic', 'Arial Unicode MS', 'Tahoma', 'sans-serif'],
      monospace: ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
    },

    fontSizes: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
    },

    fontWeights: {
      light: 200,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },

    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },

    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
    },
  },

  // نصف الأقطار - Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // الظلال
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',
  },

  // نقاط التوقف للاستجابة
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // الحركات والانتقالات
  transitions: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    timing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },

  // مقاسات المكونات
  components: {
    button: {
      height: {
        sm: '2rem',    // 32px
        md: '2.5rem',  // 40px
        lg: '3rem',    // 48px
        xl: '3.5rem',  // 56px
      },
      padding: {
        sm: '0.5rem 0.75rem',
        md: '0.625rem 1rem',
        lg: '0.75rem 1.5rem',
        xl: '1rem 2rem',
      },
    },

    input: {
      height: {
        sm: '2rem',
        md: '2.5rem',
        lg: '3rem',
        xl: '3.5rem',
      },
      padding: {
        sm: '0.375rem 0.75rem',
        md: '0.5rem 0.75rem',
        lg: '0.75rem 1rem',
        xl: '1rem 1.25rem',
      },
    },

    card: {
      padding: {
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
      },
    },
  },

  // الأيقونات
  icons: {
    size: {
      xs: '1rem',
      sm: '1.25rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '2.5rem',
      '2xl': '3rem',
    },
  },

  // قيم الـ Z-Index
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    overlay: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

// مساعدات للوصول للقيم
export const getColor = (color: string, shade: number = 500) => {
  const colorFamily = arabicDesignSystem.colors[color as keyof typeof arabicDesignSystem.colors];
  if (colorFamily && typeof colorFamily === 'object') {
    return (colorFamily as any)[shade] || colorFamily[500];
  }
  return color;
};

export const getSpacing = (size: keyof typeof arabicDesignSystem.spacing) => {
  return arabicDesignSystem.spacing[size];
};

export const getFontSize = (size: keyof typeof arabicDesignSystem.typography.fontSizes) => {
  return arabicDesignSystem.typography.fontSizes[size];
};

export const getBorderRadius = (size: keyof typeof arabicDesignSystem.borderRadius) => {
  return arabicDesignSystem.borderRadius[size];
};

export const getShadow = (size: keyof typeof arabicDesignSystem.boxShadow) => {
  return arabicDesignSystem.boxShadow[size];
};

// خصائص الموضوع العربي
export const arabicTheme = {
  // الألوان الموضوعية
  semantic: {
    text: {
      primary: arabicDesignSystem.colors.neutral[900],
      secondary: arabicDesignSystem.colors.neutral[600],
      muted: arabicDesignSystem.colors.neutral[500],
      disabled: arabicDesignSystem.colors.neutral[400],
      inverse: arabicDesignSystem.colors.neutral[50],
    },
    background: {
      primary: arabicDesignSystem.colors.neutral[50],
      secondary: arabicDesignSystem.colors.neutral[100],
      tertiary: arabicDesignSystem.colors.neutral[200],
      inverse: arabicDesignSystem.colors.neutral[900],
    },
    border: {
      primary: arabicDesignSystem.colors.neutral[200],
      secondary: arabicDesignSystem.colors.neutral[300],
      focus: arabicDesignSystem.colors.primary[500],
    },
    interactive: {
      primary: arabicDesignSystem.colors.primary[600],
      primaryHover: arabicDesignSystem.colors.primary[700],
      secondary: arabicDesignSystem.colors.neutral[100],
      secondaryHover: arabicDesignSystem.colors.neutral[200],
    },
    status: {
      success: arabicDesignSystem.colors.success[500],
      warning: arabicDesignSystem.colors.warning[500],
      error: arabicDesignSystem.colors.danger[500],
      info: arabicDesignSystem.colors.primary[500],
    },
  },

  // إعدادات خاصة بالعربية
  arabic: {
    // اتجاه النص
    direction: 'rtl',
    
    // محاذاة النص
    textAlign: 'right',
    
    // مسافات خاصة بالنصوص العربية
    textSpacing: {
      wordSpacing: '0.1em',
      letterSpacing: '0.02em',
    },

    // ارتفاعات الأسطر المُحسّنة للعربية
    lineHeight: {
      heading: 1.3,
      body: 1.7,
      caption: 1.5,
    },

    // هوامش خاصة بالنصوص العربية
    margins: {
      paragraph: '1.25em',
      heading: '1.5em 0 0.75em 0',
      list: '1em 2em 1em 0',
    },
  },

  // إعدادات الاستجابة
  responsive: {
    mobile: {
      fontSize: {
        scale: 0.9,
      },
      spacing: {
        scale: 0.8,
      },
    },
    tablet: {
      fontSize: {
        scale: 0.95,
      },
      spacing: {
        scale: 0.9,
      },
    },
    desktop: {
      fontSize: {
        scale: 1,
      },
      spacing: {
        scale: 1,
      },
    },
  },
};

export default arabicDesignSystem;


