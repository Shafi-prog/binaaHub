#!/usr/bin/env node
/**
 * Arabic Translation Fix Script for Store Pages
 * Converts English button texts and labels to Arabic
 */

const fs = require('fs');
const path = require('path');

// Arabic translations mapping
const translations = {
  // Common button texts
  'Add': 'إضافة',
  'Add Product': 'إضافة منتج',
  'Add new products to your store': 'إضافة منتجات جديدة إلى متجرك',
  'Edit': 'تعديل',
  'Delete': 'حذف',
  'Save': 'حفظ',
  'Cancel': 'إلغاء',
  'Create': 'إنشاء',
  'Create New': 'إنشاء جديد',
  'Update': 'تحديث',
  'Submit': 'إرسال',
  'Search': 'بحث',
  'Filter': 'تصفية',
  'Export': 'تصدير',
  'Import': 'استيراد',
  'Download': 'تنزيل',
  'Upload': 'رفع',
  'View': 'عرض',
  'View Orders': 'عرض الطلبات',
  'View store analytics': 'عرض تحليلات المتجر',
  'Details': 'التفاصيل',
  'Settings': 'الإعدادات',
  'Back': 'رجوع',
  'Next': 'التالي',
  'Previous': 'السابق',
  'Load More': 'تحميل المزيد',
  'Select': 'اختيار',
  'Choose': 'اختر',
  'Browse': 'تصفح',
  'Open': 'فتح',
  'Close': 'إغلاق',
  'Actions': 'الإجراءات',
  'Options': 'الخيارات',
  'Remove': 'إزالة',
  'Clear': 'مسح',
  'Reset': 'إعادة تعيين',
  'Apply': 'تطبيق',
  'Confirm': 'تأكيد',
  
  // Status and labels
  'Active': 'نشط',
  'Inactive': 'غير نشط',
  'Pending': 'معلق',
  'Completed': 'مكتمل',
  'In Progress': 'قيد التنفيذ',
  'Draft': 'مسودة',
  'Published': 'منشور',
  'Unpublished': 'غير منشور',
  
  // Form labels
  'Name': 'الاسم',
  'Description': 'الوصف',
  'Price': 'السعر',
  'Quantity': 'الكمية',
  'Category': 'الفئة',
  'Status': 'الحالة',
  'Date': 'التاريخ',
  'Email': 'البريد الإلكتروني',
  'Phone': 'الهاتف',
  'Address': 'العنوان',
  
  // Messages
  'Success': 'نجح',
  'Error': 'خطأ',
  'Warning': 'تحذير',
  'Info': 'معلومات',
  'Loading': 'جارٍ التحميل',
  'No data found': 'لم يتم العثور على بيانات',
  'Please try again': 'يرجى المحاولة مرة أخرى',
  
  // Placeholders
  'Enter name': 'أدخل الاسم',
  'Enter description': 'أدخل الوصف',
  'Enter price': 'أدخل السعر',
  'Enter quantity': 'أدخل الكمية',
  'Search products': 'ابحث عن المنتجات',
  'Search customers': 'ابحث عن العملاء',
  'Search orders': 'ابحث عن الطلبات'
};

class ArabicTranslationFixer {
  constructor() {
    this.storeDir = './src/app/store';
    this.fixedFiles = [];
    this.errors = [];
  }

  async fixAllPages() {
    console.log('🔧 Starting Arabic translation fixes...\n');
    
    try {
      await this.processDirectory(this.storeDir);
      this.generateSummaryReport();
    } catch (error) {
      console.error('❌ Fix process failed:', error);
    }
  }

  async processDirectory(dirPath) {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      
      if (item.isDirectory() && !item.name.startsWith('.')) {
        await this.processDirectory(fullPath);
      } else if (item.name.endsWith('.tsx') || item.name.endsWith('.ts')) {
        await this.fixFile(fullPath);
      }
    }
  }

  async fixFile(filePath) {
    try {
      const originalContent = fs.readFileSync(filePath, 'utf8');
      let content = originalContent;
      let hasChanges = false;
      const changes = [];

      // Fix quoted strings
      Object.entries(translations).forEach(([english, arabic]) => {
        const patterns = [
          new RegExp(`'${english}'`, 'g'),
          new RegExp(`"${english}"`, 'g'),
          new RegExp(`\`${english}\``, 'g')
        ];

        patterns.forEach(pattern => {
          if (pattern.test(content)) {
            const oldContent = content;
            content = content.replace(pattern, `'${arabic}'`);
            if (content !== oldContent) {
              hasChanges = true;
              changes.push(`${english} → ${arabic}`);
            }
          }
        });
      });

      // Fix placeholder attributes
      Object.entries(translations).forEach(([english, arabic]) => {
        const placeholderPattern = new RegExp(`placeholder=["']${english}["']`, 'g');
        if (placeholderPattern.test(content)) {
          content = content.replace(placeholderPattern, `placeholder="${arabic}"`);
          hasChanges = true;
          changes.push(`placeholder: ${english} → ${arabic}`);
        }
      });

      // Fix aria-label attributes
      Object.entries(translations).forEach(([english, arabic]) => {
        const ariaPattern = new RegExp(`aria-label=["']${english}["']`, 'g');
        if (ariaPattern.test(content)) {
          content = content.replace(ariaPattern, `aria-label="${arabic}"`);
          hasChanges = true;
          changes.push(`aria-label: ${english} → ${arabic}`);
        }
      });

      // Fix title attributes
      Object.entries(translations).forEach(([english, arabic]) => {
        const titlePattern = new RegExp(`title=["']${english}["']`, 'g');
        if (titlePattern.test(content)) {
          content = content.replace(titlePattern, `title="${arabic}"`);
          hasChanges = true;
          changes.push(`title: ${english} → ${arabic}`);
        }
      });

      if (hasChanges) {
        fs.writeFileSync(filePath, content);
        this.fixedFiles.push({
          file: path.relative('.', filePath),
          changes: changes
        });
        console.log(`✅ Fixed ${path.relative('.', filePath)} (${changes.length} changes)`);
        changes.forEach(change => console.log(`   • ${change}`));
      }

    } catch (error) {
      this.errors.push({
        file: filePath,
        error: error.message
      });
      console.error(`❌ Error fixing ${filePath}:`, error.message);
    }
  }

  generateSummaryReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalFilesProcessed: this.fixedFiles.length,
        totalErrors: this.errors.length,
        totalChanges: this.fixedFiles.reduce((sum, file) => sum + file.changes.length, 0)
      },
      fixedFiles: this.fixedFiles,
      errors: this.errors
    };

    fs.writeFileSync('./arabic-translation-fixes-report.json', JSON.stringify(report, null, 2));

    console.log('\n📊 ARABIC TRANSLATION FIXES SUMMARY');
    console.log('===================================');
    console.log(`✅ Files Fixed: ${this.fixedFiles.length}`);
    console.log(`🔧 Total Changes: ${report.summary.totalChanges}`);
    console.log(`❌ Errors: ${this.errors.length}`);
    
    if (this.fixedFiles.length > 0) {
      console.log('\n📄 FILES WITH MOST CHANGES:');
      const sortedFiles = this.fixedFiles
        .sort((a, b) => b.changes.length - a.changes.length)
        .slice(0, 5);
      
      sortedFiles.forEach(file => {
        console.log(`  • ${file.file} (${file.changes.length} changes)`);
      });
    }

    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.errors.forEach(error => {
        console.log(`  • ${error.file}: ${error.error}`);
      });
    }

    console.log(`\n📄 Full report saved to: arabic-translation-fixes-report.json`);
  }
}

// Run the fixer
if (require.main === module) {
  const fixer = new ArabicTranslationFixer();
  fixer.fixAllPages();
}

module.exports = ArabicTranslationFixer;
