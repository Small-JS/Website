#!/bin/bash
# This script installs npm dependencies fpr this project

# Exit script if a step fails
set -e
# Set working directory to script directory
cd "$(dirname "$0")"

echo "==== ReferenceBuilder"

npm install
