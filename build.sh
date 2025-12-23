#!/bin/bash
# This script builds all subprojects.

# Exit script if a step fails
set -e
# Change to script folder.
cd "$(dirname "$0")"

./TutorialBuilder/build.sh
./Tutorial/build.sh
./ReferenceBuilder/build.sh
./Reference/build.sh
./Website/build.sh
