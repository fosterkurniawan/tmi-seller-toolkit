// Navigation and guidance for the existing calculators. Amounts stay in the original engine.
let savedSnapshot = null;
let hasSaved = false;
let roasSnapshot = null;
const exploredTools = new Set();
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
  return `<div class="field ${page === 'roas' && key === 'margin' ? 'full' : ''}">
    <label class="field-name" for="${page}-${key}">${label}</label>
    <span class="input-wrap ${unit !== 'Rp' ? 'suffix' : ''}">
    ${unit === 'Rp' ? '<b aria-hidden="true">Rp</b>' : ''}
    <input id="${page}-${key}" data-group="${page}" data-key="${key}" type="number" min="0"
      max="${unit === '%' ? 100 : 1000000000000}" step="${unit === '%' || key === 'daily' ? 'any' : 1}"
      value="${state[page][key]}" required aria-label="${label}" ${help ? `aria-describedby="help-${page}-${key}"` : ''}>
    ${unit !== 'Rp' ? `<b aria-hidden="true">${unit}</b>` : ''}</span>
    ${help ? `<details class="field-hint"><summary aria-label="Info ${label}">?</summary><small id="help-${page}-${key}">${help}</small></details>` : ''}</div>`;
}

function renderFields() {
  const groups = [
    ['Harga produk', ['price', 'discount']],
    ['Modal & operasional', ['cogs', 'pack', 'ship', 'other']],
    ['Biaya penjualan', ['fixed', 'admin', 'affiliate', 'service', 'ads']],
    ['Target keuntungan', ['target']]
  ];
  $('#margin-form').innerHTML = groups.map(([title, keys], index) =>
    `<fieldset class="input-section"><legend><span>${index + 1}</span>${title}</legend>
    <div class="form-grid">${keys.map(key => fieldMarkup('margin', specs.margin.find(f => f[0] === key))).join('')}</div></fieldset>`
  ).join('');
  for (const page of ['roas', 'stock']) $('#'+page+'-form').innerHTML = specs[page].map(f => fieldMarkup(page, f)).join('');
  $('#promo-units').value = state.units;
}

function refreshWorkspace() {
  const serialized = JSON.stringify(state);
  const changed = hasSaved ? serialized !== savedSnapshot : serialized !== JSON.stringify(DEFAULTS);
  const status = changed ? 'Belum disimpan' : hasSaved ? 'Tersimpan' : 'Angka contoh';
  $('#save-status').textContent = status;
  $('#save-status').classList.toggle('unsaved', changed);
  const m = marginCalc(state.margin);
  $('#margin-peek').innerHTML = m.error
    ? '<span>Periksa input harga & biaya</span>'
    : `<span>Keuntungan / item <b>${rupiah(m.after)}</b></span><a href="#margin-result">Lihat rincian ↓</a>`;
  $('#home-summary').innerHTML = m.error
    ? `<span class="summary-orb" aria-hidden="true">!</span><div><b>Periksa angka produkmu</b><small>${m.error}</small></div><button class="btn ghost" data-page="margin">Perbaiki</button>`
    : `<span class="summary-orb" aria-hidden="true">↗</span><div class="summary-profit"><small>Keuntungan / item <span class="badge gray">${hasSaved || changed ? 'Inputmu' : 'Contoh'}</span></small><strong>${rupiah(m.after)}</strong></div>
       <div class="summary-margin"><small>Margin</small><b>${percent(m.ratio)}</b></div>
       <button class="summary-link" data-page="margin" aria-label="Lihat rincian keuntungan">Rincian ↗</button>`;
  $('#promo-origin').textContent = m.error ? 'Periksa harga & biaya di langkah 1.'
    : `Harga ${rupiah(state.margin.price)} · HPP ${rupiah(state.margin.cogs)} · target ${percent(m.t)}`;
  const ratio = m.error ? NaN : m.before / m.net * 100;
  const canUse = Number.isFinite(ratio) && ratio > 0 && ratio <= 100;
  $('#roas-origin').textContent = canUse
    ? `Margin produk sebelum iklan: ${number(ratio, 2)}%`
    : 'Margin produk harus positif. Periksa harga & biaya.';
  $('#use-product-margin').disabled = !canUse;
  const stale = roasSnapshot && roasSnapshot !== JSON.stringify(state.margin);
  $('#roas-source-status').textContent = roasSnapshot
    ? stale ? 'Biaya berubah. Salin ulang margin produk.' : 'Margin disalin. Perubahan produk tidak otomatis diterapkan.'
    : 'Isi manual atau salin dari produk.';
  $('#roas-source-status').classList.toggle('stale', Boolean(stale));
}

function updateExploration() {
  $('#quest-count').textContent = `${exploredTools.size}/3 alat dijelajahi`;
  $('#quest-progress').value = exploredTools.size;
  $$('.journey-card').forEach(card => {
    const seen = exploredTools.has(card.dataset.page);
    card.classList.toggle('explored', seen);
    card.querySelector('.mission-action').textContent = seen ? 'Buka lagi' : 'Mulai';
    card.querySelector('.step-number').textContent = seen ? '✓' : String(['margin','promo','roas'].indexOf(card.dataset.page)+1).padStart(2, '0');
    card.querySelector('.step-number').setAttribute('aria-label', seen ? 'Sudah dibuka' : 'Langkah '+card.querySelector('.step-number').textContent);
  });
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
  if (['margin', 'promo', 'roas'].includes(page)) exploredTools.add(page);
  updateExploration();
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
    margin: ['Lanjut ke diskon?', '', 'promo', 'Simulasikan →'],
    promo: ['Sekarang, cek iklannya.', 'Ubah diskon di langkah 1 untuk memakainya di hitungan iklan.', 'roas', 'Cek iklan →'],
    roas: ['Siapkan stoknya.', '', 'stock', 'Cek stok →'],
    stock: ['Bawa hasilmu.', '', 'templates', 'Unduh hasil →'],
    returns: ['Kenali pilihan proteksi.', 'Catatan retur bukan pengajuan klaim.', 'protection', 'Pelajari →']
  };
  for (const [page, [title, desc, dest, label]] of Object.entries(next)) {
    const section = document.createElement('div');
    section.className = 'next-action';
    section.innerHTML = `<div><h2>${title}</h2>${desc ? `<p>${desc}</p>` : ''}</div><button class="btn primary" data-page="${dest}">${label}</button>`;
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
