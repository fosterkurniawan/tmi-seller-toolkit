/* Pricing math: source HTML premium rule, with the workspace's editable fees retained. */
(function(root) {
  'use strict';
  const PREMIUM_RATE = 0.003, MAX = 1e12;
  const ceilGrid = (value, step = 1) => {
    const q = value / step, nearest = Math.round(q);
    return (Math.abs(q-nearest) < 1e-9 ? nearest : Math.ceil(q)) * step;
  };
  function costs(p) {
    p = {orderQty: 1, operations: 0, protection: 0, ...p};
    const keys = ['price','discount','cogs','pack','ship','fixed','admin','affiliate','service','ads','other','target','operations','orderQty'];
    if (!keys.every(k => Number.isFinite(p[k]) && p[k] >= 0 && p[k] <= MAX)) return {error:'Isi seluruh angka dengan nilai non-negatif yang valid.'};
    if (!Number.isInteger(p.orderQty) || p.orderQty < 1 || p.orderQty > 1e6) return {error:'Item per pesanan harus bilangan bulat 1–1.000.000.'};
    if (![0,1].includes(p.protection)) return {error:'Status proteksi tidak valid.'};
    if (p.price <= 0) return {error:'Harga daftar harus lebih besar dari 0.'};
    if (p.discount >= 100) return {error:'Diskon harus kurang dari 100%.'};
    const f = (p.admin+p.affiliate+p.service)/100, d=p.discount/100, t=p.target/100;
    const premiumRate = p.protection ? PREMIUM_RATE : 0;
    if (f+premiumRate >= 1 || t >= 1 || f+premiumRate+t >= 1) return {error:'Biaya persentase, premi, dan target margin harus berjumlah kurang dari 100%.'};
    const net=p.price*(1-d), processing=p.fixed/p.orderQty, percentCost=net*f;
    const fixedCost=p.cogs+p.pack+p.ship+processing+p.other+p.operations;
    const sellerPremium=net*premiumRate, without=net-percentCost-fixedCost-p.ads;
    const after=without-sellerPremium, before=after+p.ads;
    const settlement=net-percentCost-processing;
    return {net,f,d,t,premiumRate,processing,percentCost,fixedCost,sellerPremium,without,withoutRatio:without/net,
      after,before,ratio:after/net,operations:p.operations,settlement,total:net-after,
      marginImpact:premiumRate*100,enabled:Boolean(p.protection)};
  }
  function recommended(p, target=p.target/100) {
    const m=costs(p); if(m.error)return m;
    if(!Number.isFinite(target)||target<0||m.f+m.premiumRate+target>=1)return {error:'Target margin tidak dapat dicapai.'};
    const exact=(m.fixedCost+p.ads)/((1-m.d)*(1-m.f-m.premiumRate-target));
    let price=Math.max(1,ceilGrid(exact));
    if(price>MAX)return {error:'Harga target melebihi batas Rp1 triliun.'};
    let r=costs({...p,price});
    if(r.after+1e-7<r.net*target) { price+=1; r=costs({...p,price}); }
    if(price>MAX||r.error)return {error:'Harga target melebihi batas Rp1 triliun.'};
    return {price,net:r.net,profit:r.after,margin:r.ratio,sellerPremium:r.sellerPremium};
  }
  function marginCalc(p) {
    const m=costs(p);if(m.error)return m;
    const targetResult=recommended(p), offResult=recommended({...p,protection:0}), breakEven=recommended(p,0);
    return {...m,targetResult,offResult,breakEven,targetPrice:targetResult.price,minPrice:breakEven.price,
      maxDiscount:1-(m.fixedCost+p.ads)/(p.price*(1-m.f-m.premiumRate-m.t))};
  }
  function promoCalc(p,discount,units) {
    if(!Number.isFinite(discount)||discount<0||discount>=1)return {error:'Diskon skenario harus kurang dari 100%.'};
    if(!Number.isInteger(units)||units<1||units>1e8)return {error:'Rencana unit harus berupa bilangan bulat positif.'};
    const m=costs({...p,discount:discount*100});if(m.error)return m;
    const total=m.after*units;
    if(Math.abs(total)>Number.MAX_SAFE_INTEGER)return {error:'Total skenario terlalu besar; kurangi unit.'};
    return {...m,discount,total};
  }
  function allocateOperations(monthly,units) {
    if(!Number.isFinite(monthly)||monthly<0||monthly>MAX||!Number.isInteger(units)||units<1||units>1e8)return {error:'Isi biaya bulanan ≥ 0 dan jumlah item bulat lebih dari 0.'};
    return {perItem:ceilGrid(monthly/units,0.01)};
  }
  const api={PREMIUM_RATE,ceilGrid,costs,recommended,marginCalc,promoCalc,allocateOperations};
  root.SellerPricing=Object.freeze(api);
  if(typeof module !== 'undefined' && module.exports)module.exports=api;
})(typeof window !== 'undefined' ? window : globalThis);
