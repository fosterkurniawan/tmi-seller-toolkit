/* Local form-completion gate, not server authentication. Never store personal fields. */
(function(){
  const KEY='seller-toolkit-access-v1', DURATION=12*60*60*1000;
  const ALLOWED_PHONES=new Set(['6281334544432','6287888890005','62818944567','628777753221','6285780779215']);
  function isPhoneAllowed(value){if(typeof value!=='string'||!/^[+0-9\s()-]+$/.test(value))return false;let phone=value.replace(/[\s()-]/g,'');if(phone.startsWith('+62'))phone=phone.slice(1);else if(phone.startsWith('0'))phone='62'+phone.slice(1);return ALLOWED_PHONES.has(phone);}
  function current(){try{const s=JSON.parse(sessionStorage.getItem(KEY));return s&&s.version===2&&s.accessConsent===true&&Number.isFinite(s.expiresAt)&&s.expiresAt>Date.now()&&s.expiresAt<=Date.now()+DURATION?s:null;}catch(_){return null;}}
  function signOut(){try{sessionStorage.removeItem(KEY);}catch(_){}location.replace(new URL('access.html',location.href));}
  window.ToolkitAccess={current,signOut,isPhoneAllowed,grant(marketing,phone){if(!isPhoneAllowed(phone))return false;const issuedAt=Date.now();try{sessionStorage.setItem(KEY,JSON.stringify({version:2,issuedAt,expiresAt:issuedAt+DURATION,accessConsent:true,marketingConsent:Boolean(marketing),noticeVersion:'local-preview-2026-09'}));return Boolean(current());}catch(_){return false;}}};
  if(document.documentElement.dataset.accessPage==='true')return;
  function check(){if(current()){document.documentElement.hidden=false;return true;}document.documentElement.hidden=true;const url=new URL('access.html',location.href);if(/^#[a-z]+$/.test(location.hash))url.searchParams.set('next',location.hash.slice(1));location.replace(url.href);return false;}
  if(check()){const delay=current().expiresAt-Date.now();setTimeout(check,delay+50);}
  window.addEventListener('pageshow',check);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)check();});
})();
