This document explains how to deploy synote.js on ubuntu
#Pre-installation
1. install latest nginx
```sudo apt-get install nginx```
1. install ffmpeg
1. install mysql
```sudo apt-get install mysql-server```
1. Install compilers need for bcrypt package for sails server
```sudo apt-get install build-essential python2.7```
1. install Node.js
1. making sure the npm npm is the latest one, at least greater than v2.1.0 (sometimes, sudo is necessary)
```npm install -g npm@latest```
1. npm install -g sails (this is for synotejs server)
1. npm install -g grunt (this is for synotejs client)
1. npm install -g bower (this is for synotejs client)
1. npm install -g forever (this is used for starting the sails server)

#For sailsjs server
1. goto /server directory and
```sudo npm install```