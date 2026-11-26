#!/bin/sh
# Compatibility entry point for existing replay notes.
cd "$(dirname "$0")/../../.." || exit 2
exec npm run verify:journey -- "$@"
