#!/bin/bash

# Exit script if a step fails
set -e
# Set working directiry to script directory
cd "$(dirname "$0")"

echo "==== ReferenceBuilder"

# Compile TypeScript

echo "tsc ReferenceBuilder"
tsc

# Generate compiled class info

pushd ../../SmallJS/Smalltalk > /dev/null
../Compiler/start.sh -d -t  .  ../../Website/Reference/Pages
popd > /dev/null

# Build tutorial

echo "Building reference pages"
node out/main.js

