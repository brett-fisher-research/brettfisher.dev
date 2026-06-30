#!/usr/bin/env bash
# ROCK 7 — URL parity. Every post in _posts/ must emit out/posts/<slug>/index.html
# (slug = filename minus the YYYY-MM-DD- date prefix), preserving the old Jekyll
# /posts/:title/ URLs. Validates an already-built out/ (the runner builds once).
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT" || exit 1

fail=0
count=0
while IFS= read -r f; do
  slug="$(basename "$f" .md | sed -E 's/^[0-9]{4}-[0-9]{2}-[0-9]{2}-//')"
  count=$((count + 1))
  page="out/posts/$slug/index.html"
  if [ -f "$page" ]; then
    echo "OK   $page"
  else
    echo "FAIL: $page missing"
    fail=1
  fi
done < <(find _posts -name '*.md' | sort)

echo "----"
echo "checked $count post URLs"
[ "$count" -eq 16 ] || { echo "FAIL: expected 16 posts, found $count"; fail=1; }
exit "$fail"
