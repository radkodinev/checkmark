var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

var Checkmark = require("..");

// a little helper to DRY some code
var expectCounterToBecome = function(checkFunction, expectedCount) {
  expect(checkFunction.getCount()).to.equal(expectedCount - 1);
  checkFunction();
  expect(checkFunction.getCount()).to.equal(expectedCount);
};

var noop = function() {};

describe("Checkmark", function() {

  it("constructor exists", function() {
    expect(Checkmark)
      .to.exist
      .and.be.a("function");
  });

  it("constructor throws an error when first argument not a number", function() {
    var errorMessage = "First argument is expected to be a positive integer number";

    // call with no first argument
    expect(Checkmark)
      .to.throw(Error, errorMessage);

    // call with a non-number first argument
    expect(Checkmark.bind(null, "some_string"))
      .to.throw(Error, errorMessage);
  });

  it("constructor throws an error when second argument not a function", function() {
    var errorMessage = "Second argument, when given, is expected to be a callback function";

    // call with a non-function second argument
    expect(Checkmark.bind(null, 1, "some_string"))
      .to.throw(Error, errorMessage);
  });

  it("constructor can successfully instantiate with count argument", function() {
    expect(Checkmark.bind(null, 1))
      .to.not.throw()
      .and.be.a("function");
  });

  it("constructor can successfully instantiate with count and callback arguments", function() {
    expect(Checkmark.bind(null, 1, noop))
      .to.not.throw()
      .and.be.a("function");
  });

  it("getCount function returns current count", function() {
    var check = new Checkmark(2, noop);

    expect(check.getCount()).to.equal(0);
    check();
    expect(check.getCount()).to.equal(1);
    check();
    expect(check.getCount()).to.equal(2);
  });

  it("invokes the provided callback (once)", function() {
    var callback = sinon.spy();
    var check = new Checkmark(1, callback);

    check();
    expect(callback).to.have.been.calledOnce;
  });

  it("invokes the provided callback after the specified amount of check calls", function() {
    var callback = sinon.spy();
    var check = sinon.spy(new Checkmark(2, callback));

    expectCounterToBecome(check, 1);
    expect(check).to.have.been.calledOnce;
    expect(callback).to.not.have.been.called;

    expectCounterToBecome(check, 2);
    expect(check).to.have.been.calledTwice;
    expect(callback)
      .to.have.been.calledOnce
      .and.calledAfter(check);
  });

  it("constructor creates completely independent instances", function() {
    var callback1 = sinon.spy();
    var callback2 = sinon.spy();

    var check1 = new Checkmark(2, callback1);
    var check2 = new Checkmark(3, callback2);

    expectCounterToBecome(check1, 1);
    expectCounterToBecome(check2, 1);
    expectCounterToBecome(check2, 2);
    expect(callback1).to.not.have.been.called;
    expect(callback2).to.not.have.been.called;
    expectCounterToBecome(check1, 2);
    expect(callback1).to.have.been.calledOnce;
    expect(callback2).to.not.have.been.called;
    expectCounterToBecome(check2, 3);
    expect(callback1).to.have.been.calledOnce;
    expect(callback2).to.have.been.calledOnce;
  });

  it("throws when check function gets called after the target count has already been reached", function() {
    var targetCount = 2;
    var check = new Checkmark(targetCount, noop);

    check();
    check();
    expect(check).to.throw(Error, "Target count " + targetCount + " has already been reached");
    expect(check.getCount()).to.equal(targetCount);
  });

});
