(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.GuiClass = (function() {

    function GuiClass(templates) {
      this.templates = templates;
      this.createWindow = __bind(this.createWindow, this);

    }

    GuiClass.prototype.createWindow = function(title, id) {
      var rand;
      if (title == null) {
        title = false;
      }
      if (id == null) {
        id = false;
      }
      rand = UUIDjs.randomUI48();
      if (!id) {
        id = UUIDjs.randomUI48();
      }
      if (!title) {
        title = "You ARE LAZY";
      }
      this.div_id = id + "-" + rand;
      this.registerWindow(this.div_id);
      $.newWindow({
        id: this.div_id,
        title: title
      });
      $.updateWindowContent(this.div_id, this.templates.main());
      this.element = $("#" + this.div_id);
      return this.setBindings();
    };

    GuiClass.prototype.registerWindow = function(id) {};

    GuiClass.prototype.closeAllWindows = function(windows_array) {
      var _this = this;
      return windows_array.every(function(window) {
        return closeWindow(window);
      });
    };

    GuiClass.prototype.closeWindow = function(window) {
      return $.closeWindow(window);
    };

    GuiClass.prototype.setBindings = function() {};

    return GuiClass;

  })();

}).call(this);
