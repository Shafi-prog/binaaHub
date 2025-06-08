export default function HomePage() {
  return (
    <div style={{padding: '20px', textAlign: 'center', minHeight: '100vh', backgroundColor: '#f0f9ff'}}>
      <h1 style={{fontSize: '48px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px'}}>
        منصة بناء الذكية
      </h1>
      <p style={{fontSize: '18px', color: '#6b7280', marginBottom: '32px'}}>
        منصة شاملة لإدارة مشاريع البناء والتشييد
      </p>
      <div style={{backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: '600px', margin: '0 auto'}}>
        <h2>المميزات الأساسية:</h2>
        <ul style={{textAlign: 'right', listStyle: 'none', padding: '10px'}}>
          <li>🏗️ إدارة المشاريع</li>
          <li>📋 متابعة الطلبات</li>
          <li>🛡️ إدارة الضمانات</li>
        </ul>
      </div>
    </div>
  );
}
