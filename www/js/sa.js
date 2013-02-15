(function() {
  var Backend, Glue, Gui, LocalStorage, Templates, UseCase,
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

  Templates = (function() {

    function Templates() {}

    Templates.prototype.main = function() {
      return "<div id='tabs'>        <ul>          <li><a href='#tabs-1'>About</a></li>          <li><a href='#tabs-2'>Desktop Icons</a></li>          <li><a href='#tabs-3'>Notifications</a></li>          <li><a href='#tabs-4'>Child windows</a></li>        </ul>        <div id='tabs-1'>          <p>Hi, Welcome to sample application.</p>          <p>You can find here some examples what you can do with CoffeeDesktop!</p>          <p>Checkout other tabs!... NOW!</p>          <p>shoo...shoo go to other tabs and checkout cool features!</p>          </div>        <div id='tabs-2'>          <p>You can create awesome links with coffeedesktop ... just put objects in cart</p>          <p>This is example:</p>          <img src='vendors/icons/app.png' desktop_object_options='' desktop_object_run='sa link' desktop_object_fullname='SA Show hidden' desktop_object_icon='app.png' class=' i_wanna_be_a_desktop_object sa_drag_button'>DRAG THIS ON DESKTOP PLIZ        </div>        <div id='tabs-3'>          <p>You can do shiny awesome notifications with CoffeeDesktop... just puting json to CoffeeDesktop.notes.add(json) and have fun          <p style='text-align:center'><button class='notify_try_button'>TRY ME</button></p>          <p>Also there is notifications about network errors</p>          <p style='text-align:center'><button class='notify_error_try_button'>Send Something stupid</button></p>                 </div>        <div id='tabs-4'>          <p>You can open child windows for application          <p style='text-align:center'><button class='child_try_button'>TRY ME</button></p>          <p>Also application can control child windows</p>          <p style='text-align:center'><button class='close_all_childs_try_button'>Close all child windows</button></p>          <p>You Can even update child windows content<p>           <p style='text-align:center'><button class='update_first_child_try_button'>Update First child</button></p>        </div>    </div>";
    };

    Templates.prototype.secret = function() {
      return "YAY ... you just found secret link    <img src='http://25.media.tumblr.com/tumblr_m9a3bqANob1retw4jo1_500.gif'>";
    };

    Templates.prototype.link = function() {
      return "Yay you are amazing... you just tested creating desktop icons    <img src='http://images.wikia.com/creepypasta/images/3/38/Adventure-time-with-finn-and-jake.jpg'>";
    };

    Templates.prototype.childwindow = function() {
      return "This is childwindow";
    };

    Templates.prototype.updated_child = function() {
      return "<h1>I WAS UPDATED!</h1><br>    The bindings still works    <p style='text-align:center'><button class='updated_child_try_button'>Update First child</button></p>";
    };

    return Templates;

  })();

  Backend = (function() {

    function Backend() {}

    Backend.prototype.stupidPost = function() {
      return $.post("/coffeedesktop/stupid_post");
    };

    return Backend;

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

    function UseCase(gui) {
      this.gui = gui;
      this.start = __bind(this.start, this);

      this.removeWindow = __bind(this.removeWindow, this);

      this.closeAllChildWindows = __bind(this.closeAllChildWindows, this);

      this.windows = [];
    }

    UseCase.prototype.registerWindow = function(id) {
      return this.windows.push(id);
    };

    UseCase.prototype.closeAllChildWindows = function() {
      var _results;
      _results = [];
      while (this.windows.length > 0) {
        _results.push(this.gui.closeWindow(this.windows[0]));
      }
      return _results;
    };

    UseCase.prototype.removeWindow = function(window) {
      if ((this.windows.indexOf(window)) > -1) {
        return this.windows.splice(this.windows.indexOf(window), 1);
      }
    };

    UseCase.prototype.updateFirstChildWindow = function() {
      return this.gui.updateChild(this.windows[0]);
    };

    UseCase.prototype.exitSignal = function() {
      return this.gui.closeMainWindow();
    };

    UseCase.prototype.start = function(args) {
      var options;
      switch (false) {
        case !/secret/i.test(args):
          options = {
            title: 'Secret undiscovered',
            text: 'Someone here discover secret! :D<br>\
            He or She must love adventures!',
            image: 'http://img-cache.cdn.gaiaonline.com/cfc29eb51f1f53134577339fb5af37e9/http://i1063.photobucket.com/albums/t501/TedBenic/Icons/Avatars/CAR_ATM_FINN2.jpg'
          };
          CoffeeDesktop.notes.addNote(options);
          return this.gui.createWindow("Sample Application (secret)", "secret");
        case !/link/i.test(args):
          return this.gui.createWindow("Sample Application link", "link");
        default:
          return this.gui.createWindow("Sample Application", "main");
      }
    };

    return UseCase;

  })(this.UseCaseClass);

  Gui = (function(_super) {

    __extends(Gui, _super);

    function Gui(templates) {
      this.templates = templates;
      this.createWindow = __bind(this.createWindow, this);

    }

    Gui.prototype.createWindow = function(title, template) {
      var div_id, id, rand,
        _this = this;
      if (title == null) {
        title = false;
      }
      if (template == null) {
        template = "main";
      }
      rand = UUIDjs.randomUI48();
      if (!id) {
        id = UUIDjs.randomUI48();
      }
      div_id = id + "-" + rand;
      $.newWindow({
        id: div_id,
        title: title,
        width: 500,
        height: 350
      });
      $.updateWindowContent(div_id, this.templates[template]());
      if (template === "main" | template === "secret") {
        this.div_id = div_id;
        this.element = $("#" + this.div_id);
        $("#" + div_id + " .window-closeButton").click(function() {
          _this.exitApp();
          return _this.closeAllChildWindows();
        });
      } else {
        this.registerWindow(div_id);
        $("#" + div_id + " .window-closeButton").click(function() {
          return _this.removeWindow(div_id);
        });
      }
      return this.setBindings(template, div_id);
    };

    Gui.prototype.closeWindow = function(id) {
      console.log("closing window " + id);
      $.closeWindow(id);
      return this.removeWindow(id);
    };

    Gui.prototype.updateChild = function(id) {
      $.updateWindowContent(id, this.templates.updated_child());
      return this.setBindings('updated_child', id);
    };

    Gui.prototype.setBindings = function(template, div_id) {
      var _this = this;
      if (template === "main") {
        $("#" + div_id + " #tabs").tabs();
        $("#" + div_id + " .sa_drag_button").button();
        $("#" + div_id + " .notify_try_button").click(function() {
          var options;
          options = {
            title: 'Woohoo! You did it!',
            text: 'You just clicked notification testing button!',
            image: 'http://24.media.tumblr.com/avatar_cebb9d5a6d1d_128.png'
          };
          CoffeeDesktop.notes.addNote(options);
          $("#" + div_id + " .window-titleBar-content")[0].innerHTML = "Changed Title too";
          return $("#" + div_id + " .window-titleBar-content").trigger('contentchanged');
        });
        $("#" + div_id + " .notify_error_try_button").click(function() {
          return _this.sendStupidPost();
        });
        $("#" + div_id + " .child_try_button").click(function() {
          return _this.openChildWindow();
        });
        $("#" + div_id + " .close_all_childs_try_button").click(function() {
          return _this.closeAllChildWindows();
        });
        $("#" + div_id + " .update_first_child_try_button").click(function() {
          return _this.updateFirstChildWindow();
        });
        return $("#" + div_id + " .sa_drag_button").draggable({
          helper: "clone",
          revert: "invalid",
          appendTo: 'body',
          start: function() {
            return $(this).css("z-index", 999999999);
          }
        });
      } else if (template === "updated_child") {
        return $("#" + div_id + " .updated_child_try_button").click(function() {
          var options;
          options = {
            title: 'child window',
            text: 'Woohoo bindings still works',
            image: 'http://24.media.tumblr.com/avatar_cebb9d5a6d1d_128.png'
          };
          return CoffeeDesktop.notes.addNote(options);
        });
      }
    };

    Gui.prototype.closeMainWindow = function() {
      return $("#" + this.div_id + " .window-closeButton").click();
    };

    Gui.prototype.openChildWindow = function() {
      return this.createWindow("Child window", "childwindow");
    };

    Gui.prototype.sendStupidPost = function() {};

    Gui.prototype.registerWindow = function(id) {};

    Gui.prototype.closeAllChildWindows = function() {};

    Gui.prototype.updateFirstChildWindow = function() {};

    Gui.prototype.removeWindow = function(id) {};

    Gui.prototype.exitApp = function() {};

    return Gui;

  })(this.GuiClass);

  Glue = (function(_super) {

    __extends(Glue, _super);

    function Glue(useCase, gui, storage, app, backend) {
      var _this = this;
      this.useCase = useCase;
      this.gui = gui;
      this.storage = storage;
      this.app = app;
      this.backend = backend;
      After(this.gui, 'registerWindow', function(id) {
        return _this.useCase.registerWindow(id);
      });
      After(this.gui, 'closeAllChildWindows', function() {
        return _this.useCase.closeAllChildWindows();
      });
      After(this.gui, 'updateFirstChildWindow', function() {
        return _this.useCase.updateFirstChildWindow();
      });
      After(this.gui, 'removeWindow', function(id) {
        return _this.useCase.removeWindow(id);
      });
      After(this.gui, 'sendStupidPost', function() {
        return _this.backend.stupidPost();
      });
      After(this.gui, 'exitApp', function() {
        return _this.app.exitApp();
      });
      After(this.app, 'exitSignal', function() {
        return _this.useCase.exitSignal();
      });
    }

    return Glue;

  })(this.GlueClass);

  this.SampleApp = (function() {
    var description, fullname;

    fullname = "Sample Application";

    description = "Oh ... you just read app description.";

    SampleApp.fullname = fullname;

    SampleApp.description = description;

    SampleApp.prototype.exitSignal = function() {};

    SampleApp.prototype.exitApp = function() {
      return CoffeeDesktop.processKill(this.id);
    };

    SampleApp.prototype.getDivID = function() {
      return this.gui.div_id;
    };

    function SampleApp(id, args) {
      var backend, glue, localStorage, templates, useCase;
      this.id = id;
      if (args) {
        console.log("OH COOL ... I have just recived new shining fucks to take");
      }
      this.fullname = fullname;
      this.description = description;
      templates = new Templates();
      backend = new Backend();
      this.gui = new Gui(templates);
      useCase = new UseCase(this.gui);
      localStorage = new LocalStorage("CoffeeDesktop");
      glue = new Glue(useCase, this.gui, localStorage, this, backend);
      useCase.start(args);
    }

    return SampleApp;

  })();

  window.sa = {};

  window.sa.UseCase = UseCase;

  window.sa.Gui = Gui;

  window.sa.Templates = Templates;

  window.sa.SampleApp = SampleApp;

  window.CoffeeDesktop.appAdd('sa', this.SampleApp, '{"Im not a secret button":"sa secret"}');

}).call(this);
