(()=>{var t={};t.id=8898,t.ids=[8898],t.modules={3295:t=>{"use strict";t.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:t=>{"use strict";t.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11997:t=>{"use strict";t.exports=require("punycode")},27910:t=>{"use strict";t.exports=require("stream")},29294:t=>{"use strict";t.exports=require("next/dist/server/app-render/work-async-storage.external.js")},34631:t=>{"use strict";t.exports=require("tls")},39727:()=>{},44870:t=>{"use strict";t.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},47990:()=>{},48023:(t,e,r)=>{"use strict";r.a(t,async(t,s)=>{try{r.r(e),r.d(e,{patchFetch:()=>u,routeModule:()=>c,serverHooks:()=>h,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>l});var a=r(96559),i=r(48088),p=r(37719),n=r(52696),o=t([n]);n=(o.then?(await o)():o)[0];let c=new a.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/admin/products/route",pathname:"/api/admin/products",filename:"route",bundlePath:"app/api/admin/products/route"},resolvedPagePath:"C:\\Users\\hp\\BinnaCodes\\binna\\src\\app\\api\\admin\\products\\route.ts",nextConfigOutput:"",userland:n}),{workAsyncStorage:d,workUnitAsyncStorage:l,serverHooks:h}=c;function u(){return(0,p.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:l})}s()}catch(t){s(t)}})},51906:t=>{function e(t){var e=Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}e.keys=()=>[],e.resolve=e,e.id=51906,t.exports=e},52696:(t,e,r)=>{"use strict";r.a(t,async(t,s)=>{try{r.r(e),r.d(e,{GET:()=>u,POST:()=>c});var a=r(32190),i=r(39398),p=r(64939),n=t([p]);async function o(){let t=new p.Client({connectionString:process.env.DATABASE_URL});return await t.connect(),t}async function u(t){try{let{searchParams:e}=new URL(t.url),r=e.get("limit")||"20",s=e.get("offset")||"0",i=await o(),p=`
      SELECT 
        p.id,
        p.title,
        p.subtitle,
        p.description,
        p.handle,
        p.status,
        p.created_at,
        p.updated_at,
        p.weight,
        p.length,
        p.height,
        p.width,
        p.metadata,
        COUNT(pv.id) as variant_count
      FROM product p
      LEFT JOIN product_variant pv ON p.id = pv.product_id
      WHERE p.deleted_at IS NULL
      GROUP BY p.id, p.title, p.subtitle, p.description, p.handle, p.status, p.created_at, p.updated_at, p.weight, p.length, p.height, p.width, p.metadata
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
    `,[n,u]=await Promise.all([i.query(p,[r,s]),i.query("SELECT COUNT(*) as total FROM product")]);await i.end();let c=n.rows.map(t=>({...t,variant_count:parseInt(t.variant_count)||0})),d=parseInt(u.rows[0].total);return a.NextResponse.json({products:c,count:d,limit:parseInt(r),offset:parseInt(s),has_more:parseInt(s)+parseInt(r)<d})}catch(t){return a.NextResponse.json({error:"Failed to fetch products"},{status:500})}}async function c(t){try{let e=await t.json(),r=await o(),{title:s,subtitle:i,description:p,handle:n,status:u="draft",weight:c,length:d,height:l,width:h,metadata:x={}}=e,w=n||s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");if((await r.query("SELECT id FROM product WHERE handle = $1",[w])).rows.length>0)return await r.end(),a.NextResponse.json({error:"Product handle already exists"},{status:400});let g=`
      INSERT INTO product (
        title, subtitle, description, handle, status, weight, length, height, width, metadata, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      RETURNING *
    `,E=await r.query(g,[s,i,p,w,u,c,d,l,h,JSON.stringify(x)]);await r.end();let m=E.rows[0];return a.NextResponse.json({product:m,message:"Product created successfully"},{status:201})}catch(t){return a.NextResponse.json({error:"Failed to create product"},{status:500})}}p=(n.then?(await n)():n)[0],(0,i.createClient)("https://lqhopwohuddhapkhhikf.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY),s()}catch(t){s(t)}})},55511:t=>{"use strict";t.exports=require("crypto")},55591:t=>{"use strict";t.exports=require("https")},63033:t=>{"use strict";t.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},64939:t=>{"use strict";t.exports=import("pg")},74075:t=>{"use strict";t.exports=require("zlib")},78335:()=>{},79428:t=>{"use strict";t.exports=require("buffer")},79551:t=>{"use strict";t.exports=require("url")},81630:t=>{"use strict";t.exports=require("http")},91645:t=>{"use strict";t.exports=require("net")},94735:t=>{"use strict";t.exports=require("events")},96487:()=>{}};var e=require("../../../../webpack-runtime.js");e.C(t);var r=t=>e(e.s=t),s=e.X(0,[4243,580,9398],()=>r(48023));module.exports=s})();