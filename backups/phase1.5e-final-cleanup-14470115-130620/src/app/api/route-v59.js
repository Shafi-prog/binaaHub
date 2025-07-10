(()=>{var e={};e.id=9789,e.ids=[9789],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11997:e=>{"use strict";e.exports=require("punycode")},27910:e=>{"use strict";e.exports=require("stream")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},34631:e=>{"use strict";e.exports=require("tls")},39727:()=>{},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},47990:()=>{},51906:e=>{function r(e){var r=Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}r.keys=()=>[],r.resolve=r,r.id=51906,e.exports=r},55511:e=>{"use strict";e.exports=require("crypto")},55591:e=>{"use strict";e.exports=require("https")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},74075:e=>{"use strict";e.exports=require("zlib")},75232:(e,r,t)=>{"use strict";t.r(r),t.d(r,{patchFetch:()=>h,routeModule:()=>l,serverHooks:()=>f,workAsyncStorage:()=>x,workUnitAsyncStorage:()=>m});var s={};t.r(s),t.d(s,{GET:()=>c,POST:()=>p});var o=t(96559),n=t(48088),a=t(37719),i=t(32190),u=t(44999),d=t(61223);async function p(e){try{let r=(0,d.createRouteHandlerClient)({cookies:u.cookies}),{data:{user:t},error:s}=await r.auth.getUser();if(s||!t)return i.NextResponse.json({error:"Unauthorized"},{status:401});let{userId:o,storeId:n,items:a,projectId:p,notes:c}=await e.json();if(o!==t.id)return i.NextResponse.json({error:"User ID mismatch"},{status:403});if(!n||!a||!Array.isArray(a)||0===a.length)return i.NextResponse.json({error:"Store ID and items are required"},{status:400});let l=`ORD-${Date.now()}-${Math.random().toString(36).substr(2,6).toUpperCase()}`,x=a.reduce((e,r)=>e+r.quantity*r.unitPrice,0),{data:m,error:f}=await r.from("orders").insert({user_id:o,store_id:n,project_id:p||null,order_number:l,status:"pending",payment_status:"pending",total_amount:x,subtotal:x,tax_amount:0,shipping_amount:0,discount_amount:0,currency:"SAR",delivery_type:"standard",notes:c||null}).select("*").single();if(f)return i.NextResponse.json({error:"Failed to create order"},{status:500});let h=a.map(e=>({order_id:m.id,product_id:e.productId,quantity:e.quantity,price:e.unitPrice,has_warranty:e.hasWarranty||!1,warranty_duration_months:e.warrantyDurationMonths||null,warranty_notes:e.warrantyNotes||null})),{error:y}=await r.from("order_items").insert(h);if(y)return await r.from("orders").delete().eq("id",m.id),i.NextResponse.json({error:"Failed to create order items"},{status:500});return i.NextResponse.json({success:!0,orderId:m.id,orderNumber:m.order_number,order:m})}catch(e){return i.NextResponse.json({error:e instanceof Error?e.message:"Failed to create order"},{status:500})}}async function c(e){try{let r=(0,d.createRouteHandlerClient)({cookies:u.cookies}),{data:{user:t},error:s}=await r.auth.getUser();if(s||!t)return i.NextResponse.json({error:"Unauthorized"},{status:401});let o=e.nextUrl.searchParams.get("orderId");if(o){let{data:e,error:s}=await r.from("orders").select(`
          *,
          order_items (
            *,
            products (
              name,
              description,
              images
            )
          ),
          projects (
            name
          ),
          stores (
            store_name
          )
        `).eq("id",o).eq("user_id",t.id).single();if(s)return i.NextResponse.json({error:"Order not found"},{status:404});return i.NextResponse.json(e)}{let{data:e,error:s}=await r.from("orders").select(`
          *,
          order_items (
            quantity,
            price
          ),
          projects (
            name
          ),
          stores (
            store_name
          )
        `).eq("user_id",t.id).order("created_at",{ascending:!1});if(s)return i.NextResponse.json({error:"Failed to fetch orders"},{status:500});return i.NextResponse.json(e)}}catch(e){return i.NextResponse.json({error:e instanceof Error?e.message:"Failed to fetch orders"},{status:500})}}let l=new o.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/orders/route",pathname:"/api/orders",filename:"route",bundlePath:"app/api/orders/route"},resolvedPagePath:"C:\\Users\\hp\\BinnaCodes\\binna\\src\\app\\api\\orders\\route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:x,workUnitAsyncStorage:m,serverHooks:f}=l;function h(){return(0,a.patchFetch)({workAsyncStorage:x,workUnitAsyncStorage:m})}},78335:()=>{},79428:e=>{"use strict";e.exports=require("buffer")},79551:e=>{"use strict";e.exports=require("url")},81630:e=>{"use strict";e.exports=require("http")},91645:e=>{"use strict";e.exports=require("net")},94735:e=>{"use strict";e.exports=require("events")},96487:()=>{}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[4243,580,9398,1223,4999],()=>t(75232));module.exports=s})();