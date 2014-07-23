# checkmark [![Build Status](https://api.travis-ci.org/radkodinev/checkmark.svg?branch=master)](https://travis-ci.org/radkodinev/checkmark)

> A tiny library that may ease writing tests and debugging code a bit.

The primary motivation for the creation of checkmark was to help more easily write automated tests (especially for asynchronous code). However, in general, the library could be useful in all testing or debugging scenarios, as well as in production code.
`
It acts as a counter by tracking the number of invocations of an utility function that checkmark provides which you can call at particular points in your code.

Checkmark is tiny in code size, has no dependencies, and can be used in different environmens (CommonJS, AMD, or as a global in the browser) thanks to utilizing the UMD pattern.

## Installation
### npm (Node.js)
```bash
npm install checkmark
```

### Bower
```bash
bower install checkmark
```

## Usage
### CommonJS (Node.js)
```javascript
var Checkmark = require("checkmark");

var check = new Checkmark(count, callback);
```

### AMD
```javascript
require(["checkmark"], function(Checkmark) {
  var check = new Checkmark(count, callback);
});
```

### Browser (exposed as a global)
```html
<script src="checkmark.js"></script>
<script>
  var check = new Checkmark(count, callback);
</script>
```

## API (by example)
```javascript
  // Create a checkmark function
  //   Argument 1 (count): positive integer (required)
  //   Argument 2 (callback): function (optional); will be invoked when target count is reached
  //   Will throw Error when target count exceeded
  var check = new Checkmark(4, function callback() {
    // when this callback gets called
    // the target of 4 counts will have been just reached
  });

  // get current count value
  check.getCount(); // => 0

  // mark 1
  check();
  check.getCount(); // => 1
  check.getCalls(); // => [ null ]

  // mark 2, with message
  check("2nd mark with message");
  check.getCount(); // => 2
  check.getCalls(); // => [ null, "2nd mark with message" ]

  // mark 3, with data
  check({ message: "3rd mark", now: Date.now() });
  check.getCount(); // => 3
  check.getCalls(); // => [ null, "2nd mark with message", { message: "3rd mark", now: "..." } ]

  // mark 4
  check(); // callback gets called
  check.getCount(); // => 4
  check.getCalls(); // => [ null, "2nd mark with message", { message: "3rd mark", now: "..." }, null ]

  // mark 5, after target has been reached
  check(); // throws Error
  check.getCount(); // => 4
  check.getCalls(); // => [ null, "2nd mark with message", { message: "3rd mark", now: "..." }, null ]

```

## Usage examples
#### _Mocha test (for Sails.js)_
```javascript
decribe("User", function() {
  it("password should be at least 8 characters", function(done) {
    var check = new Checkmark(3, done);
    
    expect(User).to.exist.and.be.an("object");
    check();

    User.create({ password: '1234567' }).exec(function(err, user) {
      expect(err).to.exist;
      expect(user).to.not.exist;
      check();
    });

    User.create({ password: '12345678' }).exec(function(err, user) {
      expect(err).to.not.exist;
      expect(user).to.be.an("object");
      check();
    });
  });
});
```

#### _Mocha test (for Sails.js)_
```javascript
decribe("Article", function() {
  it("Factory-created article is valid and can be persisted", function(done) {
    var log = new Checkmark(3, function() {
      console.log(log.getCalls()); // for debugging purposes
      done();
    });

    var article = new Factory("article", "Some title", "Some content");

    expect(article).to.exist;
    expect(article).to.be.an("object");
    expect(article).to.have.property("title", "Some title");
    expect(article).to.have.property("content", "Some content");
    log("article was created");

    Article.validate(article, function(err) {
      expect(err).to.not.exist;
      log("article is valid");
    });

    article.save(function(err) {
      expect(err).to.not.exist;
      log("article was persisted");      
    });
  });
});
```

#### _Wait for two async functions to complete_
```javascript
var result1 = null;
var result2 = null;

var check = new Checkmark(2, function() {
  // both callbacks below have finished executing
  // use result1 and result2
});

asyncFunction1(function(result) {
  // callback for asyncFunction1 has been called
  // ...
  result1 = result;
  check();
});

asyncFunction2(function(result) {
  // callback for asyncFunction2 has been called
  // ...
  result2 = result;
  check();
});
```

#### _Wait for two async functions to complete_
```javascript
var data = [1, 23, 7, 4, 563, ... ];
var middle = data.length / 2;
var data1 = data.slice(0, middle); // first half of data
var data2 = data.slice(middle, data.length); // second half of data

var callback = new Checkmark(2, function() {
  var count = callback.getCalls();
  // count[0] holds the result from the function that completed first
  // count[1] holds the result from the function that completed second

  console.log('Total count:', count[0] + count[1]);
});

// Imagine these execute in different threads
// so that we achieve some parallelization.
// In general, they may take different
// amount of time to complete.
primeCountAsync(data1, callback); // get the number of prime numbers within data1 array
primeCountAsync(data2, callback); // get the number of prime numbers within data2 array

```

#### _Ensure an event does not happen more than N times (with jQuery)_
```javascript
var registerEvent = new Checkmark(3);

$(function() {
  $(".vote-button").on("click", function(event) {
    try {
      registerEvent(event);
      submitVote($(this).data("item-id"));
    } catch (e) {
      showUserNotification("You can vote up to 3 times only.");
    }
  });
});
```

## Contributing
Any feedback or pull requests are welcome.

See `CONTRIBUTING.md` file for more information.

## License and Author
MIT © 2014 [Radko Dinev](https://github.com/radkodinev)

See `LICENSE` file.
