# Mobile and device layouts

Implemented 16 September 2026.

## Experience

- Up to 880px: a fixed bottom navigation provides Home, Selling, Store, and Menu. Selling groups pricing, discounts, and ads; Store groups stock and returns. Current sections remain highlighted.
- Stock and returns have contextual tabs so their relationship is visible without reopening the menu.
- Up to 600px: discount and return tables become vertically readable cards. The cards reuse the rendered calculator rows; no parallel calculation formulas are introduced. Desktop and print retain tables.
- Touch targets for inputs, help, language, save, and navigation are enlarged. Number inputs request numeric/decimal keyboards. Focused text/number inputs hide the bottom navigation to leave space for the keyboard.
- The drawer locks background scrolling, makes the workspace inert, focuses its close control, traps Tab, and restores focus and scroll on dismissal. Moving to a desktop viewport releases the lock.
- Dialog height follows the dynamic viewport, with scrolling content and a visible close header. Safe-area spacing accommodates device cutouts and home indicators. Reduced-motion preferences apply to result jumps.
- Existing TikTok Shop colors, illustration, Indonesian/English interface, formulas, and save behavior are retained.

## Verification

Real browser preview with viewport overrides (not physical-device testing):

- All 10 pages at 320, 768, 1024, and 1440px in Indonesian and English: no document horizontal overflow (80 page/size/language checks).
- Visual checks at 320 and 390px portrait, 844×390 landscape, and 1440px desktop.
- Discount cards show six scenarios. Changing planned units to 100 updates the 10% scenario total to Rp1,805,000 at the default product costs.
- Changing list price to Rp120,000 updates profit to Rp33,710 and flows into discount cards. Price 0 clears stale cards and displays the validation error.
- Added MOBILE-CHECK-001 with Rp15,000 shipping; card showed Rp15,000 remaining cost. Deleted it successfully.
- Removing the unsaved sample shows the empty-state message; switching languages updates that message and navigation.
- Drawer close and Escape restore trigger focus; Tab at the final menu entry wraps to Close. Switching to desktop releases background inert and scroll lock.
- Landscape return dialog fits the 390px viewport (366px high) and scrolls internally.
- Browser warning/error log empty after checks; script syntax and whitespace checks pass.
- Test edits were not saved. Reload restored the original sample figures; language returned to English as found at the start.
- LAN server bound to 0.0.0.0:4173; HTTP 200 verified via Mac address 192.168.1.2.

## Access and limits

Phone access requires the same Wi-Fi as the Mac and the local server running. The current IP can change; README contains discovery and startup commands. Data remains local to each browser/origin, without cross-device sync. Actual iOS/Android keyboards, browser chrome, safe-area insets, and phone network access still require a physical-device check.
