#!/bin/bash

# Wrapper script for cleanup-public.js
# Makes it easier to run the cleanup script with common options

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLEANUP_SCRIPT="$SCRIPT_DIR/cleanup-public.js"

# Check if the script exists
if [ ! -f "$CLEANUP_SCRIPT" ]; then
  echo "Error: cleanup-public.js not found in $SCRIPT_DIR"
  exit 1
fi

# Make sure the script is executable
chmod +x "$CLEANUP_SCRIPT"

# Display help if requested
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
  echo "Usage: $(basename "$0") [OPTION]"
  echo ""
  echo "Options:"
  echo "  --dry-run    List unused files without removing them (default)"
  echo "  --remove     Remove unused files"
  echo "  --help       Display this help message"
  exit 0
fi

# Run the script with the provided arguments
node "$CLEANUP_SCRIPT" "$@"