#!/usr/bin/env bash
# Asserts the document <head> carries the Google Analytics id and an og:title
# meta tag — on both the home page and a post page. Validates an already-built
# out/ (the runner builds once).
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT" || exit 1

GA_ID="G-C7NHJXQQ24"

fail=0

check() {
  local label="$1" file="$2"
  [ -f "$file" ] || { echo "FAIL: $label ($file) not found"; fail=1; return; }

  if grep -q "$GA_ID" "$file"; then
    echo "OK   $label: GA id present"
  else
    echo "FAIL: $label: GA id $GA_ID missing"
    fail=1
  fi

  if grep -q 'property="og:title"' "$file"; then
    echo "OK   $label: og:title present"
  else
    echo "FAIL: $label: og:title meta missing"
    fail=1
  fi
}

check "home" "out/index.html"
# Pick a real post page to check too.
POST_PAGE="$(find out/posts -name index.html | sort | head -1)"
check "post" "$POST_PAGE"

exit "$fail"
