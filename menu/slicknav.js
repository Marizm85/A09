
(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery"], factory);
  } else if (typeof exports === "object") {
    factory(require("jquery"));
  } else {
    factory(jQuery);
  }
})(function($) {
  var methods = {},
    defaults = {
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
    },
    mobileMenu = "slicknav",
    prefix = "slicknav";

  function Plugin(element, options) {
    this.element = element;
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = mobileMenu;
    this.init();
  }

  Plugin.prototype.init = function() {
    var $this = this,
      menu = $(this.element),
      settings = this.settings,
      $menu;

    if (settings.duplicate) {
      $menu = menu.clone();
      $menu.removeAttr("id");
      $menu.find("*").each(function(i, e) {
        var $e = $(e);
        $e.removeAttr("id");
      });
    } else {
      $menu = menu;
    }

    if (settings.removeClasses) {
      $menu.removeAttr("class");
      $menu.find("*").each(function(i, e) {
        $(e).removeAttr("class");
      });
    }

    if (settings.removeIds) {
      $menu.removeAttr("id");
      $menu.find("*").each(function(i, e) {
        $(e).removeAttr("id");
      });
    }

    var $menuBar = $('<div class="' + prefix + '_menu"></div>');
    if (settings.brand !== "") {
      var brand = $('<div class="' + prefix + '_brand">' + settings.brand + "</div>");
      $menuBar.append(brand);
    }

    var icon = $('<a href="#" class="' + prefix + '_btn"><span class="' + prefix + '_menutxt">' + settings.label + '</span><span class="' + prefix + '_icon"><span class="' + prefix + '_icon-bar"></span><span class="' + prefix + '_icon-bar"></span><span class="' + prefix + '_icon-bar"></span></span></a>');
    $menuBar.append(icon);
    $(settings.prependTo).prepend($menuBar);
    $menuBar.append($menu);

    var items = $menu.find("li");

    items.each(function() {
      var item = $(this),
        data = {},
        link = item.find("a").first(),
        subMenu = item.children("ul");

      if (subMenu.length > 0) {
        item.addClass(prefix + "_parent");
        link.after('<a role="button" aria-haspopup="true" tabindex="-1" class="' + prefix + '_arrow">' + settings.closedSymbol + "</a>");
      }
    });

    $menu.find("li a, li ." + prefix + "_arrow").on("click", function(e) {
      var $target = $(this),
        $parent = $target.closest("li");

      if ($target.hasClass(prefix + "_arrow")) {
        e.preventDefault();

        if ($parent.hasClass(prefix + "_open")) {
          $parent.removeClass(prefix + "_open");
          $parent.find("> ul").slideUp(settings.duration, settings.easingClose);
          $target.html(settings.closedSymbol);
          settings.beforeClose();
          settings.afterClose();
        } else {
          $parent.addClass(prefix + "_open");
          $parent.find("> ul").slideDown(settings.duration, settings.easingOpen);
          $target.html(settings.openedSymbol);
          settings.beforeOpen();
          settings.afterOpen();
        }
      } else if (settings.closeOnClick && !$target.hasClass(prefix + "_parent")) {
        $(".slicknav_nav").slideUp(settings.duration, settings.easingClose);
        $(".slicknav_btn").removeClass("slicknav_open");
      }
    });

    $(".slicknav_btn").on("click", function(e) {
      e.preventDefault();

      var $button = $(this);

      if ($button.hasClass("slicknav_open")) {
        $button.removeClass("slicknav_open");
        $(".slicknav_nav").slideUp(settings.duration, settings.easingClose);
        settings.beforeClose();
        settings.afterClose();
      } else {
        $button.addClass("slicknav_open");
        $(".slicknav_nav").slideDown(settings.duration, settings.easingOpen);
        settings.beforeOpen();
        settings.afterOpen();
      }
    });

    $menu.addClass(prefix + "_nav");
    $menu.attr("role", "menu");
    $menu.find("a").attr("role", "menuitem");
  };

  $.fn[mobileMenu] = function(options) {
    return this.each(function() {
      if (!$.data(this, "plugin_" + mobileMenu)) {
        $.data(this, "plugin_" + mobileMenu, new Plugin(this, options));
      }
    });
  };
});
