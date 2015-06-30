rm -R dist/*
grunt build:production
ssh -t yl2@waisvm-yl2-gdp.ecs.soton.ac.uk "sudo rm -R ~/synotejs_client/synotejs_prod/*"
scp -r dist/* yl2@waisvm-yl2-gdp.ecs.soton.ac.uk:~/synotejs_client/synotejs_prod/.
ssh -t yl2@waisvm-yl2-gdp.ecs.soton.ac.uk "sudo cp -R ~/synotejs_client/synotejs_prod/* /var/www/synotejs/public_html/."
