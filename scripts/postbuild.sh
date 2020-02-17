#!/bin/sh

#Copy public assets
echo "Copying public assets to dist/public"
cp -r ./src/public ./dist/public
echo "Public assets copied to dist/public"

#Copy views
echo "Copying views to dist/views"
cp -r ./src/views ./dist/views
echo "Views copied to dist/views"