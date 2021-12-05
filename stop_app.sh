#!/bin/bash  
dirName=${PWD##*/}
cd ../../apps
cd $dirName
node /opt/bitnami/nodejs/bin/forever stop htdocs/app.js
echo "App sould be soped on server. Check it out"
