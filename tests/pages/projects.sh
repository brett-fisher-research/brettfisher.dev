#!/usr/bin/env bash
# /projects page — built output features Duree with a duree.dev link, and the
# hero screenshot asset is a real PNG > 10KB. Validates an already-built out/
# (the runner builds once).
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT" || exit 1

fail=0

# Built page exists and features Duree + the external link.
PAGE="out/projects/index.html"
if [ -f "$PAGE" ]; then
  echo "OK   $PAGE exists"
else
  echo "FAIL: $PAGE not found"
  exit 1
fi

grep -q "Duree" "$PAGE" && echo "OK   page mentions Duree" \
  || { echo "FAIL: page missing Duree"; fail=1; }
grep -q 'href="https://duree.dev"' "$PAGE" && echo "OK   page links https://duree.dev" \
  || { echo "FAIL: page missing duree.dev href"; fail=1; }

# Hero asset: exists, PNG magic bytes, > 10KB — in source and in the export.
for IMG in public/projects/duree-hero.png out/projects/duree-hero.png; do
  if [ ! -f "$IMG" ]; then
    echo "FAIL: $IMG not found"
    fail=1
    continue
  fi
  magic="$(head -c 8 "$IMG" | od -An -tx1 | tr -d ' \n')"
  if [ "$magic" = "89504e470d0a1a0a" ]; then
    echo "OK   $IMG has PNG magic bytes"
  else
    echo "FAIL: $IMG is not a PNG (magic: $magic)"
    fail=1
  fi
  size="$(wc -c < "$IMG" | tr -d ' ')"
  if [ "$size" -gt 10240 ]; then
    echo "OK   $IMG is ${size} bytes (> 10KB)"
  else
    echo "FAIL: $IMG is only ${size} bytes (<= 10KB)"
    fail=1
  fi
done

exit "$fail"
