#!/bin/bash

# Exit script if a step fails
set -e
# Set working directiry to script directory
cd "$(dirname "$0")"

echo "==== TutorialBuilder"

# Compile TypeScript

echo "tsc TutorialBuilder"
tsc

# Build tutorial

echo "Build tutorial pages"
node out/main.js

