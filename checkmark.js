/*
 * checkmark
 *
 * Copyright (c) 2014 Radko Dinev <radko.dinev@gmail.com> (https://github.com/radkodinev)
 * Licensed under the MIT license
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // For CommonJS-like environments that support module.exports, e.g. Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.Checkmark = factory();
  }
}(this, function() {

  return function ctr(targetCount, callback) {
    if (typeof targetCount !== "number") {
      throw new Error("First argument is expected to be a positive integer number");
    }
    if (typeof callback === "undefined") {
      callback = function() {};
    }
    if (typeof callback !== "function") {
      throw new Error("Second argument, when given, is expected to be a callback function");
    }

    var invocations = [];

    var check = function check(data) {
      if (invocations.length === targetCount) {
        throw new Error("Target count " + targetCount + " has already been reached");
      }

      if (typeof data === "undefined") {
        data = null;
      }
      invocations.push(data);

      if (invocations.length === targetCount) {
        callback();
      }
    };

    check.getCalls = function getCalls() {
      return invocations;
    };

    check.getCount = function getCount() {
      return invocations.length;
    };

    return check;
  };

}));
