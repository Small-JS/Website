#!/bin/bash

# Exit script if a step fails
set -e
# Set working directory to script directory.
cd "$(dirname "$0")"
# Pause on exit, also when a step fails, so the output stays readable.
trap 'sleep 2' EXIT

# zip is not included in Git Bash on Windows.
if ! command -v zip > /dev/null
then
	echo "Error: zip command not found."
	exit 1
fi

# Zip current folder to zip file in parent folder,
# named as this current folder's base name,
# excluding some generated / installed files.

folder=$(basename "$PWD")
zipfile="../${folder}.zip"
echo "Zipping to: $zipfile"
rm -f "$zipfile"
zip -r "$zipfile" . -x "*/node_modules/*"
