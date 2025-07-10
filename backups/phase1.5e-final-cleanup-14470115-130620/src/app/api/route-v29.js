(()=>{var e={};e.id=9591,e.ids=[9591],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11997:e=>{"use strict";e.exports=require("punycode")},27910:e=>{"use strict";e.exports=require("stream")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},34631:e=>{"use strict";e.exports=require("tls")},39727:()=>{},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},47990:()=>{},51906:e=>{function r(e){var r=Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}r.keys=()=>[],r.resolve=r,r.id=51906,e.exports=r},55511:e=>{"use strict";e.exports=require("crypto")},55591:e=>{"use strict";e.exports=require("https")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},74075:e=>{"use strict";e.exports=require("zlib")},78335:()=>{},79428:e=>{"use strict";e.exports=require("buffer")},79551:e=>{"use strict";e.exports=require("url")},81630:e=>{"use strict";e.exports=require("http")},91645:e=>{"use strict";e.exports=require("net")},94735:e=>{"use strict";e.exports=require("events")},95918:(e,r,t)=>{"use strict";t.r(r),t.d(r,{patchFetch:()=>x,routeModule:()=>d,serverHooks:()=>m,workAsyncStorage:()=>l,workUnitAsyncStorage:()=>_});var s={};t.r(s),t.d(s,{GET:()=>p});var i=t(96559),o=t(48088),a=t(37719),n=t(32190),c=t(44999),u=t(61223);async function p(e){try{let r=(0,u.createRouteHandlerClient)({cookies:c.cookies}),{data:{user:t},error:s}=await r.auth.getUser();if(s||!t)return n.NextResponse.json({error:"Unauthorized"},{status:401});let{searchParams:i}=new URL(e.url),o=i.get("barcode"),a=i.get("store_id"),p=i.get("location");if(!o)return n.NextResponse.json({error:"Barcode is required"},{status:400});if(a){let{data:e,error:t}=await r.from("products").select(`
          id,
          name,
          description,
          price,
          barcode,
          sku,
          category,
          brand,
          stock_quantity,
          tax_rate,
          is_active,
          image_url,
          cost_price,
          min_stock_level,
          created_at,
          updated_at
        `).eq("store_id",a).eq("is_active",!0).or(`barcode.eq.${o},sku.eq.${o},name.ilike.%${o}%`).limit(10);if(!t&&e&&e.length>0)return n.NextResponse.json({success:!0,source:"store_inventory",products:e.map(e=>({id:e.id,name:e.name,description:e.description,price:e.price,barcode:e.barcode||e.sku,stock_quantity:e.stock_quantity,category:e.category,brand:e.brand,tax_rate:e.tax_rate||.15,is_active:e.is_active,image_url:e.image_url,cost_price:e.cost_price,profit_margin:e.cost_price?((e.price-e.cost_price)/e.cost_price*100).toFixed(2):null}))})}let{data:d,error:l}=await r.from("global_items").select(`
        *,
        store_inventory (
          store_id,
          price,
          quantity_available,
          store:stores (
            id,
            name,
            location,
            contact_phone,
            email
          )
        )      `).eq("barcode",o).single();if(l||!d){if(a)return n.NextResponse.json({success:!1,message:`لم يتم العثور على منتج بالباركود: ${o}`,suggestions:[],canCreateNew:!0});return n.NextResponse.json({error:"Item not found"},{status:404})}let _=d.store_inventory.filter(e=>e.quantity_available>0);if(0===_.length)return n.NextResponse.json({item:d,message:"Item found but not available in any store",availableStores:[]});let m=_;return m=p?_.sort(()=>Math.random()-.5):_.sort((e,r)=>e.price-r.price),n.NextResponse.json({item:{id:d.id,barcode:d.barcode,name:d.name,description:d.description,category:d.category,brand:d.brand,specifications:d.specifications,image_url:d.image_url,warranty_period_months:d.warranty_period_months},availableStores:m.map(e=>({store:e.store,price:e.price,quantity:e.quantity_available,storeInventoryId:e.store_id}))})}catch(e){return n.NextResponse.json({error:"Failed to search for item"},{status:500})}}let d=new i.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/api/barcode-search/route",pathname:"/api/barcode-search",filename:"route",bundlePath:"app/api/barcode-search/route"},resolvedPagePath:"C:\\Users\\hp\\BinnaCodes\\binna\\src\\app\\api\\barcode-search\\route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:l,workUnitAsyncStorage:_,serverHooks:m}=d;function x(){return(0,a.patchFetch)({workAsyncStorage:l,workUnitAsyncStorage:_})}},96487:()=>{}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[4243,580,9398,1223,4999],()=>t(95918));module.exports=s})();