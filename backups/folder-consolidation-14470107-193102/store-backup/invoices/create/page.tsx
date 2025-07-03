'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import jsPDF from 'jspdf';
import { 
  ArrowLeft,
  Plus,
  Minus,
  Calculator,
  Save,
  Send,
  FileText,
  User,
  Building,
  CreditCard,
  QrCode,
  AlertTriangle,
  Search,
  Users,
  Phone,
  Mail,
  Camera,
  Scan,
  Package,
  ShoppingCart,
  X,
  Check,  Archive,
  Printer
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BarcodeScanner from '@/components/BarcodeScannerPOS';

interface InvoiceItem {
  id: string;
  product_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
}

interface Customer {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  vat_number?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  user_id?: string;
  projects?: Array<{
    id: string;
    name: string;
    status: string;
  }>;
}

interface CustomerSearchResult {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  user_id: string;
  projects_count: number;
  recent_order_date?: string;
  total_orders: number;
  projects?: Array<{
    id: string;
    name: string;
    status: string;
  }>;
}

export default function CreateInvoice() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [storeSettings, setStoreSettings] = useState<any>(null);
  
  // Invoice data
  const [invoiceType, setInvoiceType] = useState<'standard' | 'simplified'>('standard');
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    email: '',
    phone: '',
    vat_number: '',
    address: '',
    city: '',
    postal_code: ''
  });
  
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: '1',
      description: '',
      quantity: 1,
      unit_price: 0,
      discount_amount: 0,
      tax_rate: 0.15,
      tax_amount: 0,
      total_amount: 0
    }
  ]);
  
  const [invoiceSettings, setInvoiceSettings] = useState({
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    payment_terms: 'Net 30',
    notes: '',
    discount_percentage: 0,
    shipping_amount: 0
  });  // Customer search state
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [customerSearchResults, setCustomerSearchResults] = useState<CustomerSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('');  const [selectedSearchIndex, setSelectedSearchIndex] = useState(-1);
  const [recentCustomers, setRecentCustomers] = useState<CustomerSearchResult[]>([]);

  // Barcode scanner state
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    loadInitialData();
  }, []);
  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      // Load store settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('store_settings')
        .select('*')
        .eq('store_id', currentUser.id)
        .single();

      if (!settingsError) {
        setStoreSettings(settingsData);
        // Update default tax rate for items
        setItems(prev => prev.map(item => ({
          ...item,
          tax_rate: settingsData.default_vat_rate || 0.15
        })));
      }

      // Load recent customers for this store
      await loadRecentCustomers();

    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate item totals
  const calculateItemTotal = (item: InvoiceItem) => {
    const subtotal = item.quantity * item.unit_price;
    const discountedAmount = subtotal - item.discount_amount;
    const taxAmount = discountedAmount * item.tax_rate;
    return {
      subtotal,
      discountedAmount,
      taxAmount,
      total: discountedAmount + taxAmount
    };
  };

  // Update item calculations
  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Recalculate totals
    const calculations = calculateItemTotal(newItems[index]);
    newItems[index].tax_amount = calculations.taxAmount;
    newItems[index].total_amount = calculations.total;
    
    setItems(newItems);
  };

  // Add new item
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unit_price: 0,
      discount_amount: 0,
      tax_rate: storeSettings?.default_vat_rate || 0.15,
      tax_amount: 0,
      total_amount: 0
    };
    setItems([...items, newItem]);
  };
  // Remove item
  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Handle barcode scanner product selection
  const handleBarcodeProductSelect = (product: any) => {
    // Check if product already exists in items
    const existingItemIndex = items.findIndex(item => 
      item.product_id === product.id || item.description === product.name
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const newItems = [...items];
      newItems[existingItemIndex].quantity += 1;
      
      // Recalculate totals for the updated item
      const calculations = calculateItemTotal(newItems[existingItemIndex]);
      newItems[existingItemIndex].tax_amount = calculations.taxAmount;
      newItems[existingItemIndex].total_amount = calculations.total;
      
      setItems(newItems);
    } else {
      // Add new item from barcode scan
      const newItem: InvoiceItem = {
        id: Date.now().toString(),
        product_id: product.id,
        description: product.name || product.description || '',
        quantity: 1,
        unit_price: product.sale_price || product.price || 0,
        discount_amount: 0,
        tax_rate: storeSettings?.default_vat_rate || 0.15,
        tax_amount: 0,
        total_amount: 0
      };

      // Calculate totals for the new item
      const calculations = calculateItemTotal(newItem);
      newItem.tax_amount = calculations.taxAmount;
      newItem.total_amount = calculations.total;

      setItems([...items, newItem]);
    }

    // Close barcode scanner
    setShowBarcodeScanner(false);
  };
  // Customer search functions
  const searchCustomers = async (searchTerm: string) => {
    if (!searchTerm.trim() || searchTerm.length < 2) {
      setCustomerSearchResults([]);
      setSelectedSearchIndex(-1);
      return;
    }

    try {
      setIsSearching(true);
      
      // Search users in the platform with enhanced query
      const { data: users, error } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          phone,
          city,
          region,
          projects:projects(id, name, status),
          orders:orders(id, total_amount, created_at)
        `)
        .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
        .eq('account_type', 'user')
        .limit(10);

      if (error) throw error;

      // Transform to CustomerSearchResult format with order history
      const searchResults: CustomerSearchResult[] = users?.map(user => {
        const orders = user.orders || [];
        const recentOrder = orders.length > 0 ? 
          orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] : null;
        
        return {
          id: user.id,
          name: user.name || user.email || 'مستخدم غير معروف',
          email: user.email,
          phone: user.phone,
          user_id: user.id,
          projects_count: user.projects?.length || 0,
          total_orders: orders.length,
          recent_order_date: recentOrder?.created_at,
          projects: user.projects?.map(p => ({
            id: p.id,
            name: p.name,
            status: p.status
          })) || []
        };
      }) || [];

      setCustomerSearchResults(searchResults);
      setSelectedSearchIndex(-1);
    } catch (error) {
      console.error('Error searching customers:', error);
      setCustomerSearchResults([]);
      setSelectedSearchIndex(-1);
    } finally {
      setIsSearching(false);
    }
  };

  // Load recent customers
  const loadRecentCustomers = async () => {
    try {
      const { data: recentInvoices, error } = await supabase
        .from('invoices')
        .select(`
          buyer_name,
          buyer_email,
          buyer_phone,
          user_id,
          created_at
        `)
        .eq('store_id', user?.id)
        .not('buyer_name', 'is', null)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      // Convert to unique recent customers
      const uniqueCustomers = new Map();
      recentInvoices?.forEach(invoice => {
        const key = invoice.buyer_email || invoice.buyer_phone || invoice.buyer_name;
        if (!uniqueCustomers.has(key)) {
          uniqueCustomers.set(key, {
            id: invoice.user_id || `temp_${Date.now()}_${Math.random()}`,
            name: invoice.buyer_name,
            email: invoice.buyer_email,
            phone: invoice.buyer_phone,
            user_id: invoice.user_id,
            projects_count: 0,
            total_orders: 1,
            recent_order_date: invoice.created_at,
            projects: []
          });
        }
      });

      setRecentCustomers(Array.from(uniqueCustomers.values()));
    } catch (error) {
      console.error('Error loading recent customers:', error);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showCustomerSearch || customerSearchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSearchIndex(prev => 
          prev < customerSearchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSearchIndex(prev => 
          prev > 0 ? prev - 1 : customerSearchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSearchIndex >= 0 && selectedSearchIndex < customerSearchResults.length) {
          selectCustomer(customerSearchResults[selectedSearchIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowCustomerSearch(false);
        setSelectedSearchIndex(-1);
        break;
    }
  };
  // Handle customer selection
  const selectCustomer = (searchResult: CustomerSearchResult) => {
    setCustomer({
      id: searchResult.id,
      user_id: searchResult.user_id,
      name: searchResult.name,
      email: searchResult.email || '',
      phone: searchResult.phone || '',
      vat_number: '',
      address: '',
      city: '',
      postal_code: '',
      projects: searchResult.projects
    });
    
    setShowCustomerSearch(false);
    setCustomerSearchTerm(searchResult.name);
    setCustomerSearchResults([]);
    setSelectedSearchIndex(-1);
    
    // Add to recent customers if not already there
    setRecentCustomers(prev => {
      const existing = prev.find(c => c.id === searchResult.id);
      if (!existing) {
        return [searchResult, ...prev.slice(0, 4)]; // Keep only 5 recent
      }
      return prev;
    });
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (customerSearchTerm && showCustomerSearch) {
        searchCustomers(customerSearchTerm);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [customerSearchTerm, showCustomerSearch]);

  // Click outside handler to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.customer-search-container')) {
        setShowCustomerSearch(false);
      }
    };

    if (showCustomerSearch) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCustomerSearch]);

  // Calculate invoice totals
  const calculateInvoiceTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const totalDiscount = items.reduce((sum, item) => sum + item.discount_amount, 0);
    const discountedSubtotal = subtotal - totalDiscount;
    const totalTax = items.reduce((sum, item) => sum + item.tax_amount, 0);
    const total = discountedSubtotal + totalTax + invoiceSettings.shipping_amount;

    return {
      subtotal,
      totalDiscount,
      discountedSubtotal,
      totalTax,
      shippingAmount: invoiceSettings.shipping_amount,
      total
    };
  };

  const totals = calculateInvoiceTotals();

  // Generate invoice number
  const generateInvoiceNumber = () => {
    const prefix = storeSettings?.invoice_prefix || 'INV';
    const counter = storeSettings?.invoice_counter || 1;
    const year = new Date().getFullYear();
    return `${prefix}-${year}-${counter.toString().padStart(4, '0')}`;
  };

  // Generate PDF invoice
  const generateInvoicePDF = () => {
    try {
      const doc = new jsPDF();
      
      // Set font size and add title
      doc.setFontSize(18);
      doc.text('فاتورة / Invoice', 105, 20, { align: 'center' });
      
      // Invoice details
      const invoiceNumber = generateInvoiceNumber();
      doc.setFontSize(12);
      doc.text(`رقم الفاتورة / Invoice #: ${invoiceNumber}`, 20, 40);
      doc.text(`تاريخ الإصدار / Date: ${invoiceSettings.issue_date}`, 20, 50);
      doc.text(`تاريخ الاستحقاق / Due Date: ${invoiceSettings.due_date}`, 20, 60);
      
      // Store information
      doc.setFontSize(14);
      doc.text('بيانات المتجر / Store Information', 20, 80);
      doc.setFontSize(10);
      doc.text(`اسم المتجر / Store Name: ${storeSettings?.store_name || 'المتجر'}`, 20, 90);
      if (storeSettings?.store_address) {
        doc.text(`العنوان / Address: ${storeSettings.store_address}`, 20, 100);
      }
      if (storeSettings?.store_phone) {
        doc.text(`الهاتف / Phone: ${storeSettings.store_phone}`, 20, 110);
      }
      
      // Customer information
      doc.setFontSize(14);
      doc.text('بيانات العميل / Customer Information', 20, 130);
      doc.setFontSize(10);
      doc.text(`الاسم / Name: ${customer.name}`, 20, 140);
      if (customer.email) {
        doc.text(`البريد الإلكتروني / Email: ${customer.email}`, 20, 150);
      }
      if (customer.phone) {
        doc.text(`الهاتف / Phone: ${customer.phone}`, 20, 160);
      }
      if (customer.vat_number) {
        doc.text(`الرقم الضريبي / VAT Number: ${customer.vat_number}`, 20, 170);
      }
      
      // Items table header
      let yPosition = 190;
      doc.setFontSize(12);
      doc.text('البنود / Items', 20, yPosition);
      yPosition += 10;
      
      // Table headers
      doc.setFontSize(10);
      doc.text('الوصف / Description', 20, yPosition);
      doc.text('الكمية / Qty', 100, yPosition);
      doc.text('السعر / Price', 130, yPosition);
      doc.text('الإجمالي / Total', 160, yPosition);
      yPosition += 10;
      
      // Draw line under headers
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 5;
      
      // Add items
      items.forEach((item) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(item.description.substring(0, 25), 20, yPosition);
        doc.text(item.quantity.toString(), 100, yPosition);
        doc.text(`${item.unit_price.toFixed(2)} ريال`, 130, yPosition);
        doc.text(`${item.total_amount.toFixed(2)} ريال`, 160, yPosition);
        yPosition += 8;
      });
      
      // Add totals
      yPosition += 10;
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 10;
      
      doc.text(`المجموع الفرعي / Subtotal: ${totals.subtotal.toFixed(2)} ريال`, 120, yPosition);
      yPosition += 8;
      
      if (totals.totalDiscount > 0) {
        doc.text(`الخصم / Discount: -${totals.totalDiscount.toFixed(2)} ريال`, 120, yPosition);
        yPosition += 8;
      }
      
      doc.text(`ضريبة القيمة المضافة / VAT: ${totals.totalTax.toFixed(2)} ريال`, 120, yPosition);
      yPosition += 8;
      
      if (totals.shippingAmount > 0) {
        doc.text(`رسوم الشحن / Shipping: ${totals.shippingAmount.toFixed(2)} ريال`, 120, yPosition);
        yPosition += 8;
      }
      
      // Draw line above total
      doc.line(120, yPosition, 190, yPosition);
      yPosition += 5;
      
      doc.setFontSize(12);
      doc.text(`المجموع الكلي / Total: ${totals.total.toFixed(2)} ريال`, 120, yPosition);
      
      // Add notes if any
      if (invoiceSettings.notes) {
        yPosition += 20;
        doc.setFontSize(10);
        doc.text('ملاحظات / Notes:', 20, yPosition);
        yPosition += 8;
        doc.text(invoiceSettings.notes, 20, yPosition, { maxWidth: 170 });
      }
      
      // Save the PDF
      doc.save(`invoice-${invoiceNumber}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('حدث خطأ في إنشاء ملف PDF');
    }
  };

  // Save invoice
  const saveInvoice = async (status: 'draft' | 'sent') => {
    try {
      setLoading(true);

      const invoiceNumber = generateInvoiceNumber();
      
      const invoiceData = {
        store_id: user.id,
        invoice_number: invoiceNumber,
        invoice_type: invoiceType,
        issue_date: invoiceSettings.issue_date,
        due_date: invoiceSettings.due_date,
        
        // Customer details
        buyer_name: customer.name,
        buyer_email: customer.email,
        buyer_phone: customer.phone,
        buyer_vat_number: customer.vat_number,
        buyer_address: customer.address,
        buyer_city: customer.city,
        buyer_postal_code: customer.postal_code,
        user_id: customer.user_id, // Link to platform user if selected
        project_id: selectedProject || null, // Link to project if selected
        
        // Amounts
        subtotal_amount: totals.subtotal,
        discount_amount: totals.totalDiscount,
        tax_amount: totals.totalTax,
        shipping_amount: totals.shippingAmount,
        total_amount: totals.total,
        
        // Settings
        currency: storeSettings?.currency || 'SAR',
        payment_terms: invoiceSettings.payment_terms,
        notes: invoiceSettings.notes,
        
        // Status
        status: status,
        zatca_submission_status: 'pending',
        is_zatca_compliant: invoiceType === 'standard' && customer.vat_number ? true : false
      };

      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert(invoiceData)
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Insert invoice items
      const itemsData = items.map(item => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_amount: item.discount_amount,
        tax_rate: item.tax_rate,
        tax_amount: item.tax_amount,
        total_amount: item.total_amount
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsData);

      if (itemsError) throw itemsError;

      // Update store settings counter
      await supabase
        .from('store_settings')
        .update({ 
          invoice_counter: (storeSettings?.invoice_counter || 1) + 1 
        })
        .eq('store_id', user.id);

      // Create notification for the customer if they are a platform user
      if (customer.user_id && status === 'sent') {
        try {
          await supabase.from('notifications').insert({
            user_id: customer.user_id,
            type: 'invoice_received',
            title: 'فاتورة جديدة',
            message: `تم إرسال فاتورة جديدة إليك من ${storeSettings?.store_name || 'المتجر'} بقيمة ${totals.total.toFixed(2)} ريال`,
            data: {
              invoice_id: invoice.id,
              invoice_number: invoiceNumber,
              amount: totals.total,
              store_name: storeSettings?.store_name
            },
            is_read: false,
            priority: 'normal',
            channel: 'app'
          });
        } catch (notificationError) {
          console.error('Error creating notification:', notificationError);
          // Don't fail the invoice creation if notification fails
        }
      }      // Show success message
      alert(`تم ${status === 'draft' ? 'حفظ' : 'إرسال'} الفاتورة بنجاح!`);

      // Redirect to invoice view
      router.push(`/store/invoices/${invoice.id}`);

    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('حدث خطأ في حفظ الفاتورة');    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل نموذج الفاتورة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/store/invoices">
                <Button variant="outline" size="sm" className="ml-4">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">إنشاء فاتورة جديدة</h1>
                <p className="mt-1 text-sm text-gray-600">
                  أنشئ فاتورة إلكترونية متوافقة مع زاتكا
                </p>
              </div>
            </div>            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={generateInvoicePDF}
                disabled={loading || !customer.name || items.every(item => !item.description)}
                className="bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                <Printer className="w-4 h-4 ml-2" />
                طباعة PDF
              </Button>
              <Button 
                variant="outline" 
                onClick={() => saveInvoice('draft')}
                disabled={loading}
              >
                <Save className="w-4 h-4 ml-2" />
                حفظ كمسودة
              </Button>
              <Button 
                onClick={() => saveInvoice('sent')}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4 ml-2" />
                إرسال الفاتورة
              </Button>
              <Button 
                onClick={generateInvoicePDF}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                <Printer className="w-4 h-4 ml-2" />
                تحميل PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice Type */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">نوع الفاتورة</h3>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setInvoiceType('standard')}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    invoiceType === 'standard' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center">
                    <Building className="w-5 h-5 text-blue-600 ml-2" />
                    <div>
                      <div className="font-medium">فاتورة عادية</div>
                      <div className="text-sm text-gray-500">للشركات والمؤسسات</div>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setInvoiceType('simplified')}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    invoiceType === 'simplified' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-green-600 ml-2" />
                    <div>
                      <div className="font-medium">فاتورة مبسطة</div>
                      <div className="text-sm text-gray-500">للأفراد والعملاء المباشرين</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>            {/* Customer Information with Enhanced Search */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <Users className="w-5 h-5 inline ml-2" />
                بيانات العميل
              </h3>
              
              {/* Customer Search Section */}
              <div className="mb-6 space-y-4">
                <div className="relative customer-search-container">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البحث عن عميل *
                  </label>                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      value={customerSearchTerm}
                      onChange={(e) => {
                        setCustomerSearchTerm(e.target.value);
                        setShowCustomerSearch(true);
                        setSelectedSearchIndex(-1);
                        if (!e.target.value.trim()) {
                          setCustomer({
                            name: '',
                            email: '',
                            phone: '',
                            vat_number: '',
                            address: '',
                            city: '',
                            postal_code: ''
                          });
                        }
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="ابحث عن عميل بالاسم أو البريد الإلكتروني أو رقم الهاتف..."
                      className="pr-10"
                      onFocus={() => setShowCustomerSearch(true)}
                    />
                    {isSearching && (
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                  </div>
                    {/* Search Results Dropdown */}
                  {showCustomerSearch && (customerSearchResults.length > 0 || (!customerSearchTerm && recentCustomers.length > 0)) && (
                    <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                      {/* Recent Customers Section */}
                      {!customerSearchTerm && recentCustomers.length > 0 && (
                        <>
                          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
                            العملاء المتكررين
                          </div>
                          {recentCustomers.map((result, index) => (
                            <div
                              key={result.id}
                              className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                                selectedSearchIndex === index ? 'bg-blue-50 border-blue-200' : ''
                              }`}
                              onClick={() => selectCustomer(result)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <span className="font-medium text-gray-900">{result.name}</span>
                                  </div>
                                  
                                  <div className="space-y-1 text-sm text-gray-600">
                                    {result.email && (
                                      <div className="flex items-center gap-2">
                                        <Mail className="w-3 h-3" />
                                        <span>{result.email}</span>
                                      </div>
                                    )}
                                    {result.phone && (
                                      <div className="flex items-center gap-2">
                                        <Phone className="w-3 h-3" />
                                        <span>{result.phone}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500 ml-2">
                                  عميل سابق
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                      
                      {/* Search Results Section */}
                      {customerSearchResults.length > 0 && (
                        <>
                          {!customerSearchTerm && recentCustomers.length > 0 && (
                            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
                              نتائج البحث
                            </div>
                          )}
                          {customerSearchResults.map((result, index) => {
                            const adjustedIndex = !customerSearchTerm ? index + recentCustomers.length : index;
                            return (
                              <div
                                key={result.id}
                                className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                                  selectedSearchIndex === adjustedIndex ? 'bg-blue-50 border-blue-200' : ''
                                }`}
                                onClick={() => selectCustomer(result)}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <User className="w-4 h-4 text-gray-500" />
                                      <span className="font-medium text-gray-900">{result.name}</span>
                                    </div>
                                    
                                    <div className="space-y-1 text-sm text-gray-600">
                                      {result.email && (
                                        <div className="flex items-center gap-2">
                                          <Mail className="w-3 h-3" />
                                          <span>{result.email}</span>
                                        </div>
                                      )}
                                      {result.phone && (
                                        <div className="flex items-center gap-2">
                                          <Phone className="w-3 h-3" />
                                          <span>{result.phone}</span>
                                        </div>
                                      )}
                                    </div>
                                    
                                    {/* Project Information */}
                                    {result.projects && result.projects.length > 0 && (
                                      <div className="mt-2 pt-2 border-t border-gray-100">
                                        <div className="text-xs text-gray-500 mb-1">
                                          المشاريع ({result.projects_count}):
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                          {result.projects.slice(0, 3).map((project) => (
                                            <span
                                              key={project.id}
                                              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                                            >
                                              {project.name}
                                            </span>
                                          ))}
                                          {result.projects.length > 3 && (
                                            <span className="text-xs text-gray-500">
                                              +{result.projects.length - 3} أخرى
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="text-xs text-gray-500 ml-2">
                                    {result.total_orders > 0 && (
                                      <div>{result.total_orders} طلب سابق</div>
                                    )}
                                    {result.recent_order_date && (
                                      <div className="mt-1">
                                        آخر طلب: {new Date(result.recent_order_date).toLocaleDateString('ar-SA')}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
                  )}
                    {/* No Results Message */}
                  {showCustomerSearch && customerSearchTerm && !isSearching && customerSearchResults.length === 0 && customerSearchTerm.length >= 2 && (
                    <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                      <div className="text-center text-gray-500">
                        <div className="mb-2">لم يتم العثور على عملاء مطابقين للبحث "{customerSearchTerm}"</div>
                        <div className="text-sm">يمكنك إدخال البيانات يدوياً أدناه أو تجربة كلمات بحث أخرى.</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Keyboard Shortcuts Hint */}
                  {showCustomerSearch && (customerSearchResults.length > 0 || (!customerSearchTerm && recentCustomers.length > 0)) && (
                    <div className="absolute z-10 bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 px-4 py-2 text-xs text-gray-500 rounded-b-lg">
                      <div className="flex justify-center gap-4">
                        <span>↑↓ للتنقل</span>
                        <span>Enter للاختيار</span>
                        <span>Esc للإغلاق</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Selected Customer Info */}
                {customer.user_id && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium text-green-900">تم اختيار العميل: {customer.name}</div>
                          <div className="text-sm text-green-700">
                            {customer.email && `${customer.email} | `}
                            {customer.phone}
                          </div>
                        </div>
                      </div>                      <button
                        type="button"
                        onClick={() => {
                          setCustomer({
                            name: '',
                            email: '',
                            phone: '',
                            vat_number: '',
                            address: '',
                            city: '',
                            postal_code: ''
                          });
                          setCustomerSearchTerm('');
                          setShowCustomerSearch(false);
                          setSelectedProject('');
                          setSelectedSearchIndex(-1);
                        }}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        إلغاء الاختيار
                      </button>
                    </div>
                    
                    {/* Project Selection for Selected Customer */}
                    {customer.projects && customer.projects.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <label className="block text-sm font-medium text-green-800 mb-2">
                          اختيار مشروع (اختياري)
                        </label>
                        <select
                          value={selectedProject}
                          onChange={(e) => setSelectedProject(e.target.value)}
                          className="w-full px-3 py-2 border border-green-300 rounded-lg bg-white text-sm"
                        >
                          <option value="">-- بدون مشروع محدد --</option>
                          {customer.projects.map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.name} ({project.status})
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-green-600 mt-1">
                          ربط الفاتورة بمشروع محدد يساعد في تتبع المصروفات وإدارة المشاريع
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Manual Customer Information Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم العميل *
                  </label>
                  <Input
                    value={customer.name}
                    onChange={(e) => {
                      setCustomer({...customer, name: e.target.value});
                      if (e.target.value !== customerSearchTerm) {
                        setShowCustomerSearch(false);
                      }
                    }}
                    placeholder="أدخل اسم العميل"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <Input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({...customer, email: e.target.value})}
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <Input
                    value={customer.phone}
                    onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                    placeholder="+966xxxxxxxxx"
                  />
                </div>
                {invoiceType === 'standard' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الرقم الضريبي
                    </label>
                    <Input
                      value={customer.vat_number}
                      onChange={(e) => setCustomer({...customer, vat_number: e.target.value})}
                      placeholder="3000000000000000000"
                    />
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان العميل
                  </label>
                  <Input
                    value={customer.address}
                    onChange={(e) => setCustomer({...customer, address: e.target.value})}
                    placeholder="أدخل العنوان الكامل"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المدينة
                  </label>
                  <Input
                    value={customer.city}
                    onChange={(e) => setCustomer({...customer, city: e.target.value})}
                    placeholder="الرياض"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الرمز البريدي
                  </label>
                  <Input
                    value={customer.postal_code}
                    onChange={(e) => setCustomer({...customer, postal_code: e.target.value})}
                    placeholder="12345"
                  />
                </div>
              </div>
            </Card>

            {/* Invoice Settings */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <FileText className="w-5 h-5 inline ml-2" />
                إعدادات الفاتورة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ الإصدار
                  </label>
                  <Input
                    type="date"
                    value={invoiceSettings.issue_date}
                    onChange={(e) => setInvoiceSettings({...invoiceSettings, issue_date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ الاستحقاق
                  </label>
                  <Input
                    type="date"
                    value={invoiceSettings.due_date}
                    onChange={(e) => setInvoiceSettings({...invoiceSettings, due_date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    شروط الدفع
                  </label>
                  <select
                    value={invoiceSettings.payment_terms}
                    onChange={(e) => setInvoiceSettings({...invoiceSettings, payment_terms: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Net 30">30 يوم</option>
                    <option value="Net 15">15 يوم</option>
                    <option value="Net 7">7 أيام</option>
                    <option value="Due on Receipt">مستحق عند الاستلام</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رسوم الشحن
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={invoiceSettings.shipping_amount}
                    onChange={(e) => setInvoiceSettings({...invoiceSettings, shipping_amount: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات
                </label>
                <textarea
                  rows={3}
                  value={invoiceSettings.notes}
                  onChange={(e) => setInvoiceSettings({...invoiceSettings, notes: e.target.value})}
                  placeholder="أدخل أي ملاحظات إضافية..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus-ring-blue-500"
                />
              </div>
            </Card>            {/* Invoice Items */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  <Calculator className="w-5 h-5 inline ml-2" />
                  بنود الفاتورة
                </h3>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setShowBarcodeScanner(true)} 
                    size="sm"
                    variant="outline"
                    className="bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    <Scan className="w-4 h-4 ml-1" />
                    مسح باركود
                  </Button>
                  <Button onClick={addItem} size="sm">
                    <Plus className="w-4 h-4 ml-1" />
                    إضافة بند
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الوصف
                        </label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          placeholder="وصف المنتج أو الخدمة"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الكمية
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          السعر
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unit_price}
                          onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          الخصم
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.discount_amount}
                          onChange={(e) => updateItem(index, 'discount_amount', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="flex items-end">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-700 mb-1">
                            الإجمالي
                          </div>
                          <div className="text-lg font-semibold text-gray-900">
                            {(item.total_amount || 0).toFixed(2)} ريال
                          </div>
                        </div>
                        {items.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(index)}
                            className="mr-2 text-red-600 hover:text-red-700"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between text-sm text-gray-600">
                      <span>معدل الضريبة: {((item.tax_rate || 0) * 100).toFixed(1)}%</span>
                      <span>ضريبة القيمة المضافة: {(item.tax_amount || 0).toFixed(2)} ريال</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            {/* Invoice Summary */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ملخص الفاتورة</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">المجموع الفرعي:</span>
                  <span className="font-medium">{totals.subtotal.toFixed(2)} ريال</span>
                </div>
                {totals.totalDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>إجمالي الخصم:</span>
                    <span>-{totals.totalDiscount.toFixed(2)} ريال</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">ضريبة القيمة المضافة:</span>
                  <span className="font-medium">{totals.totalTax.toFixed(2)} ريال</span>
                </div>
                {totals.shippingAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">رسوم الشحن:</span>
                    <span className="font-medium">{totals.shippingAmount.toFixed(2)} ريال</span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>المجموع الكلي:</span>
                  <span className="text-blue-600">{totals.total.toFixed(2)} ريال</span>
                </div>
              </div>
            </Card>

            {/* Preview */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">معاينة الفاتورة</h3>
              <div className="text-center space-y-2">
                <div className="text-sm text-gray-600">رقم الفاتورة</div>
                <div className="font-mono text-lg font-bold">{generateInvoiceNumber()}</div>
                <div className="text-sm text-gray-600">العميل: {customer.name || 'غير محدد'}</div>
                {invoiceType === 'standard' && customer.vat_number && (
                  <div className="flex items-center justify-center text-green-600">
                    <QrCode className="w-4 h-4 ml-1" />
                    <span className="text-xs">متوافق مع زاتكا</span>
                  </div>
                )}
              </div>
            </Card>

            {/* ZATCA Compliance Check */}
            {invoiceType === 'standard' && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">التوافق مع زاتكا</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    {customer.name ? (
                      <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                    ) : (
                      <div className="w-2 h-2 bg-red-500 rounded-full ml-2"></div>
                    )}
                    <span className="text-sm">اسم العميل مطلوب</span>
                  </div>
                  <div className="flex items-center">
                    {customer.vat_number ? (
                      <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                    ) : (
                      <div className="w-2 h-2 bg-yellow-500 rounded-full ml-2"></div>
                    )}
                    <span className="text-sm">الرقم الضريبي (اختياري)</span>
                  </div>
                  <div className="flex items-center">
                    {items.some(item => item.description && item.unit_price > 0) ? (
                      <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
                    ) : (
                      <div className="w-2 h-2 bg-red-500 rounded-full ml-2"></div>
                    )}
                    <span className="text-sm">بنود الفاتورة مطلوبة</span>
                  </div>                </div>
                
                {(!customer.name || !items.some(item => item.description && item.unit_price > 0)) && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 ml-2 flex-shrink-0" />
                      <div className="text-sm text-yellow-800">
                        يرجى استكمال البيانات المطلوبة لضمان التوافق مع زاتكا
                      </div>
                    </div>
                  </div>
                )}              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Barcode Scanner Modal */}
      {showBarcodeScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">مسح الباركود لإضافة منتج</h3>              <button
                onClick={() => setShowBarcodeScanner(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <BarcodeScanner
              storeId={user?.id}
              onProductSelected={handleBarcodeProductSelect}
              onClose={() => setShowBarcodeScanner(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
