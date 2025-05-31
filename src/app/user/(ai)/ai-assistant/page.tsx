'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Card, LoadingSpinner } from '@/components/ui';
import { verifyAuthWithRetry } from '@/lib/auth-recovery';
import { ClientIcon } from '@/components/icons';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface AIUser extends User {
  user_name?: string;
}

export default function AiAssistantPage() {
  const [user, setUser] = useState<AIUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const router = useRouter();

  const quickQuestions = [
    {
      id: 'materials',
      title: 'أسعار المواد',
      icon: 'calculator',
      question: 'ما هي أسعار مواد البناء الحالية؟',
    },
    {
      id: 'construction',
      title: 'استشارات بناء',
      icon: 'construction',
      question: 'أحتاج استشارة حول مشروع البناء',
    },
    {
      id: 'services',
      title: 'الخدمات المتاحة',
      icon: 'settings',
      question: 'ما هي الخدمات المتاحة في المنصة؟',
    },
    {
      id: 'support',
      title: 'الدعم الفني',
      icon: 'support',
      question: 'أحتاج مساعدة في استخدام المنصة',
    },
  ];

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const loadAIAssistantData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 [AI Assistant] Verifying authentication...');
        const authResult = await verifyAuthWithRetry();

        if (authResult.error || !authResult.user) {
          console.error('❌ [AI Assistant] Authentication failed');
          router.push('/login');
          return;
        }

        console.log('✅ [AI Assistant] User authenticated:', authResult.user.email);
        setUser(authResult.user);

        // Load initial welcome message
        const welcomeMessage: ChatMessage = {
          id: 'welcome',
          type: 'ai',
          content: `مرحباً ${authResult.user.user_metadata?.name || 'بك'}! 👋\n\nأنا المساعد الذكي لمنصة بننا. يمكنني مساعدتك في:\n\n• الاستفسار عن أسعار المواد\n• تقديم استشارات البناء\n• شرح خدمات المنصة\n• حل المشاكل التقنية\n\nكيف يمكنني مساعدتك اليوم؟`,
          timestamp: new Date().toISOString(),
        };

        setMessages([welcomeMessage]);

        console.log('✅ [AI Assistant] Loaded successfully');
      } catch (err) {
        console.error('❌ [AI Assistant] Error:', err);
        setError(err instanceof Error ? err.message : 'Error loading AI assistant');
      } finally {
        setLoading(false);
      }
    };

    loadAIAssistantData();
  }, [isHydrated, router]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      let aiResponse = '';

      if (message.includes('سعر') || message.includes('مواد') || message.includes('تكلفة')) {
        aiResponse = `بناءً على استفسارك عن أسعار المواد، إليك أحدث الأسعار:\n\n🧱 **الطوب الأحمر**: 0.85 ريال/حبة\n🪨 **الأسمنت**: 25 ريال/كيس\n🔩 **الحديد**: 3,200 ريال/طن\n🪵 **الخشب**: 45 ريال/متر مربع\n\nهذه الأسعار تقريبية وقد تختلف حسب المنطقة والمورد. يمكنك مراجعة قسم "أسعار المواد" للحصول على أسعار محدثة.`;
      } else if (
        message.includes('استشارة') ||
        message.includes('بناء') ||
        message.includes('مشروع')
      ) {
        aiResponse = `أهلاً بك! بالنسبة لاستشارات البناء، يمكنني مساعدتك في:\n\n🏗️ **تخطيط المشروع**: تحديد متطلبات البناء\n📊 **تقدير التكاليف**: حساب تكلفة المواد والعمالة\n📋 **إدارة المشروع**: تنظيم مراحل العمل\n⚡ **كفاءة الطاقة**: نصائح للبناء المستدام\n\nما نوع المساعدة التي تحتاجها تحديداً؟`;
      } else if (
        message.includes('خدمات') ||
        message.includes('منصة') ||
        message.includes('بننا')
      ) {
        aiResponse = `منصة بننا تقدم مجموعة شاملة من الخدمات:\n\n🛒 **متجر المواد**: أفضل الأسعار والجودة\n👷 **العمالة المتخصصة**: حرفيون ومقاولون معتمدون\n📱 **الإشراف الهندسي**: خبراء لمتابعة مشروعك\n🔧 **الخدمات المساندة**: تصميم، تأمين، حاسبات\n📊 **إدارة المشاريع**: أدوات لتتبع التقدم والتكاليف\n\nأي خدمة تهمك أكثر؟`;
      } else if (
        message.includes('مساعدة') ||
        message.includes('مشكلة') ||
        message.includes('دعم')
      ) {
        aiResponse = `أنا هنا لمساعدتك! يمكنني المساعدة في:\n\n🔐 **مشاكل تسجيل الدخول**: استرداد كلمة المرور\n📱 **استخدام التطبيق**: شرح الميزات والوظائف\n💳 **الدفع والمعاملات**: مساعدة في العمليات المالية\n📞 **التواصل**: ربطك بالدعم المناسب\n\nما المشكلة التي تواجهها؟`;
      } else {
        aiResponse = `شكراً لسؤالك! أحاول فهم استفسارك بشكل أفضل.\n\nيمكنك استخدام الأسئلة السريعة أدناه أو طرح سؤال محدد حول:\n• أسعار المواد والخدمات\n• استشارات البناء والتخطيط\n• كيفية استخدام المنصة\n• أي مساعدة أخرى تحتاجها\n\nلا تتردد في السؤال! 😊`;
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  if (!isHydrated || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button
            onClick={() => router.push('/user/dashboard')}
            className="text-blue-600 hover:underline"
          >
            العودة للوحة التحكم
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">المساعد الذكي</h1>
            <p className="text-gray-600">
              احصل على إجابات فورية لجميع استفساراتك حول البناء والمواد
            </p>
          </div>
        </div>

        {/* Quick Questions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">أسئلة سريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickQuestions.map((question) => (
              <button
                key={question.id}
                onClick={() => handleQuickQuestion(question.question)}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4 text-center"
              >
                <ClientIcon
                  type={question.icon as any}
                  size={32}
                  className="mx-auto mb-3 text-blue-600"
                />
                <h3 className="font-medium text-gray-800 text-sm">{question.title}</h3>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <Card className="flex flex-col h-96">
          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start gap-2 max-w-xs lg:max-w-md">
                  {message.type === 'ai' && (
                    <div className="bg-blue-100 p-2 rounded-full">
                      <ClientIcon type="ai" size={20} className="text-blue-600" />
                    </div>
                  )}
                  <div
                    className={`rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-800 border'
                    }`}
                  >
                    <div className="whitespace-pre-line text-sm">{message.content}</div>
                    <div
                      className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString('ar-SA', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  {message.type === 'user' && (
                    <div className="bg-gray-200 p-2 rounded-full">
                      <ClientIcon type="dashboard" size={20} className="text-gray-600" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <ClientIcon type="ai" size={20} className="text-blue-600" />
                  </div>
                  <div className="bg-white text-gray-800 border rounded-lg p-3">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                        style={{ animationDelay: '0.4s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
                placeholder="اكتب رسالتك هنا..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isTyping}
              />
              <button
                onClick={() => handleSendMessage(inputMessage)}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </Card>

        {/* Features Overview */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">ما يمكنني مساعدتك فيه</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <ClientIcon type="calculator" size={24} className="text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-800">حسابات البناء</h3>
                  <p className="text-sm text-gray-600">تقدير التكاليف وحساب المواد المطلوبة</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ClientIcon type="chart" size={24} className="text-green-600" />
                <div>
                  <h3 className="font-medium text-gray-800">تحليل الأسعار</h3>
                  <p className="text-sm text-gray-600">مقارنة الأسعار وأفضل العروض</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <ClientIcon type="ai" size={24} className="text-purple-600" />
                <div>
                  <h3 className="font-medium text-gray-800">الدعم الفني</h3>
                  <p className="text-sm text-gray-600">حل المشاكل واستخدام المنصة</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ClientIcon type="design" size={24} className="text-orange-600" />
                <div>
                  <h3 className="font-medium text-gray-800">استشارات البناء</h3>
                  <p className="text-sm text-gray-600">نصائح من خبراء البناء والتشييد</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
