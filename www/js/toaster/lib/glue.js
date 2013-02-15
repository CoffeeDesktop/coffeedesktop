(function() {

  this.GlueClass = (function() {

    function GlueClass(useCase, gui, storage, app) {
      var _this = this;
      this.useCase = useCase;
      this.gui = gui;
      this.storage = storage;
      this.app = app;
      Before(this.useCase, 'start', function() {
        return _this.gui.createWindow(_this.app.fullname, "main");
      });
      After(this.gui, 'registerWindow', function(id) {
        return _this.useCase.registerWindow(id);
      });
      After(this.useCase, 'closeAllWindows', function(windows) {
        return this.gui.closeWindows(windows);
      });
    }

    return GlueClass;

  })();

}).call(this);
