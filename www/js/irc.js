(function() {
  var Glue, Gui, LocalStorage, UseCase,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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

  this.LocalStorageClass = (function() {

    function LocalStorageClass(namespace) {
      this.namespace = namespace;
      this.flush = __bind(this.flush, this);

      this.remove = __bind(this.remove, this);

      this.get = __bind(this.get, this);

      this.set = __bind(this.set, this);

    }

    LocalStorageClass.prototype.set = function(key, value) {
      console.log(value);
      return $.jStorage.set("" + this.namespace + "/" + key, value);
    };

    LocalStorageClass.prototype.get = function(key) {
      return $.jStorage.get("" + this.namespace + "/" + key);
    };

    LocalStorageClass.prototype.remove = function(key) {
      return $.jStorage.deleteKey("" + this.namespace + "/" + key);
    };

    LocalStorageClass.prototype.flush = function() {
      var key, _i, _len, _ref, _results;
      _ref = $.jStorage.index();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        if (key.match("^" + this.namespace)) {
          _results.push($.jStorage.deleteKey(key));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return LocalStorageClass;

  })();

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

  LocalStorage = (function(_super) {

    __extends(LocalStorage, _super);

    function LocalStorage() {
      return LocalStorage.__super__.constructor.apply(this, arguments);
    }

    return LocalStorage;

  })(this.LocalStorageClass);

  UseCase = (function(_super) {

    __extends(UseCase, _super);

    function UseCase() {
      return UseCase.__super__.constructor.apply(this, arguments);
    }

    return UseCase;

  })(this.UseCaseClass);

  Glue = (function(_super) {

    __extends(Glue, _super);

    function Glue() {
      return Glue.__super__.constructor.apply(this, arguments);
    }

    return Glue;

  })(this.GlueClass);

  Gui = (function(_super) {

    __extends(Gui, _super);

    Gui.prototype.createWindow = function(title, id) {
      var divid, rand;
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
      divid = rand + "-" + id;
      $.newWindow({
        id: divid,
        title: title,
        type: "iframe",
        width: 647,
        height: 400
      });
      return $.updateWindowContent(divid, '<iframe src="http://webchat.freenode.net?channels=CoffeeDesktop&uio=d4" width="647" height="400"></iframe>');
    };

    function Gui() {
      this.createWindow = __bind(this.createWindow, this);

    }

    return Gui;

  })(this.GuiClass);

  this.IrcGatewayApp = (function() {
    var description, fullname;

    fullname = "Irc Gateway";

    description = "Irc Gateway to freenode";

    IrcGatewayApp.icon = "qwebircsmall.png";

    IrcGatewayApp.fullname = fullname;

    IrcGatewayApp.description = description;

    function IrcGatewayApp(id, params) {
      var glue, gui, localStorage, useCase;
      this.id = id;
      this.fullname = fullname;
      this.description = description;
      this.fullname = "Irc Gateway";
      this.description = "Irc Gateway to freenode";
      useCase = new UseCase();
      gui = new Gui();
      localStorage = new LocalStorage("CoffeeDesktop");
      glue = new Glue(useCase, gui, localStorage, this);
      useCase.start();
    }

    return IrcGatewayApp;

  })();

  window.CoffeeDesktop.appAdd('irc', this.IrcGatewayApp);

}).call(this);
