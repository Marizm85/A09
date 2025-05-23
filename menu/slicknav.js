(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery"], factory);
  } else if (typeof exports === "object") {
    factory(require("jquery"));
  } else {
    factory(jQuery);
  }
})(function($) {
  var defaults = {
    label: "MENU",
    duplicate: true,
    duration: 200,
    easingOpen: "swing",
    easingClose: "swing",
    closedSymbol: "►",
    openedSymbol: "▼",
    prependTo: "body",
    parentTag: "a",
    closeOnClick: false,
    allowParentLinks: false,
    nestedParentLinks: true,
    showChildren: false,
    removeIds: false,
    removeClasses: false,
    brand: "",
    init: function() {},
    beforeOpen: function() {},
    beforeClose: function() {},
    afterOpen: function() {},
    afterClose: function() {}
  };

  var SlickNav = function(element, options) {
    var self = this;
    self.settings = $.extend({}, defaults, options);
    self._defaults = defaults;
    self._name = "slicknav";
    self.init(element);
  };

  SlickNav.prototype.init = function(element) {
    var self = this;
    var settings = self.settings;

    var menu = $(element);

    if (settings.duplicate) {
      self.mobileNav = menu.clone();
      self.mobileNav.removeAttr("id");
      self.mobileNav.find("*").each(function(i, e) {
        var $e = $(e);
        $e.removeAttr("id");
      });
    } else {
      self.mobileNav = menu;
    }

    if (settings.removeClasses) {
      self.mobileNav.removeAttr("class");
      self.mobileNav.find("*").each(function(i, e) {
        $(e).removeAttr("class");
      });
    }

    if (settings.removeIds) {
      self.mobileNav.removeAttr("id");
      self.mobileNav.find("*").each(function(i, e) {
        $(e).removeAttr("id");
      });
    }

    var iconClass = "slicknav_icon";
    var menuBar = $('<div class="slicknav_menu"></div>');
    if (settings.brand !== "") {
      var brand = $('<div class="slicknav_brand">' + settings.brand + "</div>");
      menuBar.append(brand);
    }
    self.btn = $('<a href="#" aria-haspopup="true" role="button" tabindex="0" class="slicknav_btn"><span class="slicknav_menutxt">' + settings.label + '</span><span class="' + iconClass + '"><span class="slicknav_icon-bar"></span><span class="slicknav_icon-bar"></span><span class="slicknav_icon-bar"></span></span></a>');
    menuBar.append(self.btn);
    $(settings.prependTo).prepend(menuBar);
    menuBar.append(self.mobileNav);

    var items = self.mobileNav.find("li");

    items.each(function() {
      var item = $(this);
      var link = item.find("a").first();
      var subMenu = item.children("ul");

      if (subMenu.length > 0) {
        item.addClass("slicknav_parent");
        var arrow = $('<a role="menuitem" aria-haspopup="true" tabindex="-1" class="slicknav_arrow">' + settings.closedSymbol + "</a>");
        if (settings.parentTag == "a") {
          link.after(arrow);
        } else {
          item.children(settings.parentTag).append(arrow);
        }

        if (!settings.showChildren) {
          subMenu.hide();
        }

        arrow.on("click", function(e) {
          e.preventDefault();
          if (item.hasClass("slicknav_open")) {
            item.removeClass("slicknav_open");
            subMenu.slideUp(settings.duration, settings.easingClose);
            arrow.html(settings.closedSymbol);
            settings.beforeClose(item);
            settings.afterClose(item);
          } else {
            item.addClass("slicknav_open");
            subMenu.slideDown(settings.duration, settings.easingOpen);
            arrow.html(settings.openedSymbol);
            settings.beforeOpen(item);
            settings.afterOpen(item);
          }
        });
      }
    });

    self.mobileNav.attr("role", "menu");
    self.mobileNav.find("a").attr("role", "menuitem");

    self.btn.on("click", function(e) {
      e.preventDefault();
      if (self.btn.hasClass("slicknav_open")) {
        self.btn.removeClass("slicknav_open");
        self.mobileNav.slideUp(settings.duration, settings.easingClose);
        settings.beforeClose(self.mobileNav);
        settings.afterClose(self.mobileNav);
      } else {
        self.btn.addClass("slicknav_open");
        self.mobileNav.slideDown(settings.duration, settings.easingOpen);
        settings.beforeOpen(self.mobileNav);
        settings.afterOpen(self.mobileNav);
      }
    });

    if (settings.closeOnClick) {
      self.mobileNav.find("a").on("click", function() {
        self.mobileNav.slideUp(settings.duration, settings.easingClose);
        self.btn.removeClass("slicknav_open");
      });
    }

    settings.init();
  };

  $.fn.slicknav = function(options) {
    return this.each(function() {
      if (!$.data(this, "plugin_slicknav")) {
        $.data(this, "plugin_slicknav", new SlickNav(this, options));
      }
    });
  };
});
