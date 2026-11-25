#!/bin/bash
# One synthetic verification journey for Bree: launch, doctor, drive, evidence, cleanup.
# Synthetic data only. Never runs `npm run brief:live`. Usage: bash .claude/skills/verify-bree/journey.sh [evidence-file]
cd "$(dirname "$0")/../../.." || exit 2
EVID="${1:-$(mktemp -d)/evidence.txt}"
FAIL=0
HAD_OUT=0; [ -d out ] && HAD_OUT=1

step() { printf '\n## %s\n' "$1" | tee -a "$EVID"; }
run() { # run <must-pass:1|0> command...
  local must="$1"; shift
  printf '$ %s\n' "$*" >> "$EVID"
  "$@" >> "$EVID" 2>&1; local rc=$?
  printf 'exit=%s\n' "$rc" >> "$EVID"
  if [ "$must" = 1 ] && [ "$rc" -ne 0 ]; then FAIL=1; echo "FAILED: $*" | tee -a "$EVID"; fi
  return 0
}

step "1 launch"
run 1 bash -c 'test -d node_modules || npm ci'

step "2 doctor"
run 1 node --version
run 1 git rev-parse --short HEAD
run 0 git status --short
run 1 git check-ignore -v out/latest.html
run 0 bash -c 'test -f .bree.local.json && echo "local config present" || echo "local config absent"'

step "3 drive"
run 1 npm run brief:sample
run 1 bash -c 'for h in "Summary" "Push your work forward" "Top to-dos" "New updates" "Your day" "Sources"; do grep -q ">$h</h2>" out/latest.html && echo "section present: $h" || { echo "section MISSING: $h"; exit 1; }; done'
run 1 npm run test:render
run 1 npm run test:schema
run 1 npm run eval
run 1 npm run test:live
run 0 npm run live:check   # 0 = READY, 3 = OPEN; both are recorded, neither is a failure of this journey

step "4 evidence"
echo "evidence file: $EVID" | tee -a "$EVID"

step "5 cleanup"
if [ "$HAD_OUT" = 0 ]; then rm -rf out; echo "removed out/ (created by this run)" | tee -a "$EVID"; else echo "kept out/ (existed before the run)" | tee -a "$EVID"; fi

step "6 evidence still exists after cleanup"
if [ -s "$EVID" ]; then echo "yes: $EVID" ; else echo "NO"; FAIL=1; fi
echo "journey result: $([ "$FAIL" = 0 ] && echo PASS || echo FAIL)"
exit "$FAIL"
