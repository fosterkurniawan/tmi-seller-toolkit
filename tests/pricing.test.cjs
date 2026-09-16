const test=require('node:test'), assert=require('node:assert/strict');
const path=require('node:path');
const M=require(path.resolve(process.env.TOOLKIT_WEB || 'web','pricing.js'));
const sample={price:100000,discount:0,cogs:55000,pack:0,ship:0,fixed:1250,admin:8.75,affiliate:5,service:0,ads:0,other:0,target:20,orderQty:1,operations:0,protection:1};
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
test('source example separates seller premium from HPP and marketplace',()=>{
 const r=M.marginCalc(sample);close(r.sellerPremium,300);close(r.without,30000);close(r.after,29700);close(r.settlement,85000);close(r.ratio,.297);close(r.marginImpact,.3);
 assert.equal(sample.cogs,55000);assert.equal(r.targetResult.price,85292);assert.ok(r.targetResult.margin>=.2);
 assert.ok(M.costs({...sample,price:r.targetPrice-1}).ratio<.2);
});
test('premium off preserves the existing workspace calculation',()=>{
 const p={price:100000,discount:10,cogs:50000,pack:2000,ship:2000,fixed:1250,admin:6,affiliate:5,service:2,ads:5000,other:0,target:15};
 close(M.marginCalc(p).after,18050);close(M.marginCalc({...p,protection:1}).after,17780);
 close(M.marginCalc({...p,protection:1}).before,22780);
});
test('order fee allocation, overhead and ad spend each deducted once',()=>{
 const r=M.marginCalc({...sample,orderQty:5,operations:5000,ads:2000});
 close(r.processing,250);close(r.after,23700);close(r.before,25700);close(r.settlement,86000);
 assert.equal(M.allocateOperations(1500000,300).perItem,5000);
 close(M.allocateOperations(100,3).perItem,33.34);
});
test('each promotion recalculates protection on discounted goods value',()=>{
 const r=M.promoCalc(sample,.1,50);close(r.sellerPremium,270);close(r.after,21105);close(r.total,1055250);
 close(M.promoCalc({...sample,protection:0},.1,50).after,21375);
});
test('recommendations reach target at their own recalculated premium',()=>{
 for(const discount of [0,10,50,90])for(const protection of [0,1])for(const orderQty of [1,3,10]){
  const p={...sample,discount,protection,orderQty,operations:1234.56};const r=M.recommended(p);
  assert.ok(!r.error);assert.ok(r.margin+1e-9>=.2);close(r.sellerPremium,r.net*(protection?.003:0));
  assert.ok(M.costs({...p,price:r.price-1}).ratio<.2);
 }
});
test('invalid and unreachable scenarios cannot create usable recommendations',()=>{
 for(const patch of [{price:0},{price:NaN},{discount:100},{orderQty:0},{orderQty:1.5},{operations:-1},{protection:2},{admin:90},{target:99}])assert.ok(M.marginCalc({...sample,...patch}).error);
 assert.ok(M.promoCalc(sample,.1,0).error);assert.ok(M.allocateOperations(100,0).error);
 assert.ok(M.marginCalc({...sample,cogs:1e12,discount:99}).targetResult.error);
});
