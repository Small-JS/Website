#!/bin/bash
# This script builds all subprojects.

# Exit script if a step fails
set -e
# Change to script folder.
cd "$(dirname "$0")"

echo "==== Building..."

./TutorialBuilder/build.sh
./Tutorial/build.sh
./ReferenceBuilder/build.sh
./Reference/build.sh
./AiContextBuilder/build.sh

# Also copies previous build results to the website
./Website/build.sh

echo "==== Builds successful."

sleep 2
