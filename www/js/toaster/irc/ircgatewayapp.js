(function() {
  var Glue, Gui, LocalStorage, UseCase,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
