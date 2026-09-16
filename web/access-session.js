/* Local form-completion gate, not server authentication. Never store personal fields. */
(function(){
  const KEY='seller-toolkit-access-v1', DURATION=12*60*60*1000;
  function current(){try{const s=JSON.parse(sessionStorage.getItem(KEY));return s&&s.version===1&&s.accessConsent===true&&Number.isFinite(s.expiresAt)&&s.expiresAt>Date.now()&&s.expiresAt<=Date.now()+DURATION?s:null;}catch(_){return null;}}
  function signOut(){try{sessionStorage.removeItem(KEY);}catch(_){}location.replace(new URL('access.html',location.href));}
  window.ToolkitAccess={current,signOut,grant(marketing){const issuedAt=Date.now();try{sessionStorage.setItem(KEY,JSON.stringify({version:1,issuedAt,expiresAt:issuedAt+DURATION,accessConsent:true,marketingConsent:Boolean(marketing),noticeVersion:'local-preview-2026-09'}));return Boolean(current());}catch(_){return false;}}};
  if(document.documentElement.dataset.accessPage==='true')return;
  function check(){if(current()){document.documentElement.hidden=false;return true;}document.documentElement.hidden=true;const url=new URL('access.html',location.href);if(/^#[a-z]+$/.test(location.hash))url.searchParams.set('next',location.hash.slice(1));location.replace(url.href);return false;}
  if(check()){const delay=current().expiresAt-Date.now();setTimeout(check,delay+50);}
  window.addEventListener('pageshow',check);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)check();});
})();
