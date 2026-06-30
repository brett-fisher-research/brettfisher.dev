#!/usr/bin/env bash
# Verifies the static export preserves the custom-domain CNAME for GitHub Pages.
# Validates an already-built out/ (the runner builds once; or run `npm run build`).
set -euo pipefail

# Resolve repo root from this script's location (tests/deploy/cname.sh).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

CNAME_FILE="out/CNAME"
EXPECTED="brettfisher.dev"

if [[ ! -f "$CNAME_FILE" ]]; then
  echo "FAIL: $CNAME_FILE does not exist after build" >&2
  exit 1
fi

if grep -qx "$EXPECTED" "$CNAME_FILE"; then
  echo "PASS: $CNAME_FILE contains '$EXPECTED'"
  exit 0
fi

echo "FAIL: $CNAME_FILE does not contain '$EXPECTED'" >&2
echo "----- $CNAME_FILE -----" >&2
cat "$CNAME_FILE" >&2
exit 1
