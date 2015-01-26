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
1. mysql -u root -p
1. create database synotejs_prod;
1. grant all on synotejs_prod.* to 'synote'@'localhost' identified by 'synote';
1. mysql -u root -p synotejs_prod < server/db/backup-xx.sql (choose the correct backup)
1. exit mysql and use forever to start the server:
```forever start app.js --prod```
1. you can then type:
```forever list```
to check if the server has been started
1. NOTE: the production server port is still 1337 and we are not planning to proxy it through nginx at the moment, because there is only one server running. If we want to cluster, we may need to proxy it through nginx.
1.

#For angularjs client
1. jsHint is disabled in Gruntfile.js due to that there are too many warnings
1. I have removed the cssmin step in Gruntfile.js
1. run:
```grunt build```
1. I follow this tutorial to create nginx website:
https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-virtual-hosts-server-blocks-on-ubuntu-12-04-lts--3
1. copy the generated dist folder to the target deployment directory in Nginx