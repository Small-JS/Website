#!/bin/bash

# Exit script if a step fails
set -e
# Set working directiry to script directory
cd "$(dirname "$0")"

echo "==== Reference"

# Compile TypeScript

echo "tsc Reference"
tsc

