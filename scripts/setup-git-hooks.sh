#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

chmod +x "$ROOT"/.githooks/*
git -C "$ROOT" config core.hooksPath .githooks

cat <<EOF
Git hooks installed (.githooks).

  commit-msg:  reject messages containing "co-authored by"
EOF
