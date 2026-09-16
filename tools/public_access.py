#!/usr/bin/env python3
"""Serve only web/ and publish it through a dedicated Cloudflare Quick Tunnel."""
import functools
import http.server
import os
from pathlib import Path
import re
import shutil
import signal
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / 'web'
RUNTIME = ROOT / '.runtime'
URL_FILE = RUNTIME / 'public_url.txt'
PORT = 4174


class WebsiteHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        candidate = Path(super().translate_path(path)).resolve()
        try:
            relative = candidate.relative_to(WEB)
        except ValueError:
            return str(WEB / '__not_found__')
        if any(part.startswith('.') for part in relative.parts):
            return str(WEB / '__not_found__')
        return str(candidate)

    def list_directory(self, path):
        self.send_error(404)
        return None

    def end_headers(self):
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()


def serve():
    handler = functools.partial(WebsiteHandler, directory=str(WEB))
    server = http.server.ThreadingHTTPServer(('127.0.0.1', PORT), handler)
    print(f'Seller toolkit: http://127.0.0.1:{PORT}', flush=True)
    try:
        server.serve_forever()
    finally:
        server.server_close()


def tunnel():
    executable = shutil.which('cloudflared') or '/opt/homebrew/bin/cloudflared'
    RUNTIME.mkdir(exist_ok=True)
    URL_FILE.unlink(missing_ok=True)
    child = subprocess.Popen(
        [executable, 'tunnel', '--no-autoupdate', '--url', f'http://127.0.0.1:{PORT}'],
        stdout=subprocess.PIPE, stderr=subprocess.STDOUT, stdin=subprocess.DEVNULL,
        text=True, bufsize=1,
    )

    def stop(signum, frame):
        raise SystemExit(0)

    signal.signal(signal.SIGTERM, stop)
    signal.signal(signal.SIGINT, stop)
    try:
        for line in child.stdout:
            print(line.rstrip(), flush=True)
            match = re.search(r'https://[a-z0-9-]+\.trycloudflare\.com', line)
            if match:
                temporary = URL_FILE.with_suffix('.tmp')
                temporary.write_text(match.group(0) + '/#home\n')
                os.replace(temporary, URL_FILE)
        raise SystemExit(child.wait())
    finally:
        URL_FILE.unlink(missing_ok=True)
        if child.poll() is None:
            child.terminate()
            try:
                child.wait(timeout=10)
            except subprocess.TimeoutExpired:
                child.kill()
                child.wait()


if __name__ == '__main__':
    if len(sys.argv) != 2 or sys.argv[1] not in ('serve', 'tunnel'):
        raise SystemExit('Usage: public_access.py serve|tunnel')
    {'serve': serve, 'tunnel': tunnel}[sys.argv[1]]()
