#!/usr/bin/env bash
# Asserts out/index.html lists every post title from _posts/ plus both the 2024
# and 2020 year headings. Validates an already-built out/ (the runner builds
# once). Titles are read from _posts/ so this stays in sync with the corpus.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT" || exit 1

INDEX="out/index.html"
[ -f "$INDEX" ] || { echo "FAIL: $INDEX not found"; exit 1; }

fail=0

# Year headings
for year in 2024 2020; do
  if grep -q ">$year<" "$INDEX"; then
    echo "OK   year heading $year"
  else
    echo "FAIL: year heading $year missing"
    fail=1
  fi
done

# Every title from _posts/ frontmatter must appear in the rendered HTML.
count=0
while IFS= read -r f; do
  title="$(grep -m1 '^title:' "$f" | sed 's/^title: *//')"
  count=$((count + 1))
  # HTML-escape the characters Next escapes in text: & -> &amp;
  esc="${title//&/&amp;}"
  if grep -qF "$esc" "$INDEX"; then
    echo "OK   title: $title"
  else
    echo "FAIL: title missing: $title"
    fail=1
  fi
done < <(find _posts -name '*.md' | sort)

echo "----"
echo "checked $count titles"
EXPECTED="$(find _posts -name '*.md' | wc -l | tr -d ' ')"
[ "$EXPECTED" -gt 0 ] || { echo "FAIL: no posts found in _posts/"; fail=1; }
[ "$count" -eq "$EXPECTED" ] || { echo "FAIL: expected $EXPECTED posts, found $count"; fail=1; }

exit "$fail"
