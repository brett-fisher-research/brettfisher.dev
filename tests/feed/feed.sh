#!/usr/bin/env bash
# ROCK 5 — RSS feed verification.
#
# Validates an already-built out/feed.xml (the runner builds once up front):
#   1. exists and is well-formed RSS (xmllint if available, else node parse)
#   2. contains one <item> per post in _posts/ (count derived), newest first.
#
# The expected newest title is derived from _posts/ (the lone 2024 post) so the
# assertion isn't brittle to wording changes.
set -uo pipefail

# Repo root = two levels up from this script (tests/feed/).
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT" || exit 1

FEED="$ROOT/out/feed.xml"

fail() { echo "FAIL: $1" >&2; exit 1; }

# --- 1. exists ------------------------------------------------------------
[ -f "$FEED" ] || fail "out/feed.xml was not emitted by the build"
echo "ok: out/feed.xml exists"

# --- 1. well-formed -------------------------------------------------------
if command -v xmllint >/dev/null 2>&1; then
  xmllint --noout "$FEED" || fail "feed.xml is not well-formed XML (xmllint)"
  # Confirm it's RSS, not just any XML.
  xmllint --xpath 'name(/rss)' "$FEED" 2>/dev/null | grep -q '^rss$' \
    || fail "root element is not <rss>"
  echo "ok: well-formed RSS (xmllint)"
else
  node -e '
    const fs = require("fs");
    const xml = fs.readFileSync(process.argv[1], "utf8");
    // Cheap well-formedness: balanced root + presence of required channel tags.
    if (!/<rss[\s>]/.test(xml)) { console.error("no <rss> root"); process.exit(1); }
    if (!/<\/rss>/.test(xml))   { console.error("unterminated <rss>"); process.exit(1); }
    for (const tag of ["channel","title","link","description"]) {
      if (!new RegExp("<"+tag+"[\\s>]").test(xml)) {
        console.error("missing <"+tag+">"); process.exit(1);
      }
    }
  ' "$FEED" || fail "feed.xml failed node well-formedness/RSS parse"
  echo "ok: well-formed RSS (node fallback)"
fi

# --- channel metadata present --------------------------------------------
grep -q "<link>https://brettfisher.dev" "$FEED" || fail "channel link missing/wrong"
echo "ok: channel metadata present"

# --- 2. one item per post -------------------------------------------------
EXPECTED_ITEMS="$(find _posts -name '*.md' | wc -l | tr -d ' ')"
[ "$EXPECTED_ITEMS" -gt 0 ] || fail "no posts found in _posts/"
ITEM_COUNT="$(grep -c "<item>" "$FEED")"
[ "$ITEM_COUNT" -eq "$EXPECTED_ITEMS" ] || fail "expected $EXPECTED_ITEMS <item>s, found $ITEM_COUNT"
echo "ok: $ITEM_COUNT <item> elements"

# --- 2. newest first ------------------------------------------------------
# Newest post = the only file under _posts/ starting with the max year.
NEWEST_FILE="$(ls _posts/*.md | xargs -n1 basename | sort | tail -1)"
[ -n "$NEWEST_FILE" ] || fail "could not find newest post file in _posts/"
# Pull the title from that post's frontmatter.
EXPECTED_TITLE="$(
  awk '
    /^title:/ {
      sub(/^title:[ \t]*/, "")
      gsub(/^["'"'"']|["'"'"']$/, "")
      print
      exit
    }
  ' "_posts/$NEWEST_FILE"
)"
[ -n "$EXPECTED_TITLE" ] || fail "could not derive title from _posts/$NEWEST_FILE"

# Title of the first <item> in the feed.
FIRST_ITEM_TITLE="$(
  node -e '
    const fs = require("fs");
    const xml = fs.readFileSync(process.argv[1], "utf8");
    const item = xml.slice(xml.indexOf("<item>"), xml.indexOf("</item>"));
    const m = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    process.stdout.write(m ? m[1].trim() : "");
  ' "$FEED"
)"

if [ "$FIRST_ITEM_TITLE" != "$EXPECTED_TITLE" ]; then
  fail "newest-first check: first item is '$FIRST_ITEM_TITLE', expected '$EXPECTED_TITLE' (from $NEWEST_FILE)"
fi
echo "ok: newest post first ('$FIRST_ITEM_TITLE')"

echo "PASS: feed.xml valid, $ITEM_COUNT items, newest first"
