(function(){
  'use strict';
  const form=document.querySelector('#access-form');
  const field=id=>document.getElementById(id);
  const keys=['fullName','phone','email','storeName','accessConsent'];
  function validPhone(value){if(!/^[+0-9\s()-]+$/.test(value))return false;let n=value.replace(/[\s()-]/g,'');if(n.startsWith('+62'))n=n.slice(1);else if(n.startsWith('0'))n='62'+n.slice(1);return /^62[1-9]\d{7,11}$/.test(n);}
  function validation(id){const el=field(id),v=el.value.trim();if(id==='fullName')return v.length>=2&&/\p{L}/u.test(v)&&!/[<>\u0000-\u001F]/.test(v)?'':'Masukkan nama lengkap, minimal 2 karakter.';if(id==='storeName')return v.length>0?'':'Masukkan nama toko.';if(id==='phone')return validPhone(v)?'':'Gunakan nomor Indonesia dengan awalan 0 atau +62.';if(id==='email')return /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(v)&&el.validity.valid?'':'Masukkan alamat email yang valid.';return el.checked?'':'Persetujuan akses wajib dicentang.';}
  function show(id){const message=validation(id);field(id).setAttribute('aria-invalid',String(Boolean(message)));field(id+'-error').textContent=message;return message;}
  for(const id of keys){field(id).addEventListener('blur',()=>{show(id);localizeUI();});field(id).addEventListener(id==='accessConsent'?'change':'input',()=>{if(field(id).getAttribute('aria-invalid')==='true'){show(id);localizeUI();}});}
  // Move through required fields with the mobile keyboard's Next key.
  keys.slice(0,-1).forEach((id,index)=>field(id).addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();show(id);localizeUI();if(!validation(id))field(keys[index+1]).focus();}}));
  form.addEventListener('submit',e=>{e.preventDefault();let first=null;for(const id of keys)if(show(id)&&!first)first=field(id);localizeUI();if(first){first.focus();return;}
    if(!ToolkitAccess.grant(field('marketingConsent').checked)){field('access-error').textContent='Penyimpanan sesi diblokir. Izinkan penyimpanan browser untuk masuk.';localizeUI();return;}
    form.reset();const next=new URL(location.href).searchParams.get('next');const pages=['home','margin','promo','roas','stock','returns','templates','webinar','protection','sources','master'];const url=new URL('index.html',location.href);url.hash=pages.includes(next)?next:'home';location.replace(url.href);
  });
  window.addEventListener('pageshow',e=>{if(e.persisted){form.reset();for(const id of keys){field(id).removeAttribute('aria-invalid');field(id+'-error').textContent='';}}});
  initializeLanguage();
})();
