all : nodepackages.log bower.log

application-main.js: require-min.js bower.log 
	node_modules/requirejs/bin/r.js -o require-min.js

bower.log: nodepackages.log bower.json 
	node_modules/bower/bin/bower install | tee bower.log 

nodepackages.log: package.json
	npm install  | tee nodepackages.log


clean:
	rm require-min.js bower.log nodepackages.log
