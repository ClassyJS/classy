REPORTER = spec


test:
	./node_modules/.bin/mocha --recursive --reporter $(REPORTER) --require should mocha-test
test-debug:
	./node_modules/.bin/mocha --debug --recursive --reporter $(REPORTER) --require should mocha-test
test-w:
	./node_modules/.bin/mocha --recursive --reporter $(REPORTER) --require should --watch mocha-test
test-w-debug:
	./node_modules/.bin/mocha --debug --recursive --reporter $(REPORTER) --require should --watch mocha-test

.PHONY: test test-w