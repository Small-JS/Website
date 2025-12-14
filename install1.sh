#!/bin/bash
# This script:
# 	- Checks prerequisite applications
#	- Installs npm dependencies

# Exit script if a step fails
set -e
# Set working directory to script directory
cd "$(dirname "$0")"

echo "==== Detecting prerequisite applications"
echo "To install them, look at Documentation/Prerequisites.md in the SmallJS repo."

echo -n "Detecting Visual Studio Code: "
code -v

echo -n "Detecting Node.js: "
node -v

echo -n "Detecting npm: "
npm -v

# TypeScript must be installed globally to work from VSCode.
echo -n "Detecting TypeScript: "
tsc -v

# Check npx dependencies here to force first-time installation

echo "Detecting http-server: "
npx http-server --version

echo "==== Installing npm packages"

./TutorialBuilder/install.sh

echo "==== All installs successful"
