import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container md:flex-row">
          <div className="md:w-1/2 text-center md:text-right space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-800 leading-tight">
              منصة بناء، حلول متكاملة لإدارة مشروعك بسهولة
            </h2>
            <p className="text-gray-600 text-lg">
              تابع منتجاتك، مصاريفك، وتواصل مع أفضل المتاجر وخدمات التوصيل بخطوات بسيطة.
            </p>
            <Link
              href="/login"
              className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-medium"
            >
              ابدأ الآن
            </Link>
          </div>
          <div className="md:w-1/2">
            <img src="/hero-construction.svg" alt="مشروع بناء" className="w-full max-w-md mx-auto" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features-section">
        <div className="features-container">
          <h3 className="text-3xl font-bold text-blue-700 mb-12">مميزات المنصة</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card">
              <h4 className="text-xl font-semibold text-blue-800 mb-2">إضافة المنتجات بدون حساب</h4>
              <p className="text-gray-600">تصفح وابدأ بالإضافة للسلة، وبعدها يمكنك تسجيل الدخول للمتابعة.</p>
            </div>
            <div className="feature-card">
              <h4 className="text-xl font-semibold text-blue-800 mb-2">ربط تلقائي مع شركات التوصيل</h4>
              <p className="text-gray-600">تحديث حالة الطلبات وتتبعها مباشرة من داخل المنصة.</p>
            </div>
            <div className="feature-card">
              <h4 className="text-xl font-semibold text-blue-800 mb-2">واجهة بسيطة وسريعة</h4>
              <p className="text-gray-600">صممت لتكون واضحة وسهلة حتى لغير المختصين بالبناء.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="how-section">
        <div className="how-container space-y-8">
          <h3 className="text-3xl font-bold text-blue-700">كيف يعمل الموقع؟</h3>
          <ol className="text-gray-600 space-y-4 text-right pr-6 list-decimal list-inside">
            <li>تصفح المنتجات والخدمات.</li>
            <li>أضفها للسلة دون الحاجة لحساب.</li>
            <li>عند محاولة الشراء، سيُطلب بريدك الإلكتروني.</li>
            <li>يتم إرسال رمز الدخول وتأكيده.</li>
            <li>تكتمل عملية الشراء وتُربط الطلبات بخدمات التوصيل تلقائيًا.</li>
          </ol>
        </div>
      </section>

      {/* Pricing Placeholder */}
      <section id="pricing" className="pricing-section">
        <h3 className="text-3xl font-bold text-blue-700 mb-6">الأسعار والباقات</h3>
        <p className="text-gray-600 text-lg">باقات مرنة حسب حجم مشروعك. سيتم عرضها قريبًا.</p>
        <Link href="/pricing" className="inline-block mt-4 text-blue-600 hover:underline text-lg">
          اعرف المزيد
        </Link>
      </section>

      {/* Contact */}
      <section id="contact" className="contact-section">
        <h3 className="text-3xl font-bold mb-4">تواصل معنا</h3>
        <p className="mb-4 text-lg">نسعد بالإجابة على أسئلتك واقتراحاتك</p>
        <Link
          href="/contact"
          className="inline-block border px-6 py-3 rounded-lg hover:bg-white hover:text-blue-900 transition text-lg font-medium"
        >
          نموذج التواصل
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} BinaaHub. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}