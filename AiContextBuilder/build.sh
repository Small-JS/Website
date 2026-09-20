#!/bin/bash
# This script creates the AI context file: smalljs.txt

# Exit script if a step fails
set -e
# Set working directory to script directory
cd "$(dirname "$0")"

echo "==== Building: AiContextBuilder"

# Compile TypeScript

echo "tsc AiContextBuilder"
tsc

# Generate context

node out/main.js
