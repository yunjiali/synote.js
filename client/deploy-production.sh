rm -R dist/*
grunt build:sandbox
ssh -t yl2@waisvm-yl2-gdp.ecs.soton.ac.uk "sudo rm -R ~/synotejs_client/synotejs_production/*"
scp -r dist/* yl2@waisvm-yl2-gdp.ecs.soton.ac.uk:~/synotejs_client/synotejs_production/.
ssh -t yl2@waisvm-yl2-gdp.ecs.soton.ac.uk "sudo cp -R ~/synotejs_client/synotejs_production/* /var/www/synotejs/public_html/."
