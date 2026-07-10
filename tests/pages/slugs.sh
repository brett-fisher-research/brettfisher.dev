#!/usr/bin/env bash
# Asserts out/posts/<slug>/index.html exists for every post in _posts/. Slugs are
# derived from _posts/ filenames (date prefix stripped). Validates an
# already-built out/ (the runner builds once).
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT" || exit 1

fail=0
count=0
while IFS= read -r f; do
  base="$(basename "$f" .md)"
  slug="$(echo "$base" | sed -E 's/^[0-9]{4}-[0-9]{2}-[0-9]{2}-//')"
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
echo "checked $count slugs"
EXPECTED="$(find _posts -name '*.md' | wc -l | tr -d ' ')"
[ "$EXPECTED" -gt 0 ] || { echo "FAIL: no posts found in _posts/"; fail=1; }
[ "$count" -eq "$EXPECTED" ] || { echo "FAIL: expected $EXPECTED posts, found $count"; fail=1; }

exit "$fail"
