
(function() {
  var Backend, DesktopObject, DesktopProcess, Glue, Gui, LocalStorage, Notes, Request, Templates, UseCase,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty;

  Templates = (function() {

    function Templates() {}

    Templates.prototype.desktop = function() {
      return "<div id='desktop' class='container'>      <div id='loading_box'><h3>Loading CoffeeDesktop..</h3></div>      <form id='run_dialog_form'><input type='text' id='command'></form>      <div id='desktop_icons'></div>      <ul id='dock' style='display:none'>      </ul>    </div>";
    };

    Templates.prototype.list_object = function(tag, label) {
      return "<li><a tabindex='-1' class='option_" + tag + "'>" + label + "</a></li>";
    };

    Templates.prototype.desktop_object = function() {
      return "<div id='desktop_object_{{uuid}}' class='desktop_object' style='left:{{x}}px;top:{{y}}px'>      <img style='width:48px;'' src='vendors/icons/{{img}}'>      <div style='text-align:center'>{{text}}</div>      <ul class='dropdown-menu' role='menu' aria-labelledby='drop2'>        <li><a tabindex='-1' class='run_app_link' href='#'>Run App</a></li>       {{#if options}}        <li class='divider'></li>          {{options}}        {{/if}}                <li class='divider'></li>        <li><a tabindex='-1' class='remove_link'>Remove This link</a></li>      </ul>      </div>             ";
    };

    Templates.prototype.dock_object = function(uuid, icon, fullname, name, options) {
      return "<li ><img  id='app" + uuid + "' src='vendors/icons/" + icon + "' alt='" + fullname + "' title='" + fullname + "' desktop_object_options='" + options + "' desktop_object_run='" + name + "' desktop_object_fullname='" + fullname + "' desktop_object_icon='" + icon + "' class='dockItem i_wanna_be_a_desktop_object dock_app app_" + name + "' />";
    };

    Templates.prototype.dock_drop_up = function() {
      return "<ul class='dropup dropdown-menu' role='menu' aria-labelledby='drop2'>          <li></li>         <li class='divider'></li>         <li><a tabindex='-1' class='run_app_link' href='#'>Open New Instance</a></li>        <li class='divider'></li>        <li><a tabindex='-1' class='close_all_link'>Close All</a></li>      </ul></li>      ";
    };

    return Templates;

  })();

  Request = (function() {

    function Request(ajaxsettings) {
      this.ajaxsettings = ajaxsettings;
    }

    return Request;

  })();

  Backend = (function() {

    function Backend() {
      var _this = this;
      this.requetsqueue = [];
      window.addEventListener('online', function(e) {
        var options;
        options = {
          title: 'Network Notification',
          text: "You are online!",
          image: 'vendors/icons/network-transmit-receive.png'
        };
        return CoffeeDesktop.notes.addNote(options);
      }, false);
      window.addEventListener('offline', function(e) {
        var options;
        options = {
          title: 'Network Notification',
          text: "You are offline",
          image: 'vendors/icons/network-error.png'
        };
        return CoffeeDesktop.notes.addNote(options);
      }, false);
      $(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
        var msg, options, request;
        if (jqXHR.status === 0) {
          msg = 'Not connect.\n Verify Network.';
        } else if (jqXHR.status === 404) {
          msg = 'Requested page not found. [404]';
        } else if (jqXHR.status === 500) {
          msg = 'Internal Server Error [500].';
        } else if (thrownError === 'parsererror') {
          msg = 'Requested JSON parse failed.';
        } else if (thrownError === 'timeout') {
          msg = 'Time out error.';
        } else if (thrownError === 'abort') {
          msg = 'Ajax request aborted.';
        } else {
          msg = 'Uncaught Error.\n' + thrownError;
        }
        options = {
          title: 'Network Notification',
          text: "Can't send post request to " + ajaxSettings.url + ".<br>Error:" + msg,
          image: 'vendors/icons/network-error.png'
        };
        request = new Request(ajaxSettings);
        _this.requetsqueue.push(request);
        return CoffeeDesktop.notes.addNote(options);
      });
    }

    Backend.prototype.fetchApp = function(app) {
      console.log("Fetching app " + app);
      return $.get("www/js/" + app + ".js");
    };

    Backend.prototype.fetchApps = function() {
      var apps,
        _this = this;
      return apps = $.getJSON("vendors/apps.json", function(apps) {
        return apps.every(function(app) {
          return _this.fetchApp(app);
        });
      });
    };

    Backend.prototype.post = function(url, json) {
      var _this = this;
      return $.post(url, json, function(data) {
        return data;
      });
    };

    return Backend;

  })();

  LocalStorage = (function() {

    function LocalStorage(namespace) {
      this.namespace = namespace;
      this.getDesktopObjects = __bind(this.getDesktopObjects, this);

      this.flush = __bind(this.flush, this);

      this.remove = __bind(this.remove, this);

      this.get = __bind(this.get, this);

      this.set = __bind(this.set, this);

    }

    LocalStorage.prototype.set = function(key, value) {
      console.log(value);
      return $.jStorage.set("" + this.namespace + "/" + key, value);
    };

    LocalStorage.prototype.get = function(key) {
      return $.jStorage.get("" + this.namespace + "/" + key);
    };

    LocalStorage.prototype.remove = function(key) {
      return $.jStorage.deleteKey("" + this.namespace + "/" + key);
    };

    LocalStorage.prototype.flush = function() {
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

    LocalStorage.prototype.getDesktopObjects = function() {
      var _this = this;
      if (!this.get("desktop_objects")) {
        return [];
      }
      return this.desktop_objects = this.get("desktop_objects").map(function(DesktopObjectData) {
        var desktop_object;
        desktop_object = new DesktopObject(DesktopObjectData.fullname, DesktopObjectData.icon, DesktopObjectData.run, DesktopObjectData.x, DesktopObjectData.y, DesktopObjectData.uuid, DesktopObjectData.options);
        return desktop_object;
      });
    };

    return LocalStorage;

  })();

  DesktopObject = (function() {

    function DesktopObject(fullname, icon, run, x, y, uuid, options) {
      this.fullname = fullname;
      this.icon = icon;
      this.run = run;
      this.x = x;
      this.y = y;
      this.uuid = uuid;
      this.options = options;
    }

    return DesktopObject;

  })();

  DesktopProcess = (function() {

    function DesktopProcess(id, name, app) {
      this.id = id;
      this.name = name;
      this.app = app;
    }

    return DesktopProcess;

  })();

  UseCase = (function() {

    function UseCase(storage, gui, templates) {
      this.storage = storage;
      this.gui = gui;
      this.templates = templates;
      this.runCommand = __bind(this.runCommand, this);

      this.start = __bind(this.start, this);

      this.desktop_objects = this.storage.getDesktopObjects();
      this.apps = new Array();
      this.app = {};
      this.processes = [];
      this.process_id = 0;
    }

    UseCase.prototype.start = function() {
      var desktop_object, _i, _len, _ref, _results;
      _ref = this.desktop_objects;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        desktop_object = _ref[_i];
        _results.push(this.gui.drawDesktopObject(desktop_object.fullname, desktop_object.icon, desktop_object.run, desktop_object.x, desktop_object.y, desktop_object.uuid, desktop_object.options));
      }
      return _results;
    };

    UseCase.prototype.runCommand = function(app) {
      this.runApp(app);
      return this.gui.hideRunDialog();
    };

    UseCase.prototype.addToDesktop = function(fullname, icon, run, x, y, uuid, options) {
      var desktop_object;
      desktop_object = new DesktopObject(fullname, icon, run, x, y, uuid, options);
      this.desktop_objects.push(desktop_object);
      return this.storage.set('desktop_objects', this.desktop_objects);
    };

    UseCase.prototype.removeDesktopObject = function(uuid) {
      var desktop_object, _i, _len, _ref;
      _ref = this.desktop_objects;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        desktop_object = _ref[_i];
        console.log(desktop_object.uuid);
      }
      if (("" + desktop_object.uuid) === ("" + uuid)) {
        this.desktop_objects.remove(desktop_object);
      }
      return this.storage.set('desktop_objects', this.desktop_objects);
    };

    UseCase.prototype.desktopObjectMove = function(uuid, x, y) {
      var desktop_object, _i, _len, _ref;
      _ref = this.desktop_objects;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        desktop_object = _ref[_i];
        if (("" + desktop_object.uuid) === ("" + uuid)) {
          desktop_object.x = x;
          desktop_object.y = y;
        }
      }
      return this.storage.set('desktop_objects', this.desktop_objects);
    };

    UseCase.prototype.getProcessByID = function(id) {
      var process, _i, _len, _ref;
      _ref = this.processes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        process = _ref[_i];
        if (("" + process.id) === ("" + id)) {
          return process;
        }
      }
    };

    UseCase.prototype.getProcessByName = function(name) {
      var process, _i, _len, _ref;
      _ref = this.processes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        process = _ref[_i];
        if (("" + process.name) === ("" + name)) {
          return process;
        }
      }
    };

    UseCase.prototype.addApp = function(name, app, options) {
      console.log("adding " + name);
      this.app[name] = app;
      return this.apps.add(name);
    };

    UseCase.prototype.runApp = function(app) {
      var args, name, process;
      console.log("starting " + app);
      this.process_id += 1;
      if (app.split(" ").length > 1) {
        console.log("oh cool we have some fucks to give");
        args = app.split(" ");
        name = args.shift();
        process = new this.app[name](this.process_id, args);
      } else {
        process = new this.app[app](this.process_id);
        name = app;
      }
      process = new DesktopProcess(this.process_id, name, process);
      if (!this.getProcessByName(name)) {
        this.gui.appendContextMenu(name);
      }
      this.processes.push(process);
      this.gui.pushAppToAppList(process.app.getDivID(), process.id, name);
      return this.gui.effectAfterRun(name);
    };

    UseCase.prototype.closeAllApps = function(name) {
      var _results;
      _results = [];
      while (this.getProcessByName(name)) {
        _results.push(this.sendSignalToKill(this.getProcessByName(name).id));
      }
      return _results;
    };

    UseCase.prototype.sendSignalToKill = function(id) {
      return this.getProcessByID(id).app.exitSignal();
    };

    UseCase.prototype.killProcess = function(id) {
      var name, process;
      console.log("Killing " + id);
      process = this.getProcessByID(id);
      name = process.name;
      if ((this.processes.indexOf(process)) > -1) {
        this.processes.splice(this.processes.indexOf(process), 1);
      }
      if (!this.getProcessByName(name)) {
        return this.gui.markUnRunningApp(name);
      }
    };

    return UseCase;

  })();

  Glue = (function() {

    function Glue(useCase, gui, storage, backend, app) {
      var _this = this;
      this.useCase = useCase;
      this.gui = gui;
      this.storage = storage;
      this.backend = backend;
      this.app = app;
      Before(this.useCase, 'start', function() {
        return _this.gui.renderDesk();
      });
      Before(this.app, 'appAdd', function(name, app, options) {
        return _this.gui.dockAppend(name, app, options);
      });
      Before(this.backend, 'fetchApp', function(app) {
        return _this.gui.logFetchApp(app);
      });
      Before(this.gui, 'addToDesktop', function(fullname, icon, run, x, y, uuid, options) {
        return _this.useCase.addToDesktop(fullname, icon, run, x, y, uuid, options);
      });
      Before(this.gui, 'removeDesktopObject', function(uuid) {
        return _this.useCase.removeDesktopObject(uuid);
      });
      After(this.gui, 'desktopObjectMoveSync', function(id, x, y) {
        return _this.useCase.desktopObjectMove(id, x, y);
      });
      After(this.gui, 'renderDesk', function() {
        return _this.gui.showLoading();
      });
      After(this.gui, 'renderDesk', function() {
        return _this.gui.setBindings();
      });
      After(this.gui, 'runApp', function(name) {
        return _this.useCase.runApp(name);
      });
      After(this.gui, 'closeAllApps', function(name) {
        return _this.useCase.closeAllApps(name);
      });
      After(this.useCase, 'start', function() {
        return _this.backend.fetchApps();
      });
      After(this.gui, 'runCommand', function(app) {
        return _this.useCase.runCommand(app);
      });
      After(this.backend, 'fetchApps', function() {
        return _this.gui.hideLoading();
      });
      After(this.app, 'appAdd', function(name, app, options) {
        return _this.useCase.addApp(name, app, options);
      });
      After(this.app, 'appRun', function(app) {
        return _this.useCase.runApp(app);
      });
      After(this.app, 'processKill', function(id) {
        return _this.useCase.killProcess(id);
      });
      LogAll(this.useCase);
      LogAll(this.gui);
    }

    return Glue;

  })();

  Gui = (function() {

    function Gui(templates) {
      this.templates = templates;
    }

    Gui.prototype.showLoading = function() {
      return $("#loading_box").fadeIn();
    };

    Gui.prototype.hideLoading = function() {
      return $("#loading_box").fadeOut();
    };

    Gui.prototype.logLoading = function(msg) {
      return $("#loading_box").append("<li>" + msg + "</li>");
    };

    Gui.prototype.logFetchApp = function(app) {
      return this.logLoading("Fetching app: " + app);
    };

    Gui.prototype.showRunDialog = function() {
      $("#run_dialog_form").fadeIn();
      return $("#command").focus();
    };

    Gui.prototype.hideRunDialog = function() {
      return $("#run_dialog_form").fadeOut();
    };

    Gui.prototype.dockStart = function() {
      return $('#dock').jqDock(window.CoffeeDesktop.dock_settings);
    };

    Gui.prototype.desktopObjectMove = function(e, ui) {
      var id, x, y;
      x = ui.position.left;
      y = ui.position.top;
      id = ui.helper[0].id.split("desktop_object_")[1];
      return this.desktopObjectMoveSync(id, x, y);
    };

    Gui.prototype.drawDesktopObject = function(fullname, icon, run, x, y, uuid, options) {
      var data, option, options_html, template, _i, _j, _len, _len1, _ref, _ref1,
        _this = this;
      options_html = false;
      if (options) {
        options_html = "";
        options = eval("(" + options + ")");
        _ref = Object.keys(options);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          option = _ref[_i];
          options_html = options_html.concat(this.templates.list_object(option.replace(/\s+/g, '_'), option));
        }
        options_html = new Handlebars.SafeString(options_html);
      }
      template = Handlebars.compile(this.templates.desktop_object());
      data = {
        img: icon,
        text: fullname,
        x: x,
        y: y,
        uuid: uuid,
        options: options_html
      };
      $(template(data)).appendTo("#desktop_icons").draggable({
        stop: function(e, u) {
          return _this.desktopObjectMove(e, u);
        }
      }).dblclick(function() {
        return _this.runCommand(run);
      }).bind("contextmenu", function() {
        return $(this).find('.dropdown-menu').show(1, function() {
          return $(this).addClass('popup');
        });
      });
      if (options) {
        _ref1 = Object.keys(options);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          option = _ref1[_j];
          $("#desktop_object_" + uuid + " .option_" + option.replace(/\s+/g, '_')).click(function() {
            return _this.runCommand(options[option]);
          });
        }
      }
      $("#desktop_object_" + uuid + " .run_app_link").click(function() {
        return _this.runCommand(run);
      });
      return $("#desktop_object_" + uuid + " .remove_link").click(function() {
        return _this.removeDesktopObject(uuid);
      });
    };

    Gui.prototype.setBindings = function() {
      var _this = this;
      console.log("setting bindings");
      this.logLoading("setting bindings");
      $("#desktop_icons").droppable({
        drop: function(event, ui) {
          var element, fullname, icon, options, run, uuid, x, y;
          uuid = UUIDjs.randomUI48();
          element = ui.draggable[0];
          fullname = element.getAttribute('desktop_object_fullname');
          icon = element.getAttribute('desktop_object_icon');
          run = element.getAttribute('desktop_object_run');
          options = element.getAttribute('desktop_object_options');
          x = event.clientX;
          y = event.clientY;
          return _this.addToDesktop(fullname, icon, run, x, y, uuid, options);
        },
        accept: ".i_wanna_be_a_desktop_object"
      });
      $(document).bind('keydown', 'alt+r', this.showRunDialog);
      return $('#run_dialog_form').submit(function() {
        var app;
        app = $("#command").val();
        $("#command").val("");
        _this.runCommand(app);
        $('#command').blur();
        return false;
      });
    };

    Gui.prototype.dockAppend = function(name, app, options) {
      var html, icon, uuid,
        _this = this;
      uuid = UUIDjs.randomUI48();
      icon = app.icon;
      if (!icon) {
        icon = "app.png";
      }
      if (!options) {
        options = "";
      }
      html = this.templates.dock_object(uuid, icon, app.fullname, name, options);
      $('#dock').jqDock('destroy');
      $('#dock').append(html);
      $('.dock_app').draggable({
        helper: "clone",
        revert: "invalid"
      });
      $('#dock').jqDock(window.CoffeeDesktop.dock_settings);
      return $("#app" + uuid).click(function() {
        return _this.runCommand(name);
      });
    };

    Gui.prototype.renderDesk = function() {
      var _this = this;
      window.oncontextmenu = function() {
        $(".popup").hide().removeClass('popup');
        return false;
      };
      window.onclick = function() {
        return $(".popup").hide().removeClass('popup');
      };
      return $(CoffeeDesktop_element).append(this.templates.desktop());
    };

    Gui.prototype.removeDesktopObject = function(uuid) {
      return $("#desktop_object_" + uuid).remove();
    };

    Gui.prototype.appendContextMenu = function(name) {
      var element,
        _this = this;
      element = $(this.templates.dock_drop_up()).appendTo($(".app_" + name).parent());
      element.find(".run_app_link").click(function() {
        return _this.runApp(name);
      });
      element.find(".close_all_link").click(function() {
        return _this.closeAllApps(name);
      });
      $(".app_" + name).addClass('running_app');
      return $(".app_" + name).bind("contextmenu", function() {
        return $(this).parent().find('.dropdown-menu').show(1, function() {
          return $(this).addClass('popup');
        });
      });
    };

    Gui.prototype.pushAppToAppList = function(div_id, id, name) {
      var title,
        _this = this;
      title = $("#" + div_id + " .window-titleBar-content")[0].innerHTML;
      $("#" + div_id + " .window-titleBar-content").bind('contentchanged', function() {
        title = $("#" + div_id + " .window-titleBar-content")[0].innerHTML;
        return $("#process_title_" + id)[0].innerHTML = title;
      });
      return $("<li><a id='process_title_" + id + "' tabindex='-1' class='run_app_link' href='#'>" + id + " - " + title + "</a></li>").appendTo($($(".app_" + name).parent().find(".dropup .divider")[0]).prev()).click(function() {
        return $.minimizeWindow(div_id);
      });
    };

    Gui.prototype.effectAfterRun = function(name) {
      return $(".app_" + name).effect("bounce", {
        times: 3
      }, 500);
    };

    Gui.prototype.markUnRunningApp = function(name) {
      $(".app_" + name).parent().find('.dropdown-menu').remove();
      return $(".app_" + name).removeClass('running_app');
    };

    Gui.prototype.desktopObjectMoveSync = function(id, x, y) {};

    Gui.prototype.runApp = function(name) {};

    Gui.prototype.closeAllApps = function(name) {};

    Gui.prototype.runCommand = function(cmd) {};

    Gui.prototype.addToDesktop = function(fullname, icon, run, x, y, uuid, options) {
      return this.drawDesktopObject(fullname, icon, run, x, y, uuid, options);
    };

    return Gui;

  })();

  Notes = (function() {

    function Notes() {
      this.notes = [];
    }

    Notes.prototype.addNote = function(options) {
      var unique_id;
      return unique_id = $.gritter.add(options);
    };

    return Notes;

  })();

  this.CoffeeDesktopApp = (function() {
    var state;

    state = "online";

    CoffeeDesktopApp.prototype.getState = function() {
      return state;
    };

    CoffeeDesktopApp.prototype.setState = function(i) {
      if (i) {
        return state = "offline";
      } else {
        return state = "online";
      }
    };

    CoffeeDesktopApp.prototype.appAdd = function(name, app, options) {};

    CoffeeDesktopApp.prototype.appRun = function(app) {};

    CoffeeDesktopApp.prototype.processKill = function(id) {};

    function CoffeeDesktopApp(element) {
      var glue, gui, localStorage, templates, useCase;
      this.element = element != null ? element : "body";
      this.dock_settings = {
        labels: 'tc'
      };
      this.notes = new Notes();
      templates = new Templates();
      localStorage = new LocalStorage("CoffeeDesktop");
      gui = new Gui(templates);
      useCase = new UseCase(localStorage, gui, templates);
      templates = new Templates();
      this.backend = new Backend();
      glue = new Glue(useCase, gui, localStorage, this.backend, this);
      useCase.start();
    }

    return CoffeeDesktopApp;

  })();

  window.coffeedesktop = {};

  window.coffeedesktop.UseCase = UseCase;

  window.coffeedesktop.Gui = Gui;

  window.coffeedesktop.Templates = Templates;

  window.coffeedesktop.DesktopObject = DesktopObject;

  window.coffeedesktop.CoffeeDesktopApp = CoffeeDesktopApp;

  jQuery.extend({
    CoffeeDesktop: CoffeeDesktopApp
  });

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

  _.defaults(this, {
    Before: function(object, methodName, adviseMethod) {
      return YouAreDaBomb(object, methodName).before(adviseMethod);
    },
    BeforeAnyCallback: function(object, methodName, adviseMethod) {
      return YouAreDaBomb(object, methodName).beforeAnyCallback(adviseMethod);
    },
    After: function(object, methodName, adviseMethod) {
      return YouAreDaBomb(object, methodName).after(adviseMethod);
    },
    Around: function(object, methodName, adviseMethod) {
      return YouAreDaBomb(object, methodName).around(adviseMethod);
    },
    AfterAll: function(object, methodNames, adviseMethod) {
      var methodName, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = methodNames.length; _i < _len; _i++) {
        methodName = methodNames[_i];
        _results.push(After(object, methodName, adviseMethod));
      }
      return _results;
    },
    LogAll: function(object) {
      var key, value, _results;
      _results = [];
      for (key in object) {
        if (!__hasProp.call(object, key)) continue;
        value = object[key];
        if (_.isFunction(value)) {
          _results.push((function(key) {
            return Before(object, key, function() {
              return console.log("calling: " + key);
            });
          })(key));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    AutoBind: function(gui, useCase) {
      var key, value, _results;
      _results = [];
      for (key in gui) {
        value = gui[key];
        if (_.isFunction(value)) {
          _results.push((function(key) {
            if (key.endsWith("Clicked") && useCase[key.remove("Clicked")]) {
              return After(gui, key, function(args) {
                return useCase[key.remove("Clicked")](args);
              });
            }
          })(key));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  });

}).call(this);
