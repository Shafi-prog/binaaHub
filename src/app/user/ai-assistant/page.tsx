"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Typography, EnhancedCard, Button } from '@/core/shared/components/ui/enhanced-components';
import { Bot, MessageSquare, Lightbulb, Calculator, FileText, Search, Zap, Brain, Settings } from 'lucide-react';

export const dynamic = 'force-dynamic'

interface AIConversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  type: 'construction' | 'calculator' | 'general';
}

export default function AIAssistantPage() {
  const [conversations, setConversations] = useState<AIConversation[]>([
    {
      id: 'AI001',
      title: 'حساب تكلفة أساسات الفيلا',
      lastMessage: 'تحتاج إلى حوالي 45,000 ر.س للأساسات حسب المواصفات التي ذكرتها',
      timestamp: '2024-03-20T10:30:00',
      type: 'calculator'
    },
    {
      id: 'AI002', 
      title: 'اختيار نوع الرمل المناسب',
      lastMessage: 'أنصحك باستخدام الرمل المغسول للخرسانة والرمل الناعم للبياض',
      timestamp: '2024-03-19T14:15:00',
      type: 'construction'
    },
    {
      id: 'AI003',
      title: 'مقارنة أسعار مواد البناء',
      lastMessage: 'وجدت لك أفضل 3 عروض للأسمنت في منطقتك',
      timestamp: '2024-03-18T09:45:00',
      type: 'general'
    }
  ]);

  const [newQuestion, setNewQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const aiFeatures = [
    {
      icon: <Calculator className="w-6 h-6" />,
      title: 'حاسبة التكاليف الذكية',
      description: 'حساب تكلفة البناء بدقة عالية باستخدام الذكاء الاصطناعي',
      action: 'بدء الحساب'
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: 'استشارات البناء',
      description: 'احصل على نصائح خبراء في البناء والتشييد',
      action: 'احصل على استشارة'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'تحليل المخططات',
      description: 'تحليل مخططات البناء وتقدير المواد المطلوبة',
      action: 'تحليل مخطط'
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: 'البحث الذكي',
      description: 'البحث عن المواد والخدمات بأفضل الأسعار',
      action: 'بدء البحث'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'calculator': return <Calculator className="w-5 h-5 text-blue-600" />;
      case 'construction': return <Lightbulb className="w-5 h-5 text-green-600" />;
      case 'general': return <MessageSquare className="w-5 h-5 text-purple-600" />;
      default: return <Bot className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeText = (type: string) => {
    switch(type) {
      case 'calculator': return 'حاسبة';
      case 'construction': return 'استشارة';
      case 'general': return 'عام';
      default: return 'غير محدد';
    }
  };

  const handleAskQuestion = async () => {
    if (!newQuestion.trim()) return;
    
    setIsAsking(true);
    // Simulate AI processing
    setTimeout(() => {
      const newConversation: AIConversation = {
        id: `AI${Date.now()}`,
        title: newQuestion.length > 50 ? newQuestion.substring(0, 50) + '...' : newQuestion,
        lastMessage: 'جاري تحليل استفسارك وإعداد الإجابة المناسبة...',
        timestamp: new Date().toISOString(),
        type: 'general'
      };
      setConversations([newConversation, ...conversations]);
      setNewQuestion('');
      setIsAsking(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2 flex items-center gap-3">
          <Bot className="w-8 h-8 text-blue-600" />
          المساعد الذكي للبناء
        </Typography>
        <Typography variant="body" size="lg" className="text-gray-600">
          احصل على إجابات فورية ونصائح ذكية لمشاريع البناء الخاصة بك
        </Typography>
      </div>

      {/* Quick Question */}
      <EnhancedCard className="p-6 mb-8">
        <Typography variant="subheading" size="xl" weight="semibold" className="mb-4 flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          اسأل المساعد الذكي
        </Typography>
        
        <div className="flex gap-4">
          <div className="flex-1">
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="اكتب سؤالك هنا... مثل: كيف أحسب كمية الأسمنت المطلوبة؟"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>
          
          <Button
            onClick={handleAskQuestion}
            disabled={!newQuestion.trim() || isAsking}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 self-start"
          >
            {isAsking ? (
              <>
                <Zap className="w-5 h-5 animate-pulse" />
                جاري التفكير...
              </>
            ) : (
              <>
                <MessageSquare className="w-5 h-5" />
                اسأل
              </>
            )}
          </Button>
        </div>
      </EnhancedCard>

      {/* AI Features */}
      <div className="mb-8">
                <Typography variant="subheading" size="xl" weight="semibold" className="mb-4">الخدمات الذكية</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiFeatures.map((feature, index) => (
            <EnhancedCard key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  {feature.icon}
                </div>
                <Typography variant="subheading" size="lg" weight="semibold">{feature.title}</Typography>
              </div>
              
              <Typography variant="body" size="sm" className="text-gray-600 mb-4">
                {feature.description}
              </Typography>
              
              <Button
                variant="outline"
                className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
               onClick={() => alert('Button clicked')}>
                {feature.action}
              </Button>
            </EnhancedCard>
          ))}
        </div>
      </div>

      {/* Conversation History */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <Typography variant="subheading" size="xl" weight="semibold">المحادثات السابقة</Typography>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
           onClick={() => alert('Button clicked')}>
            <Settings className="w-4 h-4" />
            إدارة المحادثات
          </Button>
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-600 mb-2">
              لا توجد محادثات بعد
            </Typography>
            <Typography variant="body" size="md" className="text-gray-500">
              ابدأ بطرح سؤالك الأول على المساعد الذكي
            </Typography>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <EnhancedCard key={conversation.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getTypeIcon(conversation.type)}
                      <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-900">
                        {conversation.title}
                      </Typography>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {getTypeText(conversation.type)}
                      </span>
                    </div>
                    
                    <Typography variant="body" size="md" className="text-gray-700 mb-2">
                      {conversation.lastMessage}
                    </Typography>
                    
                    <Typography variant="caption" size="sm" className="text-gray-500">
                      {new Date(conversation.timestamp).toLocaleDateString('ar-SA')} - {new Date(conversation.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center gap-2"
                   onClick={() => alert('Button clicked')}>
                    <MessageSquare className="w-4 h-4" />
                    متابعة
                  </Button>
                </div>
              </EnhancedCard>
            ))}
          </div>
        )}
      </div>

      {/* Floating Help */}
      <Link href="/user/help-center" className="fixed bottom-8 left-8 bg-blue-600 text-white rounded-full shadow-lg px-5 py-3 hover:bg-blue-700 z-50">
        مساعدة؟
      </Link>
    </div>
  );
}
