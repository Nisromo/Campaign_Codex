/* Campaign Codex service worker — lets the site open and run with no internet. Pages: network first, cached copy when offline. Files, fonts and libraries: cached copy first, refreshed in the background. Account/database calls are never cached. */
const CC_CACHE="campaign-codex-v1";
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CC_CACHE).then(c=>c.addAll(["./","./index.html","./manifest.json"]).catch(()=>{})))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("campaign-codex-")&&k!==CC_CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;let u;try{u=new URL(r.url)}catch(x){return}
 if(/supabase\.co$/.test(u.hostname)||u.pathname.startsWith("/.netlify/"))return;
 if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{if(res&&res.ok){const c=res.clone();caches.open(CC_CACHE).then(ca=>ca.put("./index.html",c))}return res}).catch(()=>caches.match("./index.html").then(m=>m||caches.match("./"))));return}
 const same=u.origin===self.location.origin,lib=/(^|\.)(cdn\.jsdelivr\.net|unpkg\.com|cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(u.hostname);if(!same&&!lib)return;
 e.respondWith(caches.open(CC_CACHE).then(ca=>ca.match(r).then(m=>{const f=fetch(r).then(res=>{res&&(res.ok||"opaque"===res.type)&&ca.put(r,res.clone());return res}).catch(()=>m);return m||f})))});
