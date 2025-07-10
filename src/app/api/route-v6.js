(()=>{var e={};e.id=9586,e.ids=[9586],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},43452:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>x,routeModule:()=>d,serverHooks:()=>h,workAsyncStorage:()=>l,workUnitAsyncStorage:()=>c});var a={};r.r(a),r.d(a,{POST:()=>u});var s=r(96559),n=r(48088),i=r(37719),o=r(32190);async function p(e){return await new Promise(e=>setTimeout(e,2e3)),{data:{rooms:[{name:"غرفة المعيشة",width:5.5,length:6,height:3,area:33},{name:"غرفة النوم الرئيسية",width:4,length:5,height:3,area:20},{name:"غرفة النوم الثانية",width:3.5,length:4,height:3,area:14},{name:"المطبخ",width:3,length:4.5,height:3,area:13.5},{name:"الحمام الرئيسي",width:2.5,length:3,height:3,area:7.5},{name:"حمام الضيوف",width:2,length:2.5,height:3,area:5},{name:"المدخل والممرات",width:0,length:0,height:3,area:12}],totalArea:105,dimensions:{plotWidth:15,plotLength:20,floors:1},specifications:{foundationType:"خرسانة مسلحة",wallType:"طوب أحمر + عزل",roofType:"خرسانة مسلحة",finishLevel:"عادي"},quantities:{walls:85.5,doors:6,windows:8,electricalPoints:24,plumbingFixtures:4},confidence:87.5},rawText:`
مخطط معماري - فيلا سكنية
المساحة الإجمالية: 105 متر مربع

الغرف:
- غرفة المعيشة: 5.5 \xd7 6.0 متر
- غرفة النوم الرئيسية: 4.0 \xd7 5.0 متر  
- غرفة النوم الثانية: 3.5 \xd7 4.0 متر
- المطبخ: 3.0 \xd7 4.5 متر
- الحمام الرئيسي: 2.5 \xd7 3.0 متر
- حمام الضيوف: 2.0 \xd7 2.5 متر

أبعاد الأرض: 15 \xd7 20 متر
عدد الطوابق: 1
نوع الأساس: خرسانة مسلحة
نوع الجدران: طوب أحمر مع العزل
نوع السقف: خرسانة مسلحة

عدد الأبواب: 6
عدد النوافذ: 8
النقاط الكهربائية: 24
تجهيزات السباكة: 4
  `.trim(),processingTime:2.1,success:!0}}async function u(e){try{let t=(await e.formData()).get("file");if(!t)return o.NextResponse.json({error:"لم يتم العثور على ملف"},{status:400});if("application/pdf"!==t.type)return o.NextResponse.json({error:"نوع الملف غير مدعوم. يرجى رفع ملف PDF"},{status:400});if(t.size>0xa00000)return o.NextResponse.json({error:"حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت"},{status:400});let r=await p(t);return o.NextResponse.json({success:!0,message:"تم تحليل المخطط بنجاح",data:r.data,rawText:r.rawText,processingTime:r.processingTime,timestamp:new Date().toISOString()})}catch(e){return o.NextResponse.json({error:"حدث خطأ أثناء معالجة الملف",details:e instanceof Error?e.message:"خطأ غير معروف"},{status:500})}}let d=new s.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/ai/analyze-pdf-blueprint/route",pathname:"/api/ai/analyze-pdf-blueprint",filename:"route",bundlePath:"app/api/ai/analyze-pdf-blueprint/route"},resolvedPagePath:"C:\\Users\\hp\\BinnaCodes\\binna\\src\\app\\api\\ai\\analyze-pdf-blueprint\\route.ts",nextConfigOutput:"",userland:a}),{workAsyncStorage:l,workUnitAsyncStorage:c,serverHooks:h}=d;function x(){return(0,i.patchFetch)({workAsyncStorage:l,workUnitAsyncStorage:c})}},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},96487:()=>{}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[4243,580],()=>r(43452));module.exports=a})();