#!/bin/bash
dirName=${PWD##*/}
cd ../../apps
cd $dirName
node forever stop htdocs/app.js
echo "App sould be stoped on server. Check it out"
