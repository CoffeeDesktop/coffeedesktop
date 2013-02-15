(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.UseCaseClass = (function() {

    function UseCaseClass() {
      this.start = __bind(this.start, this);
      this.windows = [];
    }

    UseCaseClass.prototype.start = function() {};

    UseCaseClass.prototype.registerWindow = function(id) {
      return this.windows.add(id);
    };

    UseCaseClass.prototype.exit = function() {
      return closeAllWindows(this.windows);
    };

    UseCaseClass.prototype.closeAllWindows = function(windows) {};

    return UseCaseClass;

  })();

}).call(this);
