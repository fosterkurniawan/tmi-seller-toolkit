// Additional workflows from the supplied bilingual toolkit; existing UI stays in place.
const SOURCE_EXAMPLE = {price:100000,discount:0,cogs:55000,pack:0,ship:0,fixed:1250,admin:8.75,affiliate:5,service:0,ads:0,other:0,target:20,orderQty:1,operations:0,protection:1};
function initializeProtection() {
  $('#page-margin .calc-layout .sub').textContent='Biaya per item, kecuali biaya platform per pesanan.';
  const logout=document.createElement('div');logout.className='logout-row';logout.innerHTML='<button class="btn ghost small" id="logout">Keluar</button>';$('#sidebar').append(logout);$('#logout').addEventListener('click',ToolkitAccess.signOut);
  const actions=document.createElement('div');actions.className='pricing-quick-actions';
  actions.innerHTML='<a href="#protection-title" class="btn ghost small protection-jump">Premi 0,3% ↓</a><button class="btn ghost small" id="source-example">Contoh proteksi</button><button class="btn ghost small" data-page="master">Biaya & referensi ↗</button>';
  $('#page-margin .page-heading').append(actions);
  const extras=document.createElement('div');extras.className='pricing-extras';
  extras.innerHTML=`<details class="ops-helper"><summary>Alokasi operasional bulanan</summary><p class="form-note">Gunakan alokasi atau input per item, jangan keduanya.</p>
    <div class="form-grid"><label class="field"><span>Total operasional / bulan</span><span class="input-wrap"><b>Rp</b><input id="ops-monthly" type="number" inputmode="decimal" min="0" max="1000000000000" step="any" placeholder="1500000"></span></label>
    <label class="field"><span>Item terjual / bulan</span><span class="input-wrap"><input id="ops-units" type="number" inputmode="numeric" min="1" max="100000000" step="1" placeholder="300"></span></label></div>
    <div class="ops-total"><span>Alokasi / item <b id="ops-suggestion">—</b></span><button class="btn ghost" id="apply-operations" type="button" disabled>Gunakan alokasi</button></div><p class="form-note" id="ops-message" role="status">Dibulatkan ke atas ke Rp0,01.</p></details>
    <section class="protection-input" aria-labelledby="protection-title"><div class="protection-top"><h2 id="protection-title">Biaya proteksi</h2><label class="protection-toggle"><input id="insurance-enabled" type="checkbox" role="switch"><span>Masukkan premi</span></label></div>
    <div class="premium-rate"><b>0,3%</b><span>Harga neto · dibayar seller</span></div><p class="form-note">Tarif untuk simulasi. Menyalakannya tidak mengaktifkan polis.</p><div id="premium-allocation"></div></section>`;
  $('#margin-form').after(extras);
  const resultColumn=$('#page-margin .calc-layout').lastElementChild;
  resultColumn.insertAdjacentHTML('beforeend','<div class="panel protection-compare" id="insurance-comparison"></div><div class="panel price-recommendation" id="price-recommendation"></div>');
  $('#page-margin .model-details').innerHTML='<summary>Bagaimana model ini menghitung?</summary><p>Harga neto = harga daftar × (1 − diskon). Premi seller = harga neto × 0,3% saat proteksi ON.</p><p>Biaya pesanan dibagi jumlah item. HPP, operasional, fee, iklan, dan premi dikurangkan masing-masing satu kali. Harga target memperhitungkan seluruh biaya dan premi pada harga baru.</p>';
  $('#page-promo .model-details').innerHTML='<summary>Asumsi sebelum menentukan promo</summary><p>Fee persentase dan premi dihitung ulang untuk setiap diskon. HPP, alokasi biaya pesanan, operasional, dan biaya lain tetap per item.</p>';
  $('#page-roas .connection-panel small').textContent='Margin setelah premi & operasional, sebelum iklan. Edit manual untuk memutus hubungan.';
  const master=document.createElement('section');master.id='page-master';master.className='page';
  master.innerHTML=`<div class="page-heading"><div><div class="eyebrow">ASUMSI SIMULASI</div><h1>Biaya & referensi</h1><p>Profil contoh untuk simulasi. Sesuaikan biaya dengan tokomu.</p></div></div><div class="panel"><h2>Profil contoh proteksi</h2><div class="reference-grid">
    ${[['Biaya platform / pesanan','Rp1.250'],['Biaya platform','8,75%'],['Komisi affiliate','5%'],['Premi seller','0,3%'],['Target keuntungan (%)','20%'],['Pembulatan harga','Rp1']].map(([label,value])=>`<div><span>${label}</span><b>${value}</b></div>`).join('')}</div>
    <p class="form-note">Profil contoh memakai harga Rp100.000 dan HPP Rp55.000. Diskon, kemasan, ongkir, operasional, layanan, iklan, dan biaya lain dimulai dari 0.</p><button class="btn primary" id="load-source-profile">Gunakan contoh ini</button><p class="form-note">Mengganti input kalkulator harga. Belum disimpan sampai kamu memilih Simpan.</p></div>
    <div class="notice">Angka ini adalah asumsi template, bukan tarif universal TikTok Shop atau penawaran premi resmi.</div>
    <div class="reference-links"><a class="panel" href="https://seller.tiktokglobalshop.com/business/id/affiliate" target="_blank" rel="noopener noreferrer"><h2>Panduan affiliate ↗</h2><p>Kolaborasi seller dan kreator.</p></a><a class="panel" href="https://ads.tiktok.com/business/en/guides/what-is-roas" target="_blank" rel="noopener noreferrer"><h2>Panduan ROAS ↗</h2><p>Pendapatan iklan dan biaya iklan.</p></a><a class="panel" href="https://ads.tiktok.com/resources/help/article/about-setting-different-affiliate-commission-rates-for-tiktok-shop-ads?lang=id" target="_blank" rel="noopener noreferrer"><h2>Komisi Shop Ads ↗</h2><p>Panduan komisi affiliate untuk iklan.</p></a></div>`;
  $('#main').append(master);
  const nav=document.createElement('button');nav.className='nav-btn';nav.dataset.page='master';nav.innerHTML=icon('book')+'<span>Biaya & referensi</span>';
  $('#sidebar [data-page="sources"]').before(nav);
  $('#page-protection .page-heading').insertAdjacentHTML('afterend',`<section class="panel protection-guide"><span class="badge mint">PREMI DALAM HITUNGAN</span><h2>Proteksi masuk perhitungan.</h2><p>Premi seller 0,3% dari harga setelah diskon. HPP tetap terpisah; harga rekomendasi sudah mencakup premi.</p><button class="btn primary" data-page="margin">Hitung harga + proteksi</button></section>`);
  $('#page-home .worksite-note').insertAdjacentHTML('beforebegin','<div class="protection-entry"><span>'+icon('shield')+'<b>Sudah hitung proteksi?</b></span><button class="btn ghost small" data-page="margin">Lihat dampak premi →</button></div>');
  const template=$('#page-templates');
  template.querySelector('.big-download').innerHTML=`<div><div class="eyebrow">TEMPLATE EXCEL · 9 SHEET</div><h2>Harga, premi & operasional.</h2><p>Template terbaru, termasuk premi seller 0,3% dan operasional.</p><button class="btn mint" data-download>Unduh Excel (.xlsx)</button><p class="form-note">Template profil contoh, bukan input sesi ini. Fee 8,75%, affiliate 5%, target 20%. Workbook berbahasa Indonesia.</p></div><div class="sheet-list">${['Mulai','Tarif & Sumber','Harga & Margin','Promo','ROAS','Stok','Biaya Retur','Respons','Operasional'].map((name,i)=>`<div class="sheet-item"><b>${String(i+1).padStart(2,'0')}</b><span>${name}</span></div>`).join('')}</div>`;
  template.querySelectorAll('.sheet-list').forEach((list,index)=>{if(index>0)list.remove();});
  $('#page-sources .page-heading').insertAdjacentHTML('afterend','<div class="intro-tip"><span>Perhitungan diperbarui: premi 0,3%, alokasi pesanan, dan operasional sudah terhubung.</span><button class="btn ghost small" data-page="master">Biaya & referensi ↗</button></div>');
  $('#insurance-enabled').addEventListener('change',e=>{state.margin.protection=Number(e.target.checked);recalc();});
  for(const id of ['ops-monthly','ops-units'])$('#'+id).addEventListener('input',updateOperationsHelper);
  $('#apply-operations').addEventListener('click',()=>{const r=updateOperationsHelper();if(r.error)return;state.margin.operations=r.perItem;$('#margin-operations').value=r.perItem;recalc();toast('Alokasi operasional diterapkan satu kali per item.');});
  for(const id of ['source-example','load-source-profile'])$('#'+id).addEventListener('click',()=>{state.margin={...SOURCE_EXAMPLE};state.roasLinked=true;renderFields();recalc();navigate('margin');toast('Contoh proteksi diterapkan. Biaya tetap bisa disesuaikan.');});
  document.addEventListener('click',e=>{if(e.target.closest('#apply-recommended')){const r=marginCalc(state.margin).targetResult;if(!r||r.error)return;state.margin.price=r.price;$('#margin-price').value=r.price;recalc();toast('Harga diterapkan. Premi dihitung ulang pada harga baru.');}});
}
function updateOperationsHelper(){
  const monthly=$('#ops-monthly').value, units=$('#ops-units').value;
  const r=SellerPricing.allocateOperations(monthly===''?NaN:Number(monthly),units===''?NaN:Number(units));
  $('#ops-suggestion').textContent=r.error?'—':rupiah(r.perItem);$('#apply-operations').disabled=Boolean(r.error);
  $('#ops-message').textContent=r.error?r.error:'Dibulatkan ke atas ke Rp0,01.';localizeUI();return r;
}
function renderPricing(){
  const m=marginCalc(state.margin);showError('margin',m.error);$('#insurance-enabled').checked=Boolean(state.margin.protection);
  if(m.error){$('#margin-result').innerHTML='<div class="result-label">Hasil belum dapat dihitung</div><div class="result-value">—</div>';for(const id of ['premium-allocation','insurance-comparison','price-recommendation'])$('#'+id).innerHTML='';return;}
  $('#margin-result').innerHTML=`<div class="result-label">Keuntungan setelah biaya</div><div class="result-value">${rupiah(m.after)}</div><div class="result-caption"><span>Margin</span> ${percent(m.ratio)}</div><span class="status-tag ${m.after<0?'negative':''}">${m.ratio+1e-10>=m.t?'Target input tercapai':'Belum mencapai target input'}</span>
    <div class="result-breakdown">${resultRow('Harga setelah diskon',rupiah(m.net))}${resultRow('Biaya penjualan (%)',rupiah(m.percentCost))}${resultRow('Alokasi biaya pesanan',rupiah(m.processing))}${resultRow('Estimasi settlement',rupiah(m.settlement),true)}${resultRow('Modal produk (HPP)',rupiah(state.margin.cogs))}${resultRow('Kemasan + ongkir seller',rupiah(state.margin.pack+state.margin.ship))}${resultRow('Operasional / item',rupiah(m.operations))}${resultRow('Biaya lain / item',rupiah(state.margin.other))}${resultRow('Alokasi iklan',rupiah(state.margin.ads))}${resultRow('Premi seller',rupiah(m.sellerPremium))}</div>`;
  $('#premium-allocation').innerHTML=`<div class="premium-total"><span>Premi / item</span><strong>${rupiah(m.sellerPremium)}</strong><span class="badge ${m.enabled?'mint':'gray'}">${m.enabled?'ON':'OFF'}</span></div>`;
  $('#insurance-comparison').innerHTML=`<h2>Dampak pada harga yang sama</h2><div class="compare-grid"><div><small>Tanpa proteksi</small><b>${rupiah(m.without)}</b><span>${percent(m.withoutRatio)}</span></div><div class="selected"><small>${m.enabled?'Dengan proteksi':'Proteksi OFF'}</small><b>${rupiah(m.after)}</b><span>${percent(m.ratio)}</span></div></div><p class="form-note"><span>Dampak margin (poin)</span>: ${number(m.marginImpact,2)}</p>`;
  const r=m.targetResult;
  $('#price-recommendation').innerHTML=`<span class="eyebrow">HARGA UNTUK TARGET</span><h2>${r.error?'—':rupiah(r.price)}</h2><p class="form-note"><span>Target keuntungan (%)</span>: ${number(state.margin.target,2)}% · <span>Sebelum diskon seller</span></p>
    ${r.error?`<p class="error show">${escapeHTML(r.error)}</p>`:`<div class="recommend-facts">${resultRow('Harga neto',rupiah(r.net))}${resultRow('Premi pada harga target',rupiah(r.sellerPremium))}${resultRow('Keuntungan setelah biaya',rupiah(r.profit))}${resultRow('Margin aktual',percent(r.margin))}</div><button class="btn primary" id="apply-recommended">Terapkan harga ini</button>`}
    <div class="recommend-secondary">${resultRow('Harga target tanpa proteksi',m.offResult.error?'—':rupiah(m.offResult.price))}${resultRow('Harga minimum agar impas',m.breakEven.error?'—':rupiah(m.breakEven.price))}</div><p class="form-note">Dibulatkan ke atas ke Rp1. Premi dihitung ulang pada harga baru.</p>`;
}
function renderPromotions(){
  const results=[0,.05,.1,.15,.2,.25].map(d=>promoCalc(state.margin,d,state.units));const error=results.find(r=>r.error)?.error;showError('promo',error);
  if(error){$('#promo-stats').innerHTML='';$('#promo-table').innerHTML='';return;}
  const m=marginCalc(state.margin);
  $('#promo-stats').innerHTML=`<div class="stat-card"><small>Harga jual sebelum diskon</small><b>${rupiah(state.margin.price)}</b><p>Dari Harga & proteksi</p></div><div class="stat-card"><small>Target keuntungan (%)</small><b>${percent(m.t)}</b><p>Dari harga setelah diskon</p></div><div class="stat-card"><small>Proteksi</small><b>${m.enabled?'ON':'OFF'}</b><p>Premi dihitung ulang untuk setiap diskon.</p></div>`;
  $('#promo-table').innerHTML=results.map(r=>{const good=r.ratio+1e-10>=r.t;return `<tr class="${good?'good':r.after<0?'bad':''}"><td><b>${percent(r.discount)}</b></td><td class="num">${rupiah(r.net)}</td><td class="num">${rupiah(r.sellerPremium)}</td><td class="num">${rupiah(r.after)}</td><td class="num">${percent(r.ratio)}</td><td class="num">${rupiah(r.total)}</td><td><span class="tag ${good?'good':'warn'}">${good?'Tercapai':'Di bawah target'}</span></td></tr>`;}).join('');
}
