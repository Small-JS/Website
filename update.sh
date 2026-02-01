#!/bin/bash

# Exit script if a step fails
set -e
# Set working directory to script directory.
cd "$(dirname "$0")"

# Ask confirmation

echo "This script will update all dependencies of Node.js projects to the latest versions"
read -p "To you want to continue? (y/N) " confirm
if
	[[ ! $confirm == [yY] ]]
then
	echo "Aborted."
	exit 1
fi

# Perform updates

cwd=$(pwd)

echo "Updating..."

echo "==== TutorialBuilder"
cd $cwd/TutorialBuilder
npx npm-check-updates -u
npm install

echo "==== ReferenceBuilder"
cd $cwd/ReferenceBuilder
npx npm-check-updates -u
npm install

echo "==== Updates successful"
echo "To update all global npm dependencies type: npm -g update"
