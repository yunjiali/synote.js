#rm -R dist/*
#grunt build:sandbox
ssh -t yl2@waisvm-yl2-gdp.ecs.soton.ac.uk "sudo rm -R ~/synotejs_client/synotejs_sandbox/*"
scp -r dist/* yl2@waisvm-yl2-gdp.ecs.soton.ac.uk:~/synotejs_client/synotejs_sandbox/.
ssh -t yl2@waisvm-yl2-gdp.ecs.soton.ac.uk "sudo cp -R ~/synotejs_client/synotejs_sandbox/* /var/www/sandbox.synote.org/public_html/."
