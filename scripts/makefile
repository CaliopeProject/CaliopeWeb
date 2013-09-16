all : nodepackages.log bower.log

bower.log: nodepackages.log bower.json 
	node_modules/bower/bin/bower install | tee bower.log 

nodepackages.log: package.json
	npm install  | tee nodepackages.log


clean:
	rm  bower.log nodepackages.log
