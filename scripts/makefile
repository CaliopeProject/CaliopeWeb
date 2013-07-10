all : nodepackages.log bower.log application-main.js

application-main.js: require-min.js bower.log 
	r.js -o require-min.js

bower.log: nodepackages.log bower.json 
	bower install | tee bower.log 

nodepackages.log: package.json
	sudo npm install -g | tee nodepackages.log


clean:
	rm require-min.js bower.log nodepackages.log
