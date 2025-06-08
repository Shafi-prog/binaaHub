import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{
      padding: '20px', 
      textAlign: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#f0f9ff',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{
        fontSize: '48px', 
        fontWeight: 'bold', 
        color: '#1f2937', 
        marginBottom: '24px'
      }}>
        منصة بناء الذكية
      </h1>
      
      <p style={{
        fontSize: '18px', 
        color: '#6b7280', 
        marginBottom: '32px',
        maxWidth: '600px',
        margin: '0 auto 32px auto'
      }}>
        منصة شاملة لإدارة مشاريع البناء والتشييد - تابع مشاريعك، أدر طلباتك، وراقب الضمانات بكل سهولة
      </p>
      
      <div style={{
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
        maxWidth: '800px', 
        margin: '0 auto'
      }}>
        <h2 style={{fontSize: '24px', marginBottom: '20px', color: '#1f2937'}}>
          المميزات الأساسية
        </h2>
        
        <div style={{
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          textAlign: 'right'
        }}>
          <div style={{padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px'}}>
            <div style={{fontSize: '32px', marginBottom: '10px'}}>🏗️</div>
            <h3 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '8px'}}>إدارة المشاريع</h3>
            <p style={{fontSize: '14px', color: '#6b7280'}}>تابع جميع مشاريعك من التخطيط حتى التسليم</p>
          </div>
          
          <div style={{padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px'}}>
            <div style={{fontSize: '32px', marginBottom: '10px'}}>📋</div>
            <h3 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '8px'}}>إدارة الطلبات</h3>
            <p style={{fontSize: '14px', color: '#6b7280'}}>نظم طلبات المواد والخدمات بكفاءة عالية</p>
          </div>
          
          <div style={{padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px'}}>
            <div style={{fontSize: '32px', marginBottom: '10px'}}>🛡️</div>
            <h3 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '8px'}}>متابعة الضمانات</h3>
            <p style={{fontSize: '14px', color: '#6b7280'}}>راقب ضمانات المواد والأعمال المختلفة</p>
          </div>
        </div>
        
        <div style={{marginTop: '30px'}}>
          <a 
            href="/user/projects" 
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              marginRight: '10px',
              display: 'inline-block'
            }}
          >
            عرض المشاريع
          </a>
          <a 
            href="/login" 
            style={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            تسجيل الدخول
          </a>
        </div>
      </div>
      
      <div style={{marginTop: '40px', fontSize: '14px', color: '#6b7280'}}>
        <p>✅ الصفحة تعمل بشكل صحيح - تم إصلاح مشاكل التحميل</p>
        <p>🚀 منصة بناء الذكية جاهزة للاستخدام</p>
      </div>
    </div>
  );
}
