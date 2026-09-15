# Arsip — Riset Toolkit TikTok Shop

Sumber: https://chatgpt.com/c/6aa50df4-c66c-83ec-b91b-21cab8bfe9ba

Diimpor pada 15 September 2026. Arsip percakapan, bukan verifikasi ulang kebijakan atau tarif. Penanda sitasi internal disalin dari sumber dan tidak selalu dapat dibuka di luar sesi asal.

## Pengguna

mengenai tiktok shop seller dan toolkit yang saya berikan. untuk menghitung HPP dan lain2, apakah saya harus tetap update dengan kebijakan biaya tiktok? tolong cari tau tentang ini. jadi kita harus bikin tools yang benar benar 100% akurat saat testing berkali2. dan apa aja dasarnya untuk hitungan ini. 

please do some research, sertakan sumber biar bisa saya re-check hasil research kamu, dan how we implement to our tiktok seller toolkit

## ChatGPT

Ya — untuk Seller Toolkit yang ingin dipakai serius, **kebijakan biaya TikTok Shop harus dianggap sebagai data yang berubah**, bukan rumus permanen di HTML. Setelah saya cek struktur biaya TikTok Shop by Tokopedia yang berlaku di Indonesia dan dokumentasi resminya, desain kalkulator yang sekarang sebaiknya kita ubah menjadi **versioned fee engine**.

Yang paling penting: **HPP jangan dicampur dengan fee TikTok.** HPP berasal dari bisnis seller. TikTok memengaruhi *cost to sell*, net settlement, margin, BEP, dan suggested selling price.

## 1. Model perhitungan yang seharusnya kita pakai

Secara konsep saya sarankan:

**A. HPP / Product Cost**

```text
HPP per Unit
= Harga Beli / Bahan Baku
+ Packaging
+ Production Cost
+ Direct Labor
+ Inbound Freight
+ biaya langsung lain
```

Ini **seller input**. Tidak berubah ketika TikTok mengubah kebijakan.

Kemudian kita punya:

**B. TikTok Selling Cost**

```text
TikTok Selling Cost
=
Platform Commission
+ Dynamic Commission
+ Order Processing Fee
+ Mall Service Fee (jika applicable)
+ Growth Xtra Fee (jika ikut)
+ Pre-order Fee (jika applicable)
+ Affiliate Commission
+ Seller-funded Discount/Voucher
+ Seller Shipping Contribution
+ Ads Cost Allocation
+ biaya lain yang benar-benar ditanggung seller
```

Dan output utama:

```text
Net Revenue
= Selling Price
- Seller Discount
- TikTok Selling Cost
```

```text
Contribution Profit
= Net Revenue
- HPP
```

```text
Net Margin %
= Contribution Profit / Net Revenue
```

Atau untuk analisis harga:

```text
Profit per Unit
= Settlement to Seller - HPP - Other Seller Costs
```

Ini jauh lebih benar daripada mengatakan:

> HPP = harga barang + biaya TikTok.

---

# 2. Kenapa TikTok fee **harus updateable**

Ini bukan sekadar kemungkinan. Struktur fee TikTok Shop memang sudah beberapa kali berubah.

Contohnya, perubahan 2026 yang saya temukan:

| Komponen | Kondisi / Basis |
|---|---|
| Platform Commission | berbeda berdasarkan sub-category dan seller type |
| Dynamic Commission | berbeda berdasarkan sub-category |
| Dynamic Commission cap | naik menjadi **Rp650.000/item sejak 18 Mei 2026** |
| Order Processing Fee | **Rp1.250/order** yang berhasil dikirim |
| Mall Service Fee | berlaku khusus seller Mall |
| Growth Xtra | optional, rate berdasarkan kategori |
| Pre-order Service Fee | tambahan jika menggunakan pre-order |
| Affiliate Commission | ditentukan oleh seller/program |
| GMV Max / Ads | dapat mengurangi effective platform commission dalam kondisi tertentu |

Perubahan Dynamic Commission per 18 Mei 2026 bahkan bervariasi: beberapa kategori naik 0,5–3%, beberapa tetap, dan ada yang turun sekitar 1%. citeturn853176search5turn853176search9

Dokumen fee yang saya telusuri juga memiliki **1.105 sub-category**, sehingga tidak aman menggunakan satu asumsi seperti:

```text
TikTok Admin Fee = 8%
```

untuk semua seller. citeturn160277view3

Jadi jawabannya:

> **Ya, fee table harus selalu bisa di-update. Tetapi code kalkulatornya tidak perlu terus-menerus diubah.**

Ini distinction penting.

---

# 3. Jangan hard-code `8%`, `10%`, dll.

Misalnya versi toolkit sederhana memiliki:

```javascript
const tiktokFee = 0.08;
```

Saya **tidak recommend**.

Lebih baik sistem membaca konfigurasi seperti:

```text
Marketplace: TikTok Shop by Tokopedia
Country: Indonesia
Seller Type: Marketplace
Category: Food & Beverages
Subcategory: ...
Effective From: 18-May-2026

Platform Commission Rate: X%
Dynamic Commission Rate: Y%
Dynamic Commission Cap: Rp650,000
Order Processing Fee: Rp1,250
Growth Xtra Rate: Z%
Preorder Fee: 3%
Mall Fee: N/A
```

Dengan demikian kalau TikTok mengubah kebijakan:

**tidak perlu rebuild calculator.**

Admin hanya mengganti **Fee Master**.

---

# 4. Ini yang sangat penting: gunakan `Effective Date`

Saya tidak mau toolkit kita sekadar punya:

```text
Current TikTok Fee = 7%
```

Karena begitu kita test transaksi April 2026 menggunakan rule September 2026, hasilnya salah.

Fee master harus seperti ini:

| Rule ID | Effective From | Effective To | Category | Fee |
|---|---:|---:|---|---:|
| DYN-FEE-001 | 13-Feb-26 | 17-May-26 | Category X | old rate |
| DYN-FEE-002 | 18-May-26 | — | Category X | new rate |

Engine menentukan:

```text
Applicable Rule
=
Marketplace
+ Country
+ Seller Type
+ Category/Sub-category
+ Transaction Date
+ Program Participation
+ Order Type
```

Jadi historical calculation tetap reproducible.

Ini penting sekali untuk **testing berkali-kali**.

---

# 5. Current cost components yang harus masuk toolkit

Dari research saya, arsitektur fee kita setidaknya perlu memisahkan komponen berikut.

| Fee | Basis | Mandatory? | Toolkit |
|---|---|---:|---|
| Platform Commission | item price after seller discount × category rate | Yes | Auto |
| Dynamic Commission | item price after seller discount × category rate | Yes | Auto |
| Dynamic Commission Cap | per item | Yes | Auto |
| Order Processing | per successfully delivered order | Yes | Auto |
| Mall Service Fee | seller/payment condition | Mall | Conditional |
| Growth Xtra | category-based | Optional | Toggle |
| Pre-order | product price after seller discount | Conditional | Toggle |
| Affiliate | commissionable sales | Optional | Input/Auto |
| Seller Voucher | seller-funded | Conditional | Input |
| Shipping contribution | actual seller burden | Conditional | Input/API |
| Ads | attribution / allocated ads cost | Optional | Input/API |
| Refund/Return adjustments | actual order status | Conditional | Auto/API |

Current references indicate Order Processing Fee is **Rp1.250 per successfully delivered order**, and importantly is **per order, not per item**. citeturn160277view2

That seemingly small distinction creates a major calculator error.

For example:

```text
Order A:
3 × product X
2 × product Y
```

Processing fee is:

```text
Rp1,250
```

not:

```text
5 × Rp1,250
= Rp6,250
```

---

# 6. Dynamic Commission juga perlu cap logic

Ini juga tidak cukup:

```javascript
dynamicFee = sellingPrice * dynamicRate;
```

Engine perlu:

```text
Dynamic Fee
=
MIN(
  Commission Base × Applicable Dynamic Rate,
  Applicable Fee Cap
)
```

Referensi terbaru yang saya temukan menunjukkan batas maksimum Dynamic Commission berubah dari **Rp40.000/item** menjadi **Rp650.000/item sejak 18 Mei 2026**. citeturn853176search0

Bayangkan seller menjual produk Rp15 juta.

Kalau calculator kita masih menggunakan cap lama:

```text
Dynamic Fee = Rp40.000
```

padahal cap yang applicable sudah Rp650.000,

margin recommendation bisa meleset ratusan ribu rupiah per produk.

---

# 7. Growth Xtra jangan disederhanakan sebagai "additional TikTok fee"

Ini bagian yang cukup tricky.

Program Growth Xtra mempunyai **dua dampak sekaligus**:

seller dapat membayar Growth Xtra fee,

tetapi keikutsertaannya juga dapat menghasilkan **platform commission savings**.

Referensi yang saya cek mencatat Growth Xtra sekitar **2–4% tergantung kategori** dan mekanisme commission saving-nya terpisah. citeturn160277view4

Artinya calculator tidak boleh:

```text
TikTok Fee
= Base Commission
+ Growth Xtra 4%
```

lalu selesai.

Harus:

```text
Gross Platform Commission
- Applicable Commission Saving
+ Growth Xtra Program Fee
```

Baru didapat:

```text
Effective Marketplace Cost
```

Ini salah satu alasan saya tidak menyarankan kalkulator marketplace menggunakan satu field:

**“TikTok Admin Fee %”**

karena secara matematis tidak lagi cukup.

---

# 8. Affiliate juga harus dipisahkan

TikTok sendiri menjelaskan bahwa seller/brand dapat berkolaborasi dengan creator dan creator memperoleh commission dari produk yang terjual. citeturn389426search18

Di toolkit kita berarti harus ada:

```text
Use Affiliate?
[Yes / No]

Affiliate Commission
[     ] %
```

Dan jangan masukkan default tertentu sebagai fee wajib.

Misalnya:

```text
Selling price         Rp100,000
Affiliate             10%

Affiliate cost        Rp10,000
```

Tetapi jika order organic:

```text
Affiliate cost = Rp0
```

Jadi toolkit harus mampu menghitung scenario:

**Organic / Affiliate / LIVE / Ads-assisted**

secara berbeda.

---

# 9. Seller-funded discount juga memengaruhi calculation base

Ini juga sering menyebabkan seller calculator salah.

Platform commission dan beberapa fee tidak selalu dihitung terhadap:

```text
List Price
```

Tetapi terhadap base seperti:

```text
Item Price − Seller Discount
```

Karena itu input kita harus memisahkan:

```text
Original Price
Seller Discount
Platform Discount
Seller Voucher
Platform Voucher
```

Jangan hanya:

```text
Selling Price = Rp100,000
Discount = Rp10,000
```

karena **siapa yang mendanai discount** menentukan economics seller.

---

# 10. Cara membuat hasil mendekati 100% akurat

Ada perbedaan besar antara:

### Calculator Mode

menggunakan rule:

```text
Selling price
× rate
+ fixed fees
```

dan:

### Reconciliation Mode

menggunakan **actual TikTok settlement transaction**.

Untuk toolkit resmi yang kalian presentasikan, saya akan buat **dua layer**.

**Layer 1 — Forecast Calculator**

Digunakan sebelum seller menjual:

```text
HPP
→ Pricing
→ Estimated TikTok Fees
→ Profit
→ Margin
→ BEP
→ Suggested Selling Price
```

**Layer 2 — Actual Profit Checker**

Setelah transaksi:

```text
Actual TikTok Settlement
→ Actual Fee
→ Actual Shipping
→ Actual Discount
→ Actual Refund
→ HPP
→ Realized Profit
```

Dan di sini kita punya keuntungan besar:

TikTok menyediakan Finance API resmi.

Endpoint resminya dapat mengambil SKU-level transactions yang mencakup **sales, fees, commissions, shipping, taxes, refunds**, serta settlement amount. API ini dinyatakan applicable untuk sellers di seluruh region pada versi terkini. citeturn185305search0turn185305search5

Jadi kalau toolkit nantinya menjadi aplikasi sungguhan:

> **Actual settlement TikTok adalah source of truth.**

Bukan hasil formula kita.

---

# 11. Ini bahkan memungkinkan automatic reconciliation

TikTok Finance API menyediakan scope:

```text
seller.finance.info
```

dan API-nya memang ditujukan untuk mendapatkan transaction/settlement information dan melakukan reconciliation settlement seller terhadap order. citeturn185305search8turn185305search13

Contoh informasi yang bisa diperoleh:

```text
Order ID
Revenue Amount
Seller Discount
Fees & Taxes
Shipping Costs
Refunds
Settlement Amount
SKU transaction
```

Sehingga toolkit advanced kita bisa menunjukkan:

```text
Estimated Profit
Rp27,350

Actual Profit
Rp27,125

Difference
-Rp225

Reason
Shipping adjustment
```

Ini level akurasi yang menurut saya layak untuk tool TikTok Seller yang benar-benar profesional.

---

# 12. Saya akan tambahkan `Fee Policy Version`

Di bagian kecil hasil kalkulator:

```text
TikTok Shop Fee Policy
Indonesia · Marketplace Seller

Policy version:
18 May 2026

Fee data last reviewed:
12 Sep 2026
```

Dan button/info:

```text
View calculation basis
```

Klik kemudian:

```text
Platform commission    Rp xxx
Dynamic commission     Rp xxx
Processing fee         Rp1,250
Affiliate              Rp xxx
Growth Xtra             Rp xxx
Seller discount        Rp xxx
--------------------------------
Total TikTok cost       Rp xxx
```

Seller jadi bisa **audit calculator kita**, bukan hanya percaya angka hasil.

---

# 13. Saya juga recommend Confidence Status

Contohnya:

```text
Calculation Accuracy
● VERIFIED

Fee Policy: Current
Category: Exact Match
Seller Type: Confirmed
Growth Xtra: Confirmed
Affiliate: Confirmed
```

atau:

```text
⚠ ESTIMATE

Your exact TikTok product
subcategory has not been selected.
```

Ini jauh lebih aman daripada menampilkan angka seperti:

> Profit = Rp37.125

seolah-olah exact padahal kategori produk belum diketahui.

---

# 14. Untuk testing, jangan cuma test satu produk

Kita perlu membuat regression test untuk fee engine.

Minimal cases-nya:

| Test | Scenario | Expected |
|---|---|---|
| T01 | Normal Marketplace seller | correct base fees |
| T02 | Mall seller | add Mall fee |
| T03 | Multiple items 1 order | processing Rp1.250 once |
| T04 | High-price item | commission cap applied |
| T05 | Seller discount | correct commission base |
| T06 | Platform discount | not treated as seller cost |
| T07 | Affiliate order | affiliate fee |
| T08 | Organic order | no affiliate fee |
| T09 | Growth Xtra | program fee + commission saving |
| T10 | Pre-order | pre-order fee |
| T11 | Refund | correct adjustment |
| T12 | Historical transaction | historical fee policy |
| T13 | Policy effective date boundary | old/new rules correct |
| T14 | Different subcategories | exact category rates |
| T15 | Actual settlement | calculator vs Finance API |

Dan saya ingin satu golden rule:

```text
Expected TikTok Settlement
=
Toolkit Calculated Settlement
```

dengan tolerance:

```text
Rp0
```

untuk deterministic rule cases.

Kalau actual TikTok memberikan adjustment yang hanya diketahui setelah settlement, toolkit harus menandainya sebagai:

```text
Platform Adjustment
```

bukan mengubah formula diam-diam.

---

# 15. Tentang klaim “100% accurate”

Saya akan sedikit mengubah wording produk kita.

Jangan mengatakan:

> **100% accurate TikTok Fee Calculator**

karena ada promo, seller eligibility, affiliate settings, seller-specific ads, refund, platform incentives, dan perubahan kebijakan yang dapat membuat input berbeda.

Saya lebih nyaman dengan:

> **Calculated using the latest verified TikTok Shop fee policy and your seller settings.**

Dan untuk transaksi aktual:

> **Reconciled against TikTok Shop settlement data.**

Yang kedua bisa benar-benar sangat dekat dengan accounting-grade accuracy.

---

# 16. Source hierarchy yang saya sarankan

Untuk menjaga tool ini ke depan, sumbernya jangan random blog.

Urutannya:

**TikTok Shop / Tokopedia Seller Center policy → TikTok Shop Open Platform API → official fee calculator/file → regulatory source → secondary source untuk cross-check.**

TikTok Shop Academy sendiri memang menyediakan **Policy Center** untuk seller dan meminta seller mengecek kebijakan/pengumuman terbaru di sana. citeturn389426search2turn389426search3

TikTok juga secara eksplisit mempertahankan hak untuk mengubah layanan dan komponen tertentu dari platformnya, sehingga desain yang configurable jauh lebih sustainable daripada angka hard-coded. citeturn389426search11

---

# 17. Sumber yang bisa Anda re-check

Untuk dokumentasi resmi API, ini yang paling berguna:

[TikTok Shop Open Platform — Get Transactions by Order](https://partner.tiktokshop.com/docv2/page/get-transactions-by-order?utm_source=chatgpt.com)

Dokumen ini sangat penting karena menjelaskan bahwa transaksi order mencakup sales, fees, commissions, shipping, taxes dan refunds. citeturn185305search0

[TikTok Shop Open Platform — Finance API scope](https://partner.tiktokshop.com/docv2/page/access-scope?utm_source=chatgpt.com)

Finance Information memang ditujukan untuk mendapatkan settlement dan melakukan reconciliation. citeturn185305search8

[TikTok Shop Open Platform — Product Pricing](https://partner.tiktokshop.com/docv2/page/product-pricing?utm_source=chatgpt.com)

Untuk Indonesia, harga SKU menggunakan IDR tanpa decimal; dokumen resmi juga memberikan batas pricing TikTok Shop. citeturn389426search0

Untuk kebijakan seller Indonesia:

[Tokopedia Seller Center — Biaya Komisi Platform](https://seller-id.tokopedia.com/university/essay?knowledge_id=5411650459305729&utm_source=chatgpt.com)

[Tokopedia Seller Center — Pengenalan Biaya Penjual](https://seller-id.tokopedia.com/university/essay?knowledge_id=7753828090824449&utm_source=chatgpt.com)

[Tokopedia Seller Center — Biaya Komisi Dinamis](https://seller-id.tokopedia.com/university/essay?knowledge_id=6385751723132688&utm_source=chatgpt.com)

[Tokopedia Seller Center — Biaya Pemrosesan Order](https://seller-id.tokopedia.com/university/essay?knowledge_id=2767365667784464&utm_source=chatgpt.com)

Sebagian halaman Seller Center tersebut tidak dapat dirender oleh web crawler tanpa session/JavaScript, tetapi link resminya bisa Anda buka langsung dengan akun seller. Cross-check terstruktur yang saya gunakan mencatat sumber tersebut beserta tanggal kebijakannya. citeturn160277view1turn160277view2

Ada juga perubahan regulasi yang perlu kita perhatikan: sejak **17 Juni 2026**, Permen UMKM No. 3 Tahun 2026 mengatur perlindungan UMK di marketplace, termasuk kewajiban pemberitahuan perubahan biaya layanan paling lambat 90 hari kalender sebelumnya. citeturn853176search10

---

# Jadi bagaimana kita implement ke **TikTok Seller Toolkit kita?**

Menurut saya kita **rebuild calculation engine-nya, bukan redesign tampilannya**.

Flow yang tadi Anda sudah minta tetap bisa sama:

```text
PAGE 1
Seller Information
↓
Email
Product information
HPP inputs
TikTok seller configuration
↓
NEXT

PAGE 2
Seller Toolkit
↓
HPP
Pricing recommendation
TikTok fee breakdown
Net settlement
Profit
Margin
BEP
Campaign/Affiliate scenario
What-if simulation
```

Tetapi di belakangnya sekarang menjadi:

```text
USER INPUT
      ↓
HPP ENGINE
      ↓
TIKTOK FEE RULE ENGINE
      ↓
DISCOUNT / AFFILIATE / ADS ENGINE
      ↓
SETTLEMENT ENGINE
      ↓
PROFIT & MARGIN ENGINE
      ↓
RECOMMENDATION ENGINE
```

Dan **TikTok Fee Rule Engine** memakai:

```text
Fee Master
+ Effective Date
+ Category/Subcategory
+ Seller Type
+ Program
+ Channel
+ Commission Cap
```

bukan angka hard-code.

### Kesimpulan saya

**Ya, kita perlu maintain TikTok policy**, tetapi **tidak perlu terus edit source code**. Toolkit yang benar adalah calculator dengan **versioned configurable fee master**.

Lebih jauh lagi, jika project ini nantinya benar-benar diluncurkan ke seller, saya sangat menyarankan fase berikutnya menggunakan **TikTok Finance API** sehingga kita punya dua fungsi sekaligus:

**Estimate Before Selling → Reconcile After Selling.**

Itu yang akan membuat Seller Toolkit yang sedang kita buat jauh lebih kredibel daripada kalkulator HPP/marketplace biasa—karena seller bukan cuma diberi angka “seharusnya untung berapa”, tetapi juga bisa tahu **“setelah TikTok benar-benar memotong semua biaya, saya sebenarnya untung berapa.”**

## Pengguna

dan menurut kamu untuk tiktok shop seller toolkit, kita bisa langsung input harga insurance yang juga dimasukin ke dalam perhitungannya kan? biar mereka udh bisa liat juga harganya itu berapa

## ChatGPT

Bisa, dan justru **lebih bagus kalau insurance premium langsung masuk ke kalkulasi seller toolkit**. Tapi saya sarankan jangan diperlakukan sebagai bagian dari HPP. Insurance sebaiknya jadi **separate selling cost / protection cost**, supaya seller bisa melihat dengan transparan berapa biaya proteksinya dan bagaimana dampaknya ke margin.

Struktur sederhananya seperti ini:

```text
Product Cost / HPP
+ TikTok Selling Fees
+ Affiliate / Ads / Promo Cost
+ Insurance Premium
= Total Selling Cost
```

Lalu:

```text
Net Profit
= Net Settlement
- HPP
- Insurance Premium
- Other Seller Costs
```

Jadi di toolkit kita seller bisa langsung lihat:

```text
Harga Jual                 Rp100.000
HPP                        Rp55.000
TikTok Fees                Rp8.750
Affiliate                  Rp5.000
Insurance                  Rp1.200
------------------------------------
Estimasi Profit            Rp30.050
Margin                     30,05%
```

Menurut saya ini jauh lebih powerful karena seller jadi tidak melihat insurance sebagai “tambahan biaya yang tidak jelas”, tetapi sebagai komponen economics yang sudah dihitung dari awal.

Yang perlu kita tentukan adalah **siapa yang membayar insurance-nya**. Ada beberapa model yang bisa kita dukung:

1. **Seller-funded insurance**  
   Premium dipotong dari margin seller.

2. **Buyer-paid insurance**  
   Insurance muncul sebagai biaya tambahan ke buyer, jadi tidak mengurangi margin seller.

3. **Included in selling price**  
   Seller menaikkan harga jual agar premium tetap ter-cover.

4. **Subsidized / campaign-funded**  
   Sebagian premium ditanggung seller, TikTok/partner, atau insurer.

Untuk toolkit, saya sarankan ada toggle sederhana:

```text
Insurance Protection
[✓] Include Insurance

Premium Rate     1.20%
Minimum Premium  Rp1.000
Maximum Premium  Rp10.000

Paid By
(•) Seller
( ) Buyer
( ) Shared
```

Kalau produk insurance-nya menggunakan tier atau fixed premium, engine juga bisa langsung menghitung:

```text
Product Value
Rp700.000

Insurance Plan
TikTok Shop Product Protection

Coverage
Loss / Damage / Return Protection

Premium
Rp7.500

Coverage Limit
Rp700.000
```

Kemudian toolkit menunjukkan impact:

```text
Without Insurance
Profit       Rp123.500
Margin       17,64%

With Insurance
Profit       Rp116.000
Margin       16,57%

Protection Cost
Rp7.500
```

Ini menurut saya penting karena seller bisa langsung menjawab pertanyaan:

> “Kalau saya kasih insurance ke customer, margin saya turun berapa?”

dan bahkan:

> “Saya harus jual di harga berapa supaya margin saya tetap 20% setelah insurance?”

Kita bisa buat calculation reverse:

```text
Target Margin          20%
HPP                    Rp55.000
TikTok fees            estimated
Insurance              Rp1.200

Recommended Selling Price
Rp89.900
```

Jadi **insurance bukan hanya ditampilkan**, tetapi ikut mempengaruhi recommended selling price.

Untuk toolkit TikTok seller kita, saya malah akan membuat output akhirnya menjadi tiga perspektif:

```text
SELLING PRICE
Rp100.000

MARKETPLACE COST
Rp13.750

PROTECTION COST
Rp1.200

PRODUCT COST
Rp55.000

NET PROFIT
Rp30.050
```

Kemudian seller bisa klik **“Why this amount?”** untuk melihat breakdown.

Satu catatan penting: kalau insurance premium berasal dari produk insurance Tokio Marine/TMI, rate-nya jangan hard-code juga. Sama seperti TikTok fee, sebaiknya dibuat **Insurance Product Master**, misalnya:

```text
Insurance Product Master

Product         : Seller Protection
Coverage        : Damage / Loss
Premium Type    : Rate
Rate            : 1.20%
Minimum Premium : Rp1.000
Maximum Premium : Rp10.000
Effective From  : 01-Sep-2026
```

Sehingga kalau pricing insurance berubah, kita cukup update product master, bukan source code toolkit.

Untuk desain toolkit kita, saya sarankan nanti alurnya:

```text
Product & Seller Data
        ↓
HPP Calculation
        ↓
TikTok Fees
        ↓
Insurance Protection
        ↓
Target Margin
        ↓
Recommended Selling Price
        ↓
Profit Simulation
```

Dan seller bisa toggle:

```text
Insurance OFF
Recommended Price Rp97.900
Profit Rp30.300

Insurance ON
Recommended Price Rp99.900
Profit Rp30.500
```

Ini malah bisa menjadi **selling point utama toolkit**: bukan hanya kalkulator HPP TikTok, tetapi **pricing + marketplace fee + protection + profitability simulator** dalam satu tempat.


