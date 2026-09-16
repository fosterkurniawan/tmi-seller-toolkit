# Hosting Sites — 16 September 2026

The existing TMI Seller Toolkit project is reused: `appgprj_6aa9f9dacff08191b7e1f90b89ad7919`. The website is published with public visitor access to preserve the audience of the existing internet-facing toolkit. The existing phone allowlist is unchanged and remains a client-side prototype gate, not server authentication.

## Source and future updates

- Canonical editable website: `web/` in this repository.
- `.openai/hosting.json` records the reused Site identity. Sites supports `dist` for static output; it does not support `web` as an output directory.
- Release checkout: `.runtime/sites-release`, with its own Git repository. Copy the current `web/` contents to that checkout's `dist/` and copy the hosting manifest to its `.openai/hosting.json`. Keep the release folder in sync, including removing assets deleted from the canonical website.
- Commit and push only this website-only checkout using a short-lived per-command authorization header from Sites. Do not push the parent repository or research history. Never persist credentials.
- Run the Sites `package-site.mjs` helper on the release checkout after the source push succeeds. Use the complete verified release HEAD SHA when saving a version, then deploy that exact saved version.
- Future edits to `web/` still update the local/tunnel preview immediately but require a new Sites publication to update the hosted link.

All 18 packaged website files matched the latest canonical files byte for byte. The archive also contains the normalized hosting manifest and macOS archive metadata. Existing site functionality was already browser-tested before this hosting-only change.

No laptop, local server, or tunnel is required to serve the Sites deployment. The original tunnel was left running. Browser-saved calculations and preferences belong to each origin and do not automatically transfer to the new URL. Hosting is included within plan-specific Sites public-beta limits; see https://help.openai.com/en/articles/20001339.

## Publication verified

Sites reported `succeeded` for deployment `appgdep_6aaa9e471f2081919bcb880be4714996`, version 1, release commit `9f7190dac966e118a3ce4c4ff31c00864fe0bd0c`.

Live URL: https://tmi-seller-toolkit.tmisquadgenai.chatgpt.site
