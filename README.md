project-setup-grunt
===================

Base grunt project setup.


All your source code should be in the 'app' folder. The two main tasks are:

grunt server:dev
grunt server:prod

They both have their slight differences but they both run the following tasks:
'clean:all', 
'sass:'+		ENVIRONMENT, 
'uglify:'+		ENVIRONMENT, 
'copy:'+		ENVIRONMENT, 
'complexity:'+	ENVIRONMENT, 
'connect:'+ 	ENVIRONMENT, 
'watch'

The ENVIRONMENT variable is the one that gets passed in after the colon, dev or prod.

grunt server:dev
This one runs all the tasks listed above but in pretty much dev mode. So all js comments are preserved, all rendered css has comments in it as to the origin of the class for debugging. Also sets the server to localhost:3333

grunt server:prod
This one runs all the tasks listed above but in production mode. So all js comments is minified, all rendered css is also minified. Also sets the server to localhost:4444. This is then the directory you should upload to the server.

dev is also pretty handy because one thing that you can do is, if you say have a css issue on the live server only and you cannot replicate it locally (it happens) it will be difficult to debug because the live code is minified. So what you can do is run your grunt server:dev task then proxy you local version of file to the file on the server and bingo, you can see the debugging version of the file in the live environment.

This project is by no means perfect, some things i should probably add are:
autoprefixer - Adds vendor prefixed styles at compile time.
handlebars - HTML Templating.
sftp/ftp - For quick consistant deployments to environments (i've had issues with noobs uploading files to the wrong locations)
a full deployment process.
