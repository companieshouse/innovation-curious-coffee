#!/bin/sh

DIR=$(pwd)

#Remove dist folder if it exists
if [ -d "$DIR/dist" ]; then
    echo "Attempting to remove dist folder"
    rm -r ./dist
    echo "Dist folder removed"
else
    echo "No dist folder present, skipping prebuild step"
fi