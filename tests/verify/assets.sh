#!/usr/bin/env bash
# ROCK 7 — Asset parity. Every local /assets/... reference in the built HTML must
# resolve to a file under out/assets/. External URLs are ignored. Validates an
# already-built out/ (the runner builds once).
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT" || exit 1

[ -d out ] || { echo "FAIL: out/ not found"; exit 1; }

fail=0
checked=0

# Extract href/src values pointing at /assets/... from every built HTML file,
# dedupe, and confirm each maps to a real file in out/.
while IFS= read -r ref; do
  [ -n "$ref" ] || continue
  checked=$((checked + 1))
  # Strip any query/hash, map the leading / to out/.
  clean="${ref%%[?#]*}"
  path="out${clean}"
  if [ -f "$path" ]; then
    echo "OK   $ref"
  else
    echo "FAIL: broken asset ref $ref -> $path"
    fail=1
  fi
done < <(
  grep -rhoE '(href|src)="/assets/[^"]+"' out --include='*.html' \
    | sed -E 's/^(href|src)="//; s/"$//' \
    | sort -u
)

echo "----"
echo "checked $checked unique /assets/ references"
exit "$fail"
