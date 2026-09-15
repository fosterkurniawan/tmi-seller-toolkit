// Navigation and guidance for the existing calculators. Amounts stay in the original engine.
let savedSnapshot = null;
let hasSaved = false;
let roasSnapshot = null;
try {
  hasSaved = Boolean(localStorage.getItem(STORE));
  if (hasSaved) savedSnapshot = JSON.stringify(state);
} catch (_) { /* Storage is optional. */ }

const pageGroups = {
  home: 'Ruang kerja', margin: 'Rencana jualan', promo: 'Rencana jualan', roas: 'Rencana jualan',
  stock: 'Operasional toko', returns: 'Operasional toko', templates: 'Panduan & unduhan',
  webinar: 'Panduan & unduhan', protection: 'Panduan & unduhan', sources: 'Panduan & unduhan'
};
const fieldHelp = {
  price: 'Harga satu item sebelum potongan dari seller.',
  discount: 'Diskon yang kamu tanggung, bukan subsidi platform.',
  cogs: 'Biaya membeli atau membuat satu produk.',
  fixed: 'Biaya per order ÷ jumlah item dalam order. Contoh: Rp1.250 ÷ 5 = Rp250 per item.',
  admin: 'Tarif efektif sesuai tokomu. Angka awal hanya contoh.',
  affiliate: 'Isi 0 jika penjualan tidak memakai affiliate.',
  ads: 'Total biaya iklan ÷ item terkait iklan. Ini estimasi alokasi per produk.',
  target: 'Persentase keuntungan dari harga setelah diskon, setelah biaya yang diinput.',
  revenue: 'Gunakan pendapatan yang terkait iklan, bukan seluruh omzet toko.',
  spend: 'Biaya iklan untuk periode yang sama dengan pendapatan.',
  margin: 'Persentase keuntungan setelah biaya produk, tetapi sebelum biaya iklan.',
  lead: 'Lama menunggu dari pesan ke pemasok sampai stok tersedia.',
  buffer: 'Jumlah hari penjualan tambahan sebagai cadangan.',
  review: 'Berapa hari sekali kamu mengevaluasi persediaan.',
  allocated: 'Stok yang sudah dipesan pembeli dan belum dikirim.',
  inbound: 'Jumlah unit yang sedang dikirim pemasok.'
};

function fieldMarkup(page, [key, label, unit]) {
  const help = fieldHelp[key];
  return `<label class="field ${page === 'roas' && key === 'margin' ? 'full' : ''}">
    <span>${label}</span><span class="input-wrap ${unit !== 'Rp' ? 'suffix' : ''}">
    ${unit === 'Rp' ? '<b aria-hidden="true">Rp</b>' : ''}
    <input id="${page}-${key}" data-group="${page}" data-key="${key}" type="number" min="0"
      max="${unit === '%' ? 100 : 1000000000000}" step="${unit === '%' || key === 'daily' ? 'any' : 1}"
      value="${state[page][key]}" required aria-label="${label}" ${help ? `aria-describedby="help-${page}-${key}"` : ''}>
    ${unit !== 'Rp' ? `<b aria-hidden="true">${unit}</b>` : ''}</span>
    ${help ? `<small id="help-${page}-${key}">${help}</small>` : ''}</label>`;
}

function renderFields() {
  const groups = [
    ['Harga produk', 'Harga dan diskon yang akan kamu tawarkan.', ['price', 'discount']],
    ['Modal & operasional', 'Biaya rupiah untuk setiap item yang terjual.', ['cogs', 'pack', 'ship', 'other']],
    ['Biaya penjualan', 'Isi berdasarkan biaya yang benar-benar ditanggung tokomu.', ['fixed', 'admin', 'affiliate', 'service', 'ads']],
    ['Target keuntungan', 'Tentukan margin yang ingin kamu sisakan.', ['target']]
  ];
  $('#margin-form').innerHTML = groups.map(([title, desc, keys], index) =>
    `<fieldset class="input-section"><legend><span>${index + 1}</span>${title}</legend>
    <p>${desc}</p><div class="form-grid">${keys.map(key => fieldMarkup('margin', specs.margin.find(f => f[0] === key))).join('')}</div></fieldset>`
  ).join('');
  for (const page of ['roas', 'stock']) $('#'+page+'-form').innerHTML = specs[page].map(f => fieldMarkup(page, f)).join('');
  $('#promo-units').value = state.units;
}

function refreshWorkspace() {
  const serialized = JSON.stringify(state);
  const changed = hasSaved ? serialized !== savedSnapshot : serialized !== JSON.stringify(DEFAULTS);
  const status = changed ? 'Perubahan belum disimpan' : hasSaved ? 'Tersimpan di perangkat' : 'Angka contoh · belum disimpan';
  $('#save-status').textContent = status;
  $('#save-status').classList.toggle('unsaved', changed);
  const m = marginCalc(state.margin);
  $('#margin-peek').innerHTML = m.error
    ? '<span>Periksa input harga & biaya</span>'
    : `<span>Keuntungan / item <b>${rupiah(m.after)}</b></span><a href="#margin-result">Lihat rincian ↓</a>`;
  $('#home-summary').innerHTML = m.error
    ? `<span class="badge gray">${status}</span><h3>Periksa angka produkmu</h3><p>${m.error}</p><button class="btn ghost" data-page="margin">Perbaiki input</button>`
    : `<span class="badge gray">${hasSaved || changed ? 'Hitungan produk saat ini' : 'Contoh hitungan · bisa diubah'}</span>
       <p>Keuntungan per item setelah biaya</p><strong>${rupiah(m.after)}</strong>
       <span>${percent(m.ratio)} dari harga setelah diskon</span>
       <div class="summary-detail"><span>Harga setelah diskon</span><b>${rupiah(m.net)}</b></div>
       <small>Belum termasuk pajak atau overhead yang tidak kamu input.</small>`;
  $('#promo-origin').textContent = m.error ? 'Input harga atau biaya belum valid. Perbaiki di langkah 1 sebelum membandingkan diskon.'
    : `Harga awal ${rupiah(state.margin.price)} / item · modal produk ${rupiah(state.margin.cogs)} · target margin ${percent(m.t)}.`;
  const ratio = m.error ? NaN : m.before / m.net * 100;
  const canUse = Number.isFinite(ratio) && ratio > 0 && ratio <= 100;
  $('#roas-origin').textContent = canUse
    ? `Dari hitungan produkmu: margin sebelum iklan ${number(ratio, 2)}% pada harga setelah diskon ${rupiah(m.net)}.`
    : 'Margin produk belum bisa dipakai: periksa input dan pastikan keuntungan sebelum iklan lebih besar dari nol.';
  $('#use-product-margin').disabled = !canUse;
  const stale = roasSnapshot && roasSnapshot !== JSON.stringify(state.margin);
  $('#roas-source-status').textContent = roasSnapshot
    ? stale ? 'Harga atau biaya produk berubah. Klik “Gunakan margin produk” lagi untuk memperbarui.' : 'Menggunakan salinan margin produk. Perubahan berikutnya tidak diterapkan otomatis.'
    : 'Margin iklan diisi terpisah. Kamu bisa mengetiknya sendiri atau memakai angka produk di atas.';
  $('#roas-source-status').classList.toggle('stale', Boolean(stale));
}

function setMenu(open, returnFocus = false) {
  $('#sidebar').classList.toggle('open', open);
  $('#overlay').classList.toggle('open', open);
  $('#menu').setAttribute('aria-expanded', String(open));
  $('#menu').setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  if (open) requestAnimationFrame(() => $('#sidebar .nav-btn[aria-current="page"]')?.focus());
  else if (returnFocus) $('#menu').focus();
}

function navigate(page, push = true, focus = true) {
  if (!LABELS[page]) page = 'home';
  current = page;
  $$('.page').forEach(el => el.classList.toggle('active', el.id === 'page-' + page));
  $$('.nav-btn, .journey-step').forEach(el => {
    const selected = el.dataset.page === page;
    el.classList.toggle('active', selected);
    if (selected) el.setAttribute('aria-current', 'page');
    else el.removeAttribute('aria-current');
  });
  $('#crumb').textContent = LABELS[page];
  $('#crumb-group').textContent = pageGroups[page];
  document.title = LABELS[page] + ' — TMI Seller Toolkit';
  if (push && location.hash !== '#' + page) history.pushState(null, '', '#' + page);
  setMenu(false);
  if (focus) {
    const heading = $('#page-'+page+' h1');
    heading.setAttribute('tabindex', '-1');
    heading.focus({preventScroll: true});
  }
  window.scrollTo({top: 0, behavior: 'instant'});
}

function addJourney() {
  for (const [page, title] of Object.entries(LABELS)) $('#page-'+page).setAttribute('aria-label', title);
  for (const page of ['margin', 'promo', 'roas']) {
    const nav = document.createElement('nav');
    nav.className = 'journey-nav';
    nav.setAttribute('aria-label', 'Langkah rencana jualan');
    nav.innerHTML = ['margin', 'promo', 'roas'].map((key, i) =>
      `<button class="journey-step" data-page="${key}"><span>${i + 1}</span>${LABELS[key]}</button>`).join('');
    $('#page-'+page).prepend(nav);
  }
  const peek = document.createElement('div');
  peek.id = 'margin-peek';
  peek.className = 'margin-peek';
  $('#page-margin .calc-layout').before(peek);
  const next = {
    margin: ['Lanjutkan dengan biaya produk ini', 'Bandingkan beberapa diskon tanpa mengisi ulang modal dan biaya.', 'promo', 'Lanjut ke simulasi diskon'],
    promo: ['Sudah tahu batas diskonmu?', 'Cek biaya iklan berikutnya. Untuk menilai satu diskon tertentu, ubah diskon produk di langkah 1 terlebih dahulu.', 'roas', 'Lanjut ke biaya iklan'],
    roas: ['Siapkan produk yang akan dijual', 'Cek persediaan menggunakan penjualan harian dan waktu tunggu restock.', 'stock', 'Buka rencana stok'],
    stock: ['Simpan hasil untuk persiapan jualan', 'Unduh hitungan stokmu atau lanjutkan di template Excel.', 'templates', 'Buka hasil & template'],
    returns: ['Pelajari risiko yang relevan', 'Kenali produk proteksi dan batasannya. Catatan retur bukan pengajuan klaim.', 'protection', 'Kenali proteksi']
  };
  for (const [page, [title, desc, dest, label]] of Object.entries(next)) {
    const section = document.createElement('div');
    section.className = 'next-action';
    section.innerHTML = `<div><h2>${title}</h2><p>${desc}</p></div><button class="btn primary" data-page="${dest}">${label} <span aria-hidden="true">→</span></button>`;
    $('#page-'+page).append(section);
  }
}

$('#use-product-margin').addEventListener('click', () => {
  const m = marginCalc(state.margin);
  if (m.error || m.before <= 0) return;
  state.roas.margin = m.before / m.net * 100;
  roasSnapshot = JSON.stringify(state.margin);
  $('#roas-margin').value = state.roas.margin;
  recalc();
  toast('Margin sebelum iklan disalin. Lengkapi pendapatan dan biaya untuk periode iklanmu.');
});
$('#close-menu').addEventListener('click', () => setMenu(false, true));
document.addEventListener('keydown', e => {
  if (!$('#sidebar').classList.contains('open')) return;
  if (e.key === 'Escape') { e.preventDefault(); setMenu(false, true); }
  if (e.key === 'Tab') {
    const items = $$('#sidebar a, #sidebar button');
    const first = items[0], last = items[items.length - 1];
    if (!$('#sidebar').contains(document.activeElement)) { e.preventDefault(); first.focus(); return; }
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
// Section anchors within the returns page are not application routes.
document.addEventListener('click', e => {
  const link = e.target.closest('.local-links a, #margin-peek a, .skip-link');
  if (!link) return;
  e.preventDefault();
  const target = $(link.getAttribute('href'));
  target.setAttribute('tabindex', '-1');
  target.focus({preventScroll: true});
  target.scrollIntoView({behavior: 'smooth', block: 'start'});
});
window.addEventListener('popstate', () => navigate(location.hash.slice(1), false));
window.matchMedia('(min-width: 881px)').addEventListener('change', e => {
  if (e.matches) setMenu(false);
});
window.addEventListener('hashchange', () => {
  if (LABELS[location.hash.slice(1)]) navigate(location.hash.slice(1), false);
});
addJourney();
renderFields();
recalc();
if (!LABELS[location.hash.slice(1)]) history.replaceState(null, '', '#home');
navigate(location.hash.slice(1), false, false);
