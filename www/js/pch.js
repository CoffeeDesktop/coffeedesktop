(function() {
  var Backend, Glue, Gui, LocalStorage, PusherAdapter, Templates, UseCase, description, fullname,
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

  fullname = "Pusher Chat";

  description = "Pusher Chat";

  Templates = (function() {

    function Templates() {}

    Templates.prototype.main = function() {
      return "<form id='nick_form'>    <h2>Pusher Chat</h2><hr>    Choose your nickname: <input type='text' id='nick'> <input type='submit'>    </form>   ";
    };

    Templates.prototype.chat_window = function() {
      return "<table id='chat_window'>    <tr><td class='pusher_chat_title'><h2>Pusher Chat</h2><hr style='margin-top: 0px;margin-bottom: -5px;'></td></tr>    <tr><td><div id='chat'></div></td></tr>    <tr><td class='msg_input_box'><hr style='margin-top: -5px;margin-bottom: 5px;'><form id='msg_input'>    Msg:<input type='text' id='msg'><input type='submit'>    </form>    </td></tr>    </table>";
    };

    return Templates;

  })();

  Backend = (function() {

    function Backend() {}

    Backend.prototype.postData = function(data) {
      return $.post("/coffeedesktop/pch_post", data);
    };

    return Backend;

  })();

  PusherAdapter = (function() {

    PusherAdapter.prototype.update = function(data) {};

    function PusherAdapter(key) {
      var channel, pusher,
        _this = this;
      pusher = new Pusher(key);
      channel = pusher.subscribe('pusher_chat');
      channel.bind('data-changed', function(data) {
        return _this.update(data);
      });
    }

    return PusherAdapter;

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

    function UseCase(gui, backend) {
      this.gui = gui;
      this.backend = backend;
      UseCase.__super__.constructor.apply(this, arguments);
    }

    UseCase.prototype.sendMsg = function(msg) {
      return this.backend.postData({
        'nick': this.nick,
        'msg': 'msg',
        msg: msg
      });
    };

    UseCase.prototype.startChat = function(nick) {
      this.nick = nick;
      return this.gui.setChatWindowContent();
    };

    UseCase.prototype.newMsgReceived = function(data) {
      return this.gui.appendMsg(data.nick, data.msg, data.date);
    };

    return UseCase;

  })(this.UseCaseClass);

  Glue = (function(_super) {

    __extends(Glue, _super);

    function Glue(useCase, gui, storage, app, pusher) {
      var _this = this;
      this.useCase = useCase;
      this.gui = gui;
      this.storage = storage;
      this.app = app;
      this.pusher = pusher;
      Glue.__super__.constructor.apply(this, arguments);
      After(this.gui, 'startChat', function(nick) {
        return _this.useCase.startChat(nick);
      });
      After(this.gui, 'sendMsg', function(msg) {
        return _this.useCase.sendMsg(msg);
      });
      After(this.pusher, 'update', function(data) {
        return _this.useCase.newMsgReceived(data);
      });
    }

    return Glue;

  })(this.GlueClass);

  Gui = (function(_super) {

    __extends(Gui, _super);

    function Gui() {
      return Gui.__super__.constructor.apply(this, arguments);
    }

    Gui.prototype.setChatWindowContent = function() {
      $.updateWindowContent(this.div_id, this.templates.chat_window());
      return this.setChatBindings();
    };

    Gui.prototype.setBindings = function() {
      var _this = this;
      return $("#" + this.div_id + " #nick_form").submit(function() {
        var nick;
        nick = $("#" + _this.div_id + " #nick").val();
        _this.startChat(nick);
        return false;
      });
    };

    Gui.prototype.setChatBindings = function() {
      var msg_element, msg_input,
        _this = this;
      msg_element = this.element.find("#msg_input");
      msg_input = msg_element.find("#msg");
      return msg_element.submit(function() {
        var msg;
        msg = msg_input.val();
        _this.sendMsg(msg);
        msg_input.val("");
        return false;
      });
    };

    Gui.prototype.appendMsg = function(nick, msg, date) {
      return $("#" + this.div_id + " #chat").append("<span><b>" + nick + "</b>(@" + date + "): " + msg + "<hr>");
    };

    Gui.prototype.sendMsg = function(msg) {};

    Gui.prototype.startChat = function(nick) {};

    return Gui;

  })(this.GuiClass);

  this.PusherChatApp = (function() {

    PusherChatApp.fullname = fullname;

    PusherChatApp.description = description;

    PusherChatApp.icon = "xchat.png";

    function PusherChatApp(id) {
      var backend, glue, gui, localStorage, pusher, templates, useCase;
      this.id = id;
      this.fullname = fullname;
      this.description = description;
      pusher = new PusherAdapter('dc82e8733c54f74df8d3');
      templates = new Templates();
      gui = new Gui(templates);
      localStorage = new LocalStorage("CoffeeDesktop");
      backend = new Backend();
      useCase = new UseCase(gui, backend);
      glue = new Glue(useCase, gui, localStorage, this, pusher);
      useCase.start();
    }

    return PusherChatApp;

  })();

  window.pusher_chat = {};

  window.pusher_chat.UseCase = UseCase;

  window.pusher_chat.Gui = Gui;

  window.pusher_chat.Templates = Templates;

  window.pusher_chat.PusherChatApp = PusherChatApp;

  window.CoffeeDesktop.appAdd('pch', this.PusherChatApp);

}).call(this);
