#!/usr/bin/env bash
# ROCK 7 — Content count parity: posts in == post pages out == post links on the
# home page, all equal to 16. Validates an already-built out/ (runner builds once).
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT" || exit 1

POSTS_IN="$(find _posts -name '*.md' | wc -l | tr -d ' ')"
PAGES_OUT="$(find out/posts -name index.html | wc -l | tr -d ' ')"
# Distinct /posts/<slug>/ links referenced from the home page.
HOME_LINKS="$(grep -oE 'href="/posts/[^"/]+/?"' out/index.html | sort -u | wc -l | tr -d ' ')"

echo "posts in _posts/ : $POSTS_IN"
echo "out/posts pages  : $PAGES_OUT"
echo "home post links  : $HOME_LINKS"

fail=0
[ "$POSTS_IN" -eq 16 ]   || { echo "FAIL: expected 16 posts in _posts/"; fail=1; }
[ "$PAGES_OUT" -eq 16 ]  || { echo "FAIL: expected 16 post pages in out/posts/"; fail=1; }
[ "$HOME_LINKS" -eq 16 ] || { echo "FAIL: expected 16 post links on home page"; fail=1; }
[ "$POSTS_IN" -eq "$PAGES_OUT" ] && [ "$PAGES_OUT" -eq "$HOME_LINKS" ] \
  || { echo "FAIL: counts not all equal"; fail=1; }

[ "$fail" -eq 0 ] && echo "PASS: 16 == 16 == 16"
exit "$fail"
