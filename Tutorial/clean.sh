#!/bin/bash
# This script removes all installed / compiled / generated artifacts for this project.

# Change to script folder.
cd "$(dirname "$0")"

echo "Cleaning Website Tutorial"

rm -fr web/Tutorial/Tutorial/Pages
rm -fr web/Tutorial/Tutorial/Script
