#!/usr/bin/env python3
"""Install this toolkit's two user LaunchAgents without touching other projects."""
import os
from pathlib import Path
import plistlib
import subprocess

ROOT = Path(__file__).resolve().parents[1]
AGENTS = Path.home() / 'Library' / 'LaunchAgents'
LOGS = Path.home() / 'Library' / 'Logs' / 'seller-toolkit'
DOMAIN = f'gui/{os.getuid()}'
AGENTS.mkdir(parents=True, exist_ok=True)
LOGS.mkdir(parents=True, exist_ok=True)
for mode in ('serve', 'tunnel'):
    label = f'com.seller-toolkit.{mode}'
    destination = AGENTS / f'{label}.plist'
    config = {
        'Label': label,
        'ProgramArguments': ['/bin/bash', str(ROOT / 'launchd' / 'public_access.sh'), mode],
        'RunAtLoad': True,
        'KeepAlive': True,
        'ThrottleInterval': 15,
        'StandardOutPath': str(LOGS / f'{mode}.out.log'),
        'StandardErrorPath': str(LOGS / f'{mode}.err.log'),
    }
    if destination.exists():
        existing = plistlib.loads(destination.read_bytes())
        if existing.get('ProgramArguments') != config['ProgramArguments']:
            raise SystemExit(f'Refusing to replace an unrelated service: {destination}')
    loaded = subprocess.run(['launchctl', 'print', f'{DOMAIN}/{label}'], capture_output=True).returncode == 0
    if loaded:
        print(f'Already loaded: {label}')
        continue
    destination.write_bytes(plistlib.dumps(config))
    subprocess.run(['launchctl', 'bootstrap', DOMAIN, str(destination)], check=True)
    print(f'Started: {label}')
