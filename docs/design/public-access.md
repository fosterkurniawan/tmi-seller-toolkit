# Internet access — 16 September 2026

## Deployment

Followed the existing S1 approach observed in V3 Crypto bot's `launchd/v3_tunnel.sh` and its LaunchAgent: Cloudflare Quick Tunnel supervised by macOS launchd. The seller toolkit uses its own two labels, `com.seller-toolkit.serve` and `com.seller-toolkit.tunnel`. No S1 workers, tunnel, credentials, or Telegram settings were modified or reused.

- Website origin: http://127.0.0.1:4174
- Initial verified public URL: https://side-ink-assist-cup.trycloudflare.com/#home
- Current URL: `.runtime/public_url.txt`, ignored by Git, recreated on tunnel startup and removed on graceful stop.
- Cloudflared: installed Homebrew executable, version 2026.7.3.
- Server root: only `web/`; directory listing disabled; resolved paths outside `web/` and hidden paths rejected.
- Mac user LaunchAgents: start at login and restart stopped processes, with 15-second throttle.
- Logs: `~/Library/Logs/seller-toolkit/`.

The static website has no private server-side calculator records or accounts. The existing manual browser save behavior is unchanged. Public URL changes create a new browser origin and do not migrate previously saved data.

## Verification

- Both launchd services running, with separate PIDs.
- Origin returned HTTP 200.
- Public HTTPS HTML, mobile CSS, workspace JS, and active 3D PNG returned HTTP 200 and matched local file bytes exactly.
- Origin requests for README, .git/config, .env, deployment script, asset directory listing, and encoded parent traversal returned HTTP 404.
- Browser loaded the public homepage, navigation, illustration, and calculator. Default profit remained Rp18,050. Browser error/warning log empty.
- Python compilation, shell syntax, and Git whitespace checks passed.

## Lifetime and rollback

Mac and internet connection must remain available. Sleep, logout, shutdown, or network loss can interrupt access. The URL can change when the tunnel restarts. Quick Tunnels are for demos/testing, have no uptime guarantee, and are not a permanent domain. Source: [Cloudflare documentation](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/).

Stop the two toolkit LaunchAgents using the commands in README to remove public access. Local preview on 4173 remains independent. Remove/move only their two plist files if automatic startup should also be disabled; no other project services need to change.
