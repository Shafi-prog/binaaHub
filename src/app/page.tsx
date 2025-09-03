// @ts-nocheck
"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  Store,
  Users,
  DollarSign,
  Truck,
  Shield,
  Brain,
  Wallet,
  Building2,
  Star,
  Share2,
  ClipboardList,
  CheckCircle,
  CreditCard,
  Settings,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              BinnaHub
            </span>
          </div>
          <div className="space-x-4 rtl:space-x-reverse text-sm font-medium">
            <Link href="/projects">المشاريع</Link>
            <Link href="/marketplace">السوق</Link>
            <Link href="/services">الخدمات</Link>
            <Link href="/wallet">المحفظة</Link>
            <Link href="/contact">الدعم</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold mb-6 leading-tight text-gray-900"
        >
          منصة <span className="text-blue-600">BinnaHub</span> — الحل الرقمي المتكامل للبناء
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
        >
          من إدارة المشاريع، إلى السوق الإلكتروني، إلى الخدمات والتمويل — كل ما تحتاجه لإدارة رحلة البناء في منصة واحدة.
        </motion.p>
        <div className="space-x-4 rtl:space-x-reverse">
          <Link href="/auth" className="px-8 py-4 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">
            ابدأ الآن
          </Link>
          <Link href="#features" className="px-8 py-4 border rounded-xl hover:border-blue-500 hover:text-blue-600 transition">
            اكتشف المزيد
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white/60">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { title: "المستخدمون", value: "15K+", icon: Users },
            { title: "المتاجر", value: "2.4K", icon: Store },
            { title: "المشاريع", value: "3.8K", icon: Building2 },
            { title: "المبيعات", value: "2.4M ريال", icon: DollarSign },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-white rounded-xl p-6 shadow border hover:shadow-md transition"
            >
              <s.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-600">{s.title}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-4 bg-white" id="projects">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">إدارة مشاريعك من الألف إلى الياء</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              أنشئ مشروعك وحدد موقعه، ارفع المخططات، واحصل على تحليل ذكي يقدّر الكميات المطلوبة من الحديد، الخرسانة، البلوك وغيرها.
              تابع مراحل التنفيذ (الحفر، القواعد، الأعمدة، التشطيبات) واحصل على نصائح عملية في كل خطوة. في النهاية ستحصل على تقرير شامل بالمصروفات والعقود والضمانات، يمكنك استخدامه للبيع أو التوثيق.
            </p>
            <Link href="/projects" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              ابدأ مشروعك الآن
            </Link>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl shadow-md">
            <ClipboardList className="h-20 w-20 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-700 text-center">ذكاء اصطناعي يحلل المخططات ويخرج تقديرات دقيقة</p>
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white" id="marketplace">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">السوق الإلكتروني لمواد البناء</h2>
            <p className="mb-6 opacity-90 leading-relaxed">
              تسوق من مئات الموردين في مختلف المجالات: حديد، خرسانة، بلوك، سباكة، كهرباء، سيراميك، جبس، إنارة والمزيد.
              قارن الأسعار، تحقق من التقييمات، واطلب التوصيل مباشرة إلى موقع مشروعك.
            </p>
            <Link href="/marketplace" className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100">
              تصفح السوق الآن
            </Link>
          </div>
          <div className="bg-white/10 p-8 rounded-xl shadow-md text-center border border-white/20">
            <Store className="h-20 w-20 mx-auto mb-4" />
            <p>تجربة تسوق موثوقة وآمنة لمواد البناء</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-white" id="services">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">خدمات متكاملة تدعم مشروعك</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            من التأمين إلى الخرسانة إلى المعدات والإشراف الميداني — وفر وقتك وجهدك بالتعاقد مع شركاء معتمدين مباشرة عبر المنصة.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { title: "تأمين المشاريع", desc: "تعاقد مع شركات تأمين لحماية مشروعك من المخاطر.", icon: Shield },
            { title: "توريد الخرسانة", desc: "احجز خرسانة بجودة مضمونة مع تقارير فحص جاهزة.", icon: Truck },
            { title: "معدات وحفريات", desc: "اطلب معدات (JCB, بوكلين) مع جدولة مواعيد وسداد رقمي.", icon: Building2 },
            { title: "إشراف هندسي", desc: "اختر مهندسًا أو مشرفًا ميدانيًا لتوثيق مراحل البناء.", icon: Star },
          ].map((srv, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-white p-6 rounded-xl shadow border hover:shadow-md text-center"
            >
              <srv.icon className="h-10 w-10 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{srv.title}</h3>
              <p className="text-sm text-gray-600">{srv.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Finance Section */}
      <section className="py-20 px-4 bg-white/60" id="wallet">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">إدارة مالية ذكية</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              محفظة رقمية متكاملة تسهل عملية الدفع للموردين والمقاولين عبر وسائل الدفع المحلية (مدى، STC Pay، تابي وغيرها).
              كل فاتورة وكل إيصال يتم تسجيله تلقائيًا في المشروع، مع إمكانية رفع فواتير خارجية ليتم تحليلها بالذكاء الاصطناعي.
            </p>
            <Link href="/wallet" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              اذهب إلى المحفظة
            </Link>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <CreditCard className="h-20 w-20 text-blue-600 mx-auto mb-4" />
            <p>وسائل دفع متنوعة، تسجيل تلقائي للمصروفات</p>
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="py-20 px-4 bg-white" id="ai">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">المساعد الذكي</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              استشر الذكاء الاصطناعي في كل مرحلة من البناء: من اختيار مواد الأساس إلى تشطيب الإنارة والديكور.
              احصل على اقتراحات عملية، تقديرات مستقبلية للأسعار، وحتى تصاميم إنارة وديكور بناءً على مخططاتك.
            </p>
            <Link href="/assistant" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              جرّب المساعد الآن
            </Link>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-xl shadow-md text-center">
            <Brain className="h-20 w-20 text-purple-600 mx-auto mb-4" />
            <p>نصائح، توقعات، وأفكار ديكور بالذكاء الاصطناعي</p>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white" id="community">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">المجتمع والإحالات</h2>
          <p className="mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
            قيم الموردين والعمال، شارك مشاريعك مع الآخرين، واحصل على دخل إضافي عبر نظام الإحالات.
            كل مستخدم جديد تسجله عبرك يمنحك عمولة شفافة ومباشرة.
          </p>
          <Share2 className="h-12 w-12 mx-auto mb-3" />
          <Link href="/referrals" className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100">
            ابدأ برنامج الإحالات
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">ابدأ رحلتك مع BinnaHub اليوم</h2>
          <p className="mb-6 opacity-90">انضم لآلاف المقاولين والموردين وحقق إدارة سلسة لمشاريعك.</p>
          <Link href="/auth" className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100">
            أنشئ حسابك الآن
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-3">عن BinnaHub</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              منصة متكاملة لإدارة مشاريع البناء، السوق، والخدمات المساندة — نوفر لك الأدوات والتقنيات لتسريع رحلة البناء بأمان.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-3">روابط</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/about">من نحن</Link></li>
              <li><Link href="/services">الخدمات</Link></li>
              <li><Link href="/projects">المشاريع</Link></li>
              <li><Link href="/marketplace">السوق</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">الدعم</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/help">مركز المساعدة</Link></li>
              <li><Link href="/contact">تواصل معنا</Link></li>
              <li><Link href="/terms">الشروط والأحكام</Link></li>
              <li><Link href="/privacy">سياسة الخصوصية</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">تابعنا</h3>
            <p className="text-gray-400 text-sm">LinkedIn, Twitter, YouTube</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          © 2024 BinnaHub. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}
