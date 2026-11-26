#!/bin/bash
# Compatibility entry point for existing macOS and Linux checkouts.
exec node "$(dirname "$0")/build.mjs"
