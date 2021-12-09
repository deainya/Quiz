#!/bin/bash
dirName=${PWD##*/}
cd ../../apps
cd $dirName
node node_modules/forever/bin/forever stop htdocs/app.js
echo "App sould be stoped on server. Check it out"
