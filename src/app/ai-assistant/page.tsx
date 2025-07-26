'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot,
  Send,
  Mic,
  MicOff,
  Image,
  FileText,
  Calculator,
  MapPin,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  User,
  Settings,
  Star,
  Zap,
  Brain,
  Target,
  TrendingUp
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    confidence?: number;
    sources?: string[];
    suggestions?: string[];
    attachments?: any[];
    calculations?: any;
    recommendations?: any[];
  };
}

interface AICapability {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  examples: string[];
  category: 'analysis' | 'planning' | 'estimation' | 'compliance' | 'optimization';
}

interface ProjectContext {
  type?: string;
  location?: string;
  budget?: number;
  timeline?: string;
  specifications?: any;
  preferences?: any;
}

export default function AIConstructionAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCapability, setSelectedCapability] = useState<string | null>(null);
  const [projectContext, setProjectContext] = useState<ProjectContext>({});
  const [aiPersonality, setAIPersonality] = useState<'professional' | 'friendly' | 'technical'>('friendly');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // AI Capabilities
  const aiCapabilities: AICapability[] = [
    {
      id: 'cost_estimation',
      name: 'تقدير التكاليف',
      description: 'حساب تكاليف المشروع بدقة مع تحليل العوامل المؤثرة',
      icon: Calculator,
      examples: [
        'احسب تكلفة بناء فيلا 300 متر',
        'ما هي تكلفة صب خرسانة 50 متر مكعب؟',
        'أريد تقدير تكلفة تشطيب شقة'
      ],
      category: 'estimation'
    },
    {
      id: 'material_optimization',
      name: 'تحسين المواد',
      description: 'اقتراح أفضل المواد والكميات المطلوبة',
      icon: Target,
      examples: [
        'ما هي أفضل أنواع الأسمنت للمناخ الحار؟',
        'احسب كمية الحديد المطلوبة للأساسات',
        'اقترح بدائل اقتصادية للعزل الحراري'
      ],
      category: 'optimization'
    },
    {
      id: 'code_compliance',
      name: 'الامتثال للأكواد',
      description: 'التحقق من مطابقة المشروع للوائح والمعايير',
      icon: CheckCircle2,
      examples: [
        'هل يتوافق التصميم مع كود البناء السعودي؟',
        'ما هي متطلبات السلامة للمباني العالية؟',
        'تحقق من مطابقة نظام الحريق'
      ],
      category: 'compliance'
    },
    {
      id: 'project_planning',
      name: 'التخطيط الزمني',
      description: 'وضع جدولة زمنية مثلى للمشروع',
      icon: Clock,
      examples: [
        'خطط جدولة بناء فيلا في 6 أشهر',
        'ما هو الوقت المطلوب لصب الأساسات؟',
        'رتب مراحل التشطيب بالترتيب الأمثل'
      ],
      category: 'planning'
    },
    {
      id: 'risk_analysis',
      name: 'تحليل المخاطر',
      description: 'تحديد وتقييم المخاطر المحتملة في المشروع',
      icon: AlertTriangle,
      examples: [
        'ما هي مخاطر البناء في فصل الشتاء؟',
        'حلل مخاطر المشروع في المنطقة الساحلية',
        'كيف أتجنب مشاكل التربة الطينية؟'
      ],
      category: 'analysis'
    },
    {
      id: 'smart_recommendations',
      name: 'التوصيات الذكية',
      description: 'اقتراحات مخصصة بناء على خبرات المشاريع المماثلة',
      icon: Lightbulb,
      examples: [
        'اقترح أفضل المقاولين في الرياض',
        'ما هي أحدث تقنيات البناء المستدام؟',
        'أريد توصيات لتوفير الطاقة'
      ],
      category: 'optimization'
    }
  ];

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        type: 'assistant',
        content: `مرحباً! أنا مساعد بِنّا الذكي للإنشاءات 🏗️

أستطيع مساعدتك في:
• تقدير تكاليف المشاريع
• تحليل المواد والكميات
• التخطيط الزمني
• مراجعة الامتثال للأكواد
• تحليل المخاطر
• التوصيات الذكية

كيف يمكنني مساعدتك اليوم؟`,
        timestamp: new Date(),
        metadata: {
          confidence: 1,
          suggestions: [
            'احسب تكلفة بناء فيلا',
            'اقترح أفضل مقاول في منطقتي',
            'ما هي متطلبات السلامة؟',
            'خطط جدولة مشروعي'
          ]
        }
      }]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing
    try {
      const response = await processAIRequest(inputMessage, projectContext);
      
      setTimeout(() => {
        setMessages(prev => [...prev, response]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error('Error processing AI request:', error);
      setIsTyping(false);
    }
  };

  const processAIRequest = async (message: string, context: ProjectContext): Promise<ChatMessage> => {
    // Simulate AI processing - in real implementation, this would call an AI service
    
    const messageId = Date.now().toString();
    let content = '';
    let metadata: any = {};

    // Analyze the message intent
    if (message.includes('تكلفة') || message.includes('سعر') || message.includes('كم يكلف')) {
      content = await generateCostEstimation(message);
      metadata.calculations = {
        totalCost: 250000,
        breakdown: [
          { item: 'مواد البناء', cost: 150000 },
          { item: 'العمالة', cost: 80000 },
          { item: 'المعدات', cost: 20000 }
        ]
      };
    } else if (message.includes('جدولة') || message.includes('وقت') || message.includes('مدة')) {
      content = await generateTimelineAnalysis(message);
      metadata.recommendations = [
        { phase: 'الأساسات', duration: '2-3 أسابيع' },
        { phase: 'الهيكل الخرساني', duration: '4-6 أسابيع' },
        { phase: 'التشطيبات', duration: '6-8 أسابيع' }
      ];
    } else if (message.includes('مواد') || message.includes('كمية') || message.includes('حديد')) {
      content = await generateMaterialAnalysis(message);
    } else if (message.includes('مخاطر') || message.includes('مشكلة') || message.includes('تحذير')) {
      content = await generateRiskAnalysis(message);
    } else if (message.includes('مقاول') || message.includes('شركة') || message.includes('مزود')) {
      content = await generateProviderRecommendations(message);
    } else {
      content = await generateGeneralResponse(message);
    }

    metadata.confidence = Math.random() * 0.3 + 0.7; // 70-100%
    metadata.sources = ['خبرة المشاريع المماثلة', 'قواعد بيانات الأسعار', 'الممارسات الأفضل'];

    return {
      id: messageId,
      type: 'assistant',
      content,
      timestamp: new Date(),
      metadata
    };
  };

  const generateCostEstimation = async (message: string): Promise<string> => {
    return `بناءً على تحليل طلبك، إليك تقدير التكاليف:

💰 **التكلفة الإجمالية المتوقعة: 250,000 ريال**

📊 **تفصيل التكاليف:**
• مواد البناء (60%): 150,000 ريال
• العمالة (32%): 80,000 ريال  
• المعدات والآلات (8%): 20,000 ريال

⚠️ **ملاحظات مهمة:**
• الأسعار تقديرية وقد تختلف حسب المنطقة
• ينصح بإضافة 10-15% كاحتياطي للطوارئ
• الأسعار لا تشمل الرسوم الحكومية

📈 **توصيات لتوفير التكلفة:**
• شراء المواد بالجملة يوفر 5-10%
• التخطيط الجيد يقلل هدر المواد
• اختيار الوقت المناسب للشراء

هل تريد تفصيل أكثر لأي من العناصر؟`;
  };

  const generateTimelineAnalysis = async (message: string): Promise<string> => {
    return `⏱️ **تحليل الجدولة الزمنية للمشروع**

📅 **المدة الإجمالية المتوقعة: 12-16 أسبوع**

🏗️ **المراحل الرئيسية:**

**1. مرحلة التحضير (1-2 أسبوع)**
• الحصول على التراخيص
• إعداد الموقع وحفر الأساسات

**2. مرحلة الهيكل الإنشائي (6-8 أسابيع)**
• صب الأساسات: 2-3 أسابيع
• صب الهيكل الخرساني: 4-5 أسابيع

**3. مرحلة التشطيبات (5-6 أسابيع)**
• الأعمال الكهربائية والصحية: 2-3 أسابيع
• التشطيبات النهائية: 3 أسابيع

⚡ **العوامل المؤثرة:**
• حالة الطقس (قد تؤخر العمل 1-2 أسبوع)
• توفر المواد والعمالة
• تعقيد التصميم

💡 **نصائح للتسريع:**
• التخطيط المسبق للمواد
• استخدام تقنيات البناء الحديثة
• العمل بفرق متوازية

هل تحتاج جدولة مفصلة أكثر؟`;
  };

  const generateMaterialAnalysis = async (message: string): Promise<string> => {
    return `🧱 **تحليل المواد والكميات**

📦 **المواد الأساسية المطلوبة:**

**الأسمنت والخرسانة:**
• أسمنت مقاوم: 50 طن
• رمل وحصى: 120 متر مكعب
• خرسانة جاهزة: 80 متر مكعب

**حديد التسليح:**
• حديد قطر 12-16مم: 8 أطنان
• حديد قطر 8-10مم: 3 أطنان
• شبك حديدي: 500 متر مربع

**مواد العزل:**
• عزل حراري: 200 متر مربع
• عزل مائي: 150 متر مربع

🎯 **توصيات المواد:**
• استخدم أسمنت مقاوم للكبريتات في المناطق الساحلية
• اختر حديد معالج ضد الصدأ
• فضل مواد العزل المحلية لتوفير التكلفة

💰 **تحسين التكلفة:**
• اشتري المواد من موردين معتمدين
• احرص على الحصول على ضمانات
• راجع الكميات مع مهندس مختص

🚚 **الشحن والتسليم:**
• خطط للتسليم حسب مراحل العمل
• تأكد من مساحة التخزين في الموقع

هل تحتاج مواصفات تقنية أكثر تفصيلاً؟`;
  };

  const generateRiskAnalysis = async (message: string): Promise<string> => {
    return `⚠️ **تحليل المخاطر والتحديات المحتملة**

🔴 **المخاطر عالية الأهمية:**

**مخاطر الطقس:**
• الأمطار قد تؤخر صب الخرسانة
• درجات الحرارة العالية تؤثر على جودة الخرسانة
• الرياح القوية تعيق أعمال الرفع

**مخاطر المواد:**
• تأخير توريد المواد (احتمال 30%)
• ارتفاع الأسعار المفاجئ (احتمال 20%)
• عيوب في المواد (احتمال 15%)

**مخاطر العمالة:**
• نقص العمالة الماهرة
• إضرابات أو توقفات
• حوادث العمل

🟡 **المخاطر متوسطة الأهمية:**
• تغيير المخططات أثناء التنفيذ
• مشاكل في التربة
• تأخير في التراخيص

🛡️ **خطة التخفيف:**
• احتفظ بقائمة موردين بديلة
• ضع خطة طوارئ للطقس
• وفر تأمين شامل للمشروع
• اعتمد على مقاولين موثوقين

📊 **نسبة المخاطر الإجمالية: متوسطة (40%)**

💡 **التوصيات:**
• ابدأ المشروع في الفترة المناسبة مناخياً
• وقع عقود واضحة مع جزاءات
• راقب التقدم يومياً

هل تريد خطة مفصلة لإدارة أي من هذه المخاطر؟`;
  };

  const generateProviderRecommendations = async (message: string): Promise<string> => {
    return `🏆 **توصيات مقدمي الخدمات**

⭐ **أفضل المقاولين المرشحين:**

**1. شركة البناء المتطور**
• التقييم: 4.8/5 (156 مراجعة)
• الخبرة: 15 سنة
• التخصص: المباني السكنية والتجارية
• السعر: متوسط إلى عالي
📞 +966501234567

**2. مؤسسة الإنشاءات الحديثة**
• التقييم: 4.6/5 (89 مراجعة)  
• الخبرة: 12 سنة
• التخصص: الفلل والقصور
• السعر: متوسط
📞 +966502345678

**3. مقاولات الخليج للبناء**
• التقييم: 4.7/5 (203 مراجعة)
• الخبرة: 20 سنة
• التخصص: المشاريع الكبيرة
• السعر: اقتصادي إلى متوسط
📞 +966503456789

🎯 **معايير الاختيار:**
• خبرة مثبتة في نوع مشروعك
• تقييمات العملاء السابقين
• الالتزام بالمواعيد
• الشفافية في الأسعار
• وجود تأمين وضمانات

💡 **نصائح مهمة:**
• اطلب 3 عروض أسعار على الأقل
• تحقق من المشاريع السابقة
• اقرأ العقد بعناية
• تأكد من التراخيص والتأمين

📋 **أسئلة يجب طرحها:**
• ما هي مدة إنجاز المشروع؟
• هل السعر شامل أم مفصل؟
• ما هي فترة الضمان؟
• كيف تتعاملون مع التغييرات؟

هل تريد مقارنة مفصلة بين هؤلاء المقاولين؟`;
  };

  const generateGeneralResponse = async (message: string): Promise<string> => {
    return `شكراً لك على سؤالك! 

أنا هنا لمساعدتك في جميع جوانب مشروعك الإنشائي. يمكنني تقديم المساعدة في:

🔧 **الخدمات المتاحة:**
• تقدير التكاليف والميزانيات
• تحليل المواد والكميات المطلوبة
• وضع الجداول الزمنية للمشروع
• مراجعة الامتثال للأكواد واللوائح
• تحليل المخاطر وخطط التخفيف
• توصيات المقاولين ومقدمي الخدمات

💬 **أمثلة على الأسئلة:**
• "احسب تكلفة بناء فيلا مساحة 400 متر"
• "ما هي أفضل أنواع العزل للمناخ الحار؟"
• "كم مدة بناء عمارة سكنية؟"
• "اقترح مقاولين موثوقين في الرياض"

🎯 للحصول على إجابة أكثر دقة، يرجى تقديم تفاصيل عن:
• نوع المشروع (فيلا، عمارة، مكتب، إلخ)
• الموقع والمنطقة
• المساحة المطلوبة
• الميزانية المتوقعة

كيف يمكنني مساعدتك بشكل أكثر تحديداً؟`;
  };

  const handleVoiceInput = () => {
    if (!isListening) {
      // Start voice recognition
      setIsListening(true);
      // In real implementation, integrate with Web Speech API
      setTimeout(() => {
        setIsListening(false);
        setInputMessage('مرحبا، أريد تقدير تكلفة بناء فيلا');
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  const handleCapabilitySelect = (capability: AICapability) => {
    setSelectedCapability(capability.id);
    const example = capability.examples[Math.floor(Math.random() * capability.examples.length)];
    setInputMessage(example);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                المساعد الذكي للإنشاءات
              </h1>
              <p className="text-gray-600">
                مساعدك الشخصي المدعوم بالذكاء الاصطناعي لجميع احتياجات البناء
              </p>
            </div>
          </div>
          
          {/* AI Status */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600">متصل - جاهز للمساعدة</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-600" />
              <span className="text-gray-600">نموذج GPT-4 المحسّن للإنشاءات</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* AI Capabilities Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  قدرات الذكاء الاصطناعي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiCapabilities.map((capability) => {
                    const Icon = capability.icon;
                    return (
                      <div
                        key={capability.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedCapability === capability.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handleCapabilitySelect(capability)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-sm">{capability.name}</span>
                        </div>
                        <p className="text-xs text-gray-600">{capability.description}</p>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {capability.category}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">إحصائيات الجلسة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الأسئلة المطروحة</span>
                    <span className="font-semibold">{messages.filter(m => m.type === 'user').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">التوصيات المقدمة</span>
                    <span className="font-semibold">
                      {messages.reduce((acc, m) => acc + (m.metadata?.recommendations?.length || 0), 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">متوسط الثقة</span>
                    <span className="font-semibold">
                      {(messages
                        .filter(m => m.metadata?.confidence)
                        .reduce((acc, m) => acc + (m.metadata!.confidence! * 100), 0) / 
                        Math.max(1, messages.filter(m => m.metadata?.confidence).length)
                      ).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[700px] flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    محادثة مع المساعد الذكي
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <select
                      value={aiPersonality}
                      onChange={(e) => setAIPersonality(e.target.value as any)}
                      className="px-3 py-1 border rounded text-sm"
                    >
                      <option value="friendly">ودود</option>
                      <option value="professional">مهني</option>
                      <option value="technical">تقني</option>
                    </select>
                  </div>
                </div>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border shadow-sm'
                          }`}
                        >
                          {message.type === 'assistant' && (
                            <div className="flex items-center gap-2 mb-2">
                              <Bot className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-600">مساعد بِنّا</span>
                              {message.metadata?.confidence && (
                                <Badge variant="secondary" className="text-xs">
                                  ثقة {(message.metadata.confidence * 100).toFixed(0)}%
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          
                          {/* Message Metadata */}
                          {message.metadata?.suggestions && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-sm font-medium mb-2">اقتراحات للمتابعة:</p>
                              <div className="flex flex-wrap gap-2">
                                {message.metadata.suggestions.map((suggestion, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => setInputMessage(suggestion)}
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Calculations Display */}
                          {message.metadata?.calculations && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="bg-gray-50 rounded p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Calculator className="w-4 h-4 text-green-600" />
                                  <span className="text-sm font-medium">حاسبة التكلفة</span>
                                </div>
                                <div className="text-lg font-bold text-green-600">
                                  {message.metadata.calculations.totalCost?.toLocaleString()} ريال
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center mt-2 text-xs opacity-70">
                            <span>{message.timestamp.toLocaleTimeString('ar-SA')}</span>
                            {message.type === 'assistant' && (
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  <Star className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white border shadow-sm rounded-lg p-4 max-w-[80%]">
                          <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-600">يكتب...</span>
                            <div className="flex gap-1">
                              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="اكتب سؤالك هنا... مثال: احسب تكلفة بناء فيلا 300 متر"
                        className="pl-12"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2"
                        onClick={handleVoiceInput}
                      >
                        {isListening ? (
                          <MicOff className="w-4 h-4 text-red-500" />
                        ) : (
                          <Mic className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>اضغط Enter للإرسال</span>
                    <span>مدعوم بالذكاء الاصطناعي المتقدم</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
