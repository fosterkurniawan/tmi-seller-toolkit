const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(process.env.TOOLKIT_WEB||'web');
function gate(record,accessPage=false){
 let stored=record===undefined?null:JSON.stringify(record),redirect=null;
 const location={href:'https://example.com/index.html#promo',hash:'#promo',replace:url=>redirect=String(url)};
 const document={documentElement:{dataset:{accessPage:accessPage?'true':undefined},hidden:true},addEventListener(){}};
 const window={addEventListener(){}};
 const sessionStorage={getItem(){return stored;},setItem(k,v){stored=v;},removeItem(){stored=null;}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'access-session.js'),'utf8'),{window,document,location,sessionStorage,URL,Date,setTimeout(){}});
 return{window,document,get redirect(){return redirect;},get stored(){return JSON.parse(stored);}};
}
test('direct workspace access redirects without local completion marker',()=>{
 assert.equal(gate().redirect,'https://example.com/access.html?next=promo');
 for(const record of [{version:1,accessConsent:false,expiresAt:Date.now()+10000},{version:1,accessConsent:true,expiresAt:Date.now()-1},{version:1,accessConsent:true,expiresAt:Date.now()+13*3600000}])assert.ok(gate(record).redirect);
});
test('preview marker stores no personal fields and supports optional marketing',()=>{
 const g=gate(undefined,true);assert.equal(g.window.ToolkitAccess.grant(false),true);
 assert.deepEqual(Object.keys(g.stored).sort(),['version','issuedAt','expiresAt','accessConsent','marketingConsent','noticeVersion'].sort());assert.equal(g.stored.marketingConsent,false);
 const entered=gate(g.stored);assert.equal(entered.redirect,null);assert.equal(entered.document.documentElement.hidden,false);
 entered.window.ToolkitAccess.signOut();assert.equal(entered.stored,null);assert.equal(entered.redirect,'https://example.com/access.html');
});
test('legacy saved pricing receives neutral new fields without changing costs',()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 const code=html.slice(html.indexOf('const DEFAULTS='),html.indexOf('const LABELS='));
 const saved={margin:{price:123456,discount:10,cogs:50000,fixed:750},returns:[],units:27};
 const context={structuredClone,localStorage:{getItem:()=>JSON.stringify(saved)}};
 vm.runInNewContext(code+';globalThis.loaded=state;',context);
 assert.equal(context.loaded.margin.price,123456);assert.equal(context.loaded.margin.fixed,750);
 assert.equal(context.loaded.margin.orderQty,1);assert.equal(context.loaded.margin.operations,0);assert.equal(context.loaded.margin.protection,0);assert.equal(context.loaded.roasLinked,false);assert.equal(context.loaded.units,27);
});
test('valid loss scenario remains saveable while linked ROAS cannot break even',()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 const pricing=require(path.join(root,'pricing.js'));
 const math=html.slice(html.indexOf('function nonnegative('),html.indexOf('window.ToolkitMath='));
 const save=html.slice(html.indexOf('function save(){'),html.indexOf('function downloadBlob('));
 const state={margin:{price:100000,discount:0,cogs:150000,pack:0,ship:0,fixed:1250,admin:8.75,affiliate:5,service:0,ads:0,other:0,target:20,orderQty:1,operations:0,protection:1},roas:{revenue:10000000,spend:2000000,margin:-65.3},roasLinked:true,stock:{daily:10,onhand:20,allocated:0,inbound:0,lead:3,buffer:1,review:7},units:50};
 let stored=null;
 const context={SellerPricing:pricing,state,STORE:'test',localStorage:{setItem(k,v){stored=JSON.parse(v);}},refreshWorkspace(){},toast(){}};
 vm.runInNewContext(math+save+';save();',context);
 assert.ok(stored);assert.equal(stored.margin.cogs,150000);assert.equal(stored.roas.margin,-65.3);
 stored=null;state.roas.spend=0;vm.runInNewContext(save+';save();',context);assert.equal(stored,null);
});
