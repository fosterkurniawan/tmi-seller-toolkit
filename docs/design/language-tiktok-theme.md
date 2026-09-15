# Indonesia / English and TikTok Shop theme

## Scope

Add a compact native language selector to the header and apply a consistent TikTok Shop-inspired palette across the existing workspace. Keep concise copy, the mission dashboard, existing formulas, and the local storage schema.

## Research — 15 September 2026

- [TikTok Shop official seller site](https://seller.tiktok.com/): inspected the live site and computed CSS. Its design uses black and white surfaces, a red primary CTA, and cyan accents. The site exposes `--brand-black`, `--brand-red`, `--brand-cyan`, and `--brand-white` tokens.
- [Official TikTok Shop logo usage guidance](https://seller-us.tiktok.com/university/essay?knowledge_id=2985859637593869&lang=en): the toolkit keeps its own identity and does not add a TikTok logo or an endorsement claim.
- Implementation adapts the palette for this interface: black `#101014`, dark text `#161823`, red `#ea0046`, cyan `#25f4ee`, dark cyan text `#006568`, and light neutral surfaces. These are application choices, not a claimed official brand specification. Warnings and success results retain meaningful status colors and text.
- Existing 3D artwork was recolored with imagegen to black, white, cyan, and red; the new local asset is `web/assets/seller-tiktok-3d.png`.

## Language behavior

- Indonesian is the default. `tmi-seller-language` stores only the preference, independently from the calculator save key.
- The local dictionary covers all ten menus, calculator fields/help/results/errors, demo dialogs, source descriptions, reply templates, and CSV headings/statuses. No translation service or network request is required.
- `localizeUI()` runs at explicit render boundaries. Original copy is retained in WeakMaps, so language changes preserve the existing form controls, input values, open help, current page, and exploration progress.
- Select options receive stable values before the first translation. Existing saved return statuses remain compatible; internal order IDs are excluded from translation in both the table and CSV.
- Currency remains IDR. Display separators use `id-ID` or `en-US`; CSV numeric values remain raw numbers.
- `html.lang`, accessible names, placeholders, image description, and document title follow the choice. The selector itself always says “Indonesia / English” through native option names.
- Existing Excel workbook remains in Indonesian, explicitly labeled beside the download.

## Verification

- Switched Indonesian → English → Indonesian → English with price 120000 and the price help expanded. Value, open help, and progress remained intact; profit stayed 33710, with localized separators.
- Invalid price 0 produced the English validation message. Restoring the price updated the discount table. Copying the product margin yielded 1,584,259 after ads.
- Added an unsaved return record with ID `Simpan`, issue `Failed delivery`, and status `Resolved`. Switching to Indonesian displayed `Gagal kirim` / `Selesai`; the ID stayed `Simpan`. The English CSV preserved the ID and localized headers/statuses. Reload discarded the unsaved test record.
- English selection survived reload. Formula outputs stayed at the sample values on a fresh unsaved session.
- Inspected both languages at 320px, English at 390/768px, and desktop layout at 1024/1440px. Checked no document overflow at 320/768/1024px and corrected small-screen hero overlap.
- Browser scan found no leftover Indonesian copy among the checked common UI terms in English mode. Source catalog inspection covered static markup; proper names and workbook sheet names remain unchanged.
- Browser error/warning log was empty. Inline engine, locale module, and workspace module pass JavaScript syntax checks. Four calculation functions and embedded workbook are byte-identical to the preceding commit.

This verifies the language/theme change; it does not update or audit the underlying fee assumptions, insurance information, or Excel workbook.
