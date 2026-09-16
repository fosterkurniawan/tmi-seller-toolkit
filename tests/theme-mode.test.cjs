const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(process.env.TOOLKIT_WEB||'web');
function theme({saved=null,dark=false,blocked=false}={}){
 const listeners={},name={textContent:''},attrs={},button={setAttribute(k,v){attrs[k]=v;},querySelector(){return name;},addEventListener(k,v){listeners[k]=v;}};
 const media={matches:dark,addEventListener(k,v){listeners.media=v;}};
 const document={documentElement:{dataset:{}},getElementById(){return button;},querySelector(){return null;},addEventListener(k,v){listeners[k]=v;}};
 let stored=saved;const window={matchMedia:()=>media,addEventListener(k,v){listeners[k]=v;}};
 const localStorage={getItem(){if(blocked)throw Error('blocked');return stored;},setItem(k,v){if(blocked)throw Error('blocked');assert.equal(k,'tmi-seller-theme');stored=v;}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'theme-mode.js'),'utf8'),{window,document,localStorage});listeners.DOMContentLoaded();
 return{document,listeners,attrs,name,get stored(){return stored;}};
}
test('theme defaults to device appearance, with saved preference taking precedence',()=>{assert.equal(theme({dark:true}).document.documentElement.dataset.theme,'dark');assert.equal(theme({dark:true,saved:'light'}).document.documentElement.dataset.theme,'light');assert.equal(theme({saved:'invalid'}).document.documentElement.dataset.theme,'light');});
test('toggle persists independent preference and updates accessible state',()=>{const t=theme();t.listeners.click();assert.equal(t.stored,'dark');assert.equal(t.attrs['aria-checked'],'true');assert.equal(t.name.textContent,'Gelap');t.listeners.media({matches:false});assert.equal(t.document.documentElement.dataset.theme,'dark');t.listeners.click();assert.equal(t.stored,'light');assert.equal(t.attrs['aria-checked'],'false');});
test('theme works without storage and responds to device or other-tab changes',()=>{const t=theme({blocked:true});t.listeners.media({matches:true});assert.equal(t.document.documentElement.dataset.theme,'dark');t.listeners.click();assert.equal(t.document.documentElement.dataset.theme,'light');t.listeners.storage({key:'tmi-seller-theme',newValue:'dark'});assert.equal(t.document.documentElement.dataset.theme,'dark');t.listeners.storage({key:'unrelated',newValue:'light'});assert.equal(t.document.documentElement.dataset.theme,'dark');});
