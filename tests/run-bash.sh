#!/usr/bin/env bash
# Runs every tests/**/*.sh (except this runner) with bash.
# Fails (exit 1) if any test script exits non-zero.
set -uo pipefail

# Resolve the tests/ directory regardless of cwd.
TESTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SELF="$TESTS_DIR/run-bash.sh"
REPO_ROOT="$(cd "$TESTS_DIR/.." && pwd)"

# Build the static export ONCE up front. Every bash test below validates the
# same out/ tree instead of each running its own `npm run build`. `npm run test`
# already builds first; this guard only kicks in when running the bash lane
# standalone (or if out/ was cleared).
if [ ! -f "$REPO_ROOT/out/index.html" ]; then
  echo "==> out/ missing — building once (npm run build)"
  ( cd "$REPO_ROOT" && npm run build ) || { echo "FAIL: npm run build failed"; exit 1; }
fi

failed=0
found=0

while IFS= read -r script; do
  [ "$script" = "$SELF" ] && continue
  found=$((found + 1))
  echo "RUN  $script"
  if bash "$script"; then
    echo "PASS $script"
  else
    echo "FAIL $script"
    failed=$((failed + 1))
  fi
done < <(find "$TESTS_DIR" -type f -name '*.sh' | sort)

echo "----"
echo "bash tests: $found run, $failed failed"
[ "$failed" -eq 0 ] || exit 1
