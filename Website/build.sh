#!/bin/bash
# This script builds Website project.

# Exit script if a step fails
set -e
# Set working directiry to script directory
cd "$(dirname "$0")"

echo "==== Website"

# Compile TypeScript

echo "tsc Website"
tsc

# Copy subsites into this site.
# This assumes these have been built beforehand.
# Just copy the generated web apps for use in iframes.

# Must remove destination folders first,
# otherwise "cp -r" will behave differently.

# Tutorial

echo "Copying Tutorial"

rm -rf web/Tutorial/Tutorial
cp -r ../Tutorial/web/Tutorial/Tutorial web/Tutorial/Tutorial

# Reference

echo "Copying Reference"

rm -rf web/Reference/Reference
cp -r ../Reference/web/Reference/Reference web/Reference/Reference

# Playground

echo "Copying Playground"

rm -rf web/Playground/Playground
cp -r ../../SmallJS/Playground/web web/Playground/Playground

# Examples

echo "Copying Examples"

rm -rf web/Examples/Counter
cp -r ../../SmallJS/Examples/Counter/web web/Examples/Counter

rm -rf web/Examples/Todo
cp -r ../../SmallJS/Examples/Todo/web web/Examples/Todo

rm -rf web/Examples/Balls
cp -r ../../SmallJS/Examples/Balls/web web/Examples/Balls

rm -rf web/Examples/Benchmark
cp -r ../../SmallJS/Examples/Benchmark/web web/Examples/Benchmark

rm -rf web/Examples/WebWorkers
cp -r ../../SmallJS/Examples/WebWorkers/web web/Examples/WebWorkers

