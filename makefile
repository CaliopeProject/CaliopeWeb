all: js

js: 
	cd scripts; make


clean:
	echo cleaning up in .
	cd scripts; make clean

