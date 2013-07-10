all : application-main.js
pre : nodepackages bower

application-main.js: require-min.js
	r.js -o require-min.js

bower: bower.json 
	bower install

nodepackages: package.json
	sudo npm install -g
