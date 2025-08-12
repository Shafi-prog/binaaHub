#!/bin/bash

# 🚀 تشغيل اختبارات منصة بناء هب الشاملة
# Comprehensive BinaaHub Platform Tests Runner

echo "🏗️  منصة بناء هب - تشغيل الاختبارات الشاملة"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
total_tests=0
passed_tests=0

echo "📋 قائمة الاختبارات المتاحة:"
echo "1. فحص بنية قاعدة البيانات"
echo "2. اختبار CRUD شامل"
echo "3. فحص سلامة النظام"
echo "4. اختبارات E2E (إذا كانت Jest مكونة)"
echo ""

# Function to run test and check result
run_test() {
    local test_name="$1"
    local test_file="$2"
    local test_description="$3"
    
    echo -e "${BLUE}🧪 تشغيل: $test_description${NC}"
    echo "▶️  $test_file"
    echo ""
    
    total_tests=$((total_tests + 1))
    
    if node "$test_file"; then
        echo -e "${GREEN}✅ نجح: $test_name${NC}"
        passed_tests=$((passed_tests + 1))
    else
        echo -e "${RED}❌ فشل: $test_name${NC}"
    fi
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

# Navigate to project directory
cd /workspaces/binaaHub

echo "🔍 بدء الاختبارات..."
echo ""

# Test 1: Database Structure Inspection
run_test "فحص قاعدة البيانات" "tests/database-inspector.js" "فحص بنية قاعدة البيانات وتوفر الجداول"

# Test 2: Comprehensive CRUD Tests
run_test "اختبار CRUD" "tests/comprehensive-crud-test.js" "اختبار جميع عمليات CRUD والاستعلامات"

# Test 3: System Health Check
run_test "فحص سلامة النظام" "tests/system-health-check.js" "فحص شامل لسلامة وأداء النظام"

# Summary
echo ""
echo "📊 ملخص النتائج النهائية"
echo "=========================="
echo -e "إجمالي الاختبارات: ${BLUE}$total_tests${NC}"
echo -e "الاختبارات الناجحة: ${GREEN}$passed_tests${NC}"
echo -e "الاختبارات الفاشلة: ${RED}$((total_tests - passed_tests))${NC}"

# Calculate percentage
if [ $total_tests -gt 0 ]; then
    percentage=$(( (passed_tests * 100) / total_tests ))
    echo -e "معدل النجاح: ${YELLOW}$percentage%${NC}"
    
    if [ $percentage -eq 100 ]; then
        echo -e "${GREEN}🎉 جميع الاختبارات نجحت! النظام جاهز للاستخدام.${NC}"
        exit 0
    elif [ $percentage -ge 80 ]; then
        echo -e "${YELLOW}⚠️ معظم الاختبارات نجحت. النظام يعمل مع مشاكل بسيطة.${NC}"
        exit 0
    else
        echo -e "${RED}❌ عدة اختبارات فشلت. يُرجى مراجعة الأخطاء.${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ لا توجد اختبارات للتشغيل${NC}"
    exit 1
fi
