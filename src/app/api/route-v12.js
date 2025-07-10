(()=>{var e={};e.id=4640,e.ids=[4640],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11997:e=>{"use strict";e.exports=require("punycode")},27910:e=>{"use strict";e.exports=require("stream")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},34631:e=>{"use strict";e.exports=require("tls")},39727:()=>{},42135:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>x,routeModule:()=>d,serverHooks:()=>g,workAsyncStorage:()=>l,workUnitAsyncStorage:()=>h});var o={};r.r(o),r.d(o,{POST:()=>u});var s=r(96559),i=r(48088),n=r(37719),a=r(34386),c=r(32190),p=r(44999);async function u(e){try{let t,r,o,s=e.headers.get("content-type")||"";if(s.includes("application/json")){let s=await e.json();t=s.email,r=s.password,o=s.debug}else{if(!s.includes("application/x-www-form-urlencoded"))return c.NextResponse.json({success:!1,error:"Unsupported content type"},{status:400});let i=await e.formData();t=i.get("email"),r=i.get("password"),o=i.get("debug")}let i="true"===o;if(!t||!r)return c.NextResponse.json({success:!1,error:"Email and password are required"},{status:400});let n=await (0,p.cookies)(),u=(0,a.createServerClient)("https://lqhopwohuddhapkhhikf.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY4OTI4MDYsImV4cCI6MjAzMjQ2ODgwNn0.vCxGDrVNvKA7OhwcYZLJp0mVwL_P5fJ8XDGfRp0MNio",{cookies:{getAll:()=>n.getAll(),setAll(e){try{e.forEach(({name:e,value:t,options:r})=>{n.set(e,t,r)})}catch{}}}}),{data:d,error:l}=await u.auth.signInWithPassword({email:t,password:r});if(l||!d.session)return c.NextResponse.json({success:!1,error:l?.message||"Login failed"},{status:401});let{data:h,error:g}=await u.from("users").select("account_type").eq("email",t).single();if(g||!h?.account_type)return c.NextResponse.json({success:!1,error:"Failed to fetch user data"},{status:500});let x="store"===h.account_type?"/store/dashboard":"user"===h.account_type||"client"===h.account_type?"/user/dashboard":"engineer"===h.account_type||"consultant"===h.account_type?"/dashboard/construction-data":"/",m=c.NextResponse.redirect(new URL(x,e.url),{headers:{"Cache-Control":"no-store, no-cache, must-revalidate, proxy-revalidate",Pragma:"no-cache",Expires:"0","Surrogate-Control":"no-store"}});if(i){let e=`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Login Debug Info</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
            .container { max-width: 800px; margin: 0 auto; background: #f5f5f5; padding: 20px; border-radius: 5px; }
            h2 { color: #333; }
            .cookie-list { background: #fff; padding: 10px; border-radius: 3px; font-family: monospace; }
            .redirect-btn { display: inline-block; margin-top: 20px; padding: 10px 15px; background: #4CAF50; color: white; text-decoration: none; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Login Debug Information</h2>
            <p><strong>Authentication:</strong> ✅ Successful</p>
            <p><strong>Cookie Management:</strong> Handled by Supabase SSR automatically</p>
            <p><strong>User Account Type:</strong> ${h.account_type}</p>
            <p><strong>Redirect Destination:</strong> ${x}</p>
            
            <p>Supabase SSR will automatically set the appropriate authentication cookies with the correct naming convention that the middleware expects.</p>
            
            <p>To test if cookies are properly passed to middleware, click the button below:</p>
            <a href="${x}" class="redirect-btn">Continue to ${x}</a>
            
            <script>
              // Function to check client-side accessible cookies
              function checkCookies() {
                const cookies = document.cookie.split(';').map(c => c.trim()).filter(c => c);
                const container = document.querySelector('.container');
                
                const cookieDiv = document.createElement('div');
                cookieDiv.className = 'cookie-list';
                cookieDiv.innerHTML = '<p><strong>Client-side visible cookies:</strong></p>';
                
                if (cookies.length > 0) {
                  cookies.forEach(cookie => {
                    cookieDiv.innerHTML += '<p>' + cookie + '</p>';
                  });
                } else {
                  cookieDiv.innerHTML += '<p>No client-side visible cookies found (this is expected for httpOnly cookies)</p>';
                }
                
                container.appendChild(cookieDiv);
              }
              
              // Run after page loads
              window.onload = checkCookies;
            </script>
          </div>
        </body>
        </html>
      `;return new c.NextResponse(e,{status:200,headers:{"Content-Type":"text/html"}})}return m}catch(e){return c.NextResponse.json({success:!1,error:"Internal server error"},{status:500})}}let d=new s.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/auth/direct-login/route",pathname:"/api/auth/direct-login",filename:"route",bundlePath:"app/api/auth/direct-login/route"},resolvedPagePath:"C:\\Users\\hp\\BinnaCodes\\binna\\src\\app\\api\\auth\\direct-login\\route.ts",nextConfigOutput:"",userland:o}),{workAsyncStorage:l,workUnitAsyncStorage:h,serverHooks:g}=d;function x(){return(0,n.patchFetch)({workAsyncStorage:l,workUnitAsyncStorage:h})}},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},47990:()=>{},51906:e=>{function t(e){var t=Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}t.keys=()=>[],t.resolve=t,t.id=51906,e.exports=t},55511:e=>{"use strict";e.exports=require("crypto")},55591:e=>{"use strict";e.exports=require("https")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},74075:e=>{"use strict";e.exports=require("zlib")},78335:()=>{},79428:e=>{"use strict";e.exports=require("buffer")},79551:e=>{"use strict";e.exports=require("url")},81630:e=>{"use strict";e.exports=require("http")},91645:e=>{"use strict";e.exports=require("net")},94735:e=>{"use strict";e.exports=require("events")},96487:()=>{}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[4243,580,9398,4999,4386],()=>r(42135));module.exports=o})();