/* Appearance preference is independent of access and calculator data. Apply before paint. */
(function(){
  'use strict';
  const KEY='tmi-seller-theme';
  const system=window.matchMedia('(prefers-color-scheme: dark)');
  let preference=null;
  try{const saved=localStorage.getItem(KEY);if(['light','dark'].includes(saved))preference=saved;}catch(_){}
  function apply(mode){
    document.documentElement.dataset.theme=mode;
    const button=document.getElementById('theme-toggle');
    if(button){button.setAttribute('aria-checked',String(mode==='dark'));button.querySelector('.theme-name').textContent=mode==='dark'?'Gelap':'Terang';}
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta)meta.content=mode==='dark'?'#101014':'#f7f7f9';
    if(typeof localizeUI==='function')localizeUI();
  }
  apply(preference||(system.matches?'dark':'light'));
  document.addEventListener('DOMContentLoaded',()=>{
    apply(preference||(system.matches?'dark':'light'));
    document.getElementById('theme-toggle')?.addEventListener('click',()=>{
      preference=document.documentElement.dataset.theme==='dark'?'light':'dark';
      try{localStorage.setItem(KEY,preference);}catch(_){}
      apply(preference);
    });
  });
  system.addEventListener('change',e=>{if(!preference)apply(e.matches?'dark':'light');});
  window.addEventListener('storage',e=>{if(e.key!==KEY)return;preference=['light','dark'].includes(e.newValue)?e.newValue:null;apply(preference||(system.matches?'dark':'light'));});
})();
