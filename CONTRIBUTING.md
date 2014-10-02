# Contributing

You are invited to contribute to the `classy`.

Just clone the repo, make your changes, and run all tests. Push requests with failing tests will not be accepted.

## Tests

For `karma` tests, run

```sh
$ npm test
```

For `mocha` tests, run
```sh
$ make test
```
or
```sh
$ make test-w
```
for watch mode.

We are in the process of transitioning tests from `karma` to `mocha`, so please help in moving tests from `test` dir to `mocha-test`.

## Changelog

### 1.4.4

 - start moving tests from `karma` to `mocha`.