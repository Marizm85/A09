(function ($, document, window) {
    var defaults = {
        label: 'MENU',
        duplicate: true,
        duration: 200,
        easingOpen: 'swing',
        easingClose: 'swing',
        closedSymbol: '&#9658;',
        openedSymbol: '&#9660;',
        prependTo: 'body',
        appendTo: '',
        parentTag: 'a',
        closeOnClick: false,
        allowParentLinks: false,
        nestedParentLinks: true,
        showChildren: false,
        removeIds: true,
        removeClasses: false,
        removeStyles: false,
        brand: '',
        animations: 'jquery',
        init: function () {},
        beforeOpen: function () {},
        beforeClose: function () {},
        afterOpen: function () {},
        afterClose: function () {}
    },
    mobileMenu = 'slicknav',
    prefix = 'slicknav';

    Keyboard = {
        DOWN: 40,
        ENTER: 13,
        ESCAPE: 27,
        LEFT: 37,
        RIGHT: 39,
        SPACE: 32,
        TAB: 9,
        UP: 38,
    };

    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        if (!this.settings.duplicate && !options.hasOwnProperty("removeIds")) {
            this.settings.removeIds = false;
        }
        this._defaults = defaults;
        this._name = mobileMenu;
        this.init();
    }

    Plugin.prototype.init = function () {
        var $this = this,
            menu = $(this.element),
            settings = this.settings,
            iconClass,
            menuBar;

        if (settings.duplicate) {
            $this.mobileNav = menu.clone();
        } else {
            $this.mobileNav = menu;
        }

        if (settings.removeIds) {
            $this.mobileNav.removeAttr('id');
            $this.mobileNav.find('*').each(function (i, e) {
                $(e).removeAttr('id');
            });
        }

        if (settings.removeClasses) {
            $this.mobileNav.removeAttr('class');
            $this.mobileNav.find('*').each(function (i, e) {
                $(e).removeAttr('class');
            });
        }

        if (settings.removeStyles) {
            $this.mobileNav.removeAttr('style');
            $this.mobileNav.find('*').each(function (i, e) {
                $(e).removeAttr('style');
            });
        }

        iconClass = prefix + '_icon';

        if (settings.label === '') {
            iconClass += ' ' + prefix + '_no-text';
        }

        if (settings.parentTag == 'a') {
            settings.parentTag = 'a href="#"';
        }

        $this.mobileNav.attr('class', prefix + '_nav');
        menuBar = $('<div class="' + prefix + '_menu"></div>');
        if (settings.brand !== '') {
            var brand = $('<div class="' + prefix + '_brand">'+settings.brand+'</div>');
            $(menuBar).append(brand);
        }
        $this.btn = $(
            ['<' + settings.parentTag + ' aria-haspopup="true" role="button" tabindex="0" class="' + prefix + '_btn ' + prefix + '_collapsed">',
                '<span class="' + prefix + '_menutxt">' + settings.label + '</span>',
                '<span class="' + iconClass + '">',
                    '<span class="' + prefix + '_icon-bar"></span>',
                    '<span class="' + prefix + '_icon-bar"></span>',
                    '<span class="' + prefix + '_icon-bar"></span>',
                '</span>',
            '</' + settings.parentTag + '>'
            ].join('')
        );
        $(menuBar).append($this.btn);
        if(settings.appendTo !== '') {
            $(settings.appendTo).append(menuBar);
        } else {
            $(settings.prependTo).prepend(menuBar);
        }
        menuBar.append($this.mobileNav);
    };

    $.fn[mobileMenu] = function ( options ) {
        var args = arguments;
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, 'plugin_' + mobileMenu)) {
                    $.data(this, 'plugin_' + mobileMenu, new Plugin( this, options ));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            var returns;
            this.each(function () {
                var instance = $.data(this, 'plugin_' + mobileMenu);
                if (instance instanceof Plugin && typeof instance[options] === 'function') {
                    returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                }
            });
            return returns !== undefined ? returns : this;
        }
    };
}(jQuery, document, window));
