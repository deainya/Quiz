#!/bin/bash  
dirName=${PWD##*/}
cd ../../apps
if [ ! -d "$dirName" ]; then
  sudo mkdir $dirName
  echo "Created App dir"
fi
cd $dirName
if [ ! -d ".git" ]; then
  sudo git init
  sudo git remote add origin https://github.com/adeavoice/$dirName
  echo "Finished 'git init' and creation of origin in $dirName folder"
fi
sudo git pull origin master
echo "Finished 'git pull'"
sudo npm install
echo "Finished 'npm install'"
node /opt/bitnami/nodejs/bin/forever stop htdocs/app.js
node /opt/bitnami/nodejs/bin/forever start htdocs/app.js
echo "App sould be forever started on server. Check it out"
