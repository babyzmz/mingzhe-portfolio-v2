#!/bin/sh
cd "$(dirname "$0")" || exit 1
if command -v node >/dev/null 2>&1; then
  echo 'Open http://127.0.0.1:8765 in your browser.'
  exec node scripts/serve.mjs
fi
open ./Mingzhe-Portfolio-Preview.html
