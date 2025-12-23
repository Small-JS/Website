#!/bin/bash
# This script removes all installed / compiled / generated artifacts for this project.

# Change to script folder.
cd "$(dirname "$0")"

echo "Cleaning Website Reference"

rm -fr web/Reference/Reference/Pages
rm -fr web/Reference/Reference/Script
