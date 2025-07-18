// User Feedback page for submitting feedback or reporting issues
export default function FeedbackPage() {
  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">     
      <h1 className="text-2xl font-bold text-blue-700 mb-4">ملاحظاتك تهمنا</h1>
      <p className="text-gray-700 mb-4">شاركنا رأيك أو أبلغ عن مشكلة لنحسن تجربتك.</p>
      <form className="space-y-4">
        <textarea className="w-full border rounded p-3 min-h-[120px]" placeholder="اكتب ملاحظتك أو مشكلتك هنا..." required></textarea>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">إرسال</button> 
      </form>
    </main>
  );
}
