# Contributing

## Code style
Regarding code style like indentation and whitespace, **follow the conventions you see used in the source already.**

## Modifying the code
First, ensure that you have the latest [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed.

1. Fork and clone the repo.
1. Run `npm install` to install all development dependencies.
1. Run `npm test` to run the project's test suite and ensure all tests pass.

## Submitting pull requests

1. Create a new topic branch, don't work in your `master` branch directly.
1. Add failing tests for the change you want to make. Run `npm test` to see the tests fail.
1. Modifiy code.
1. Run `npm test` to see if the tests pass. Repeat steps 2-4 until done.
1. Update the README to reflect any changes.
1. Push to your fork (`git push origin <topic-branch-name>`) and submit a pull request.
