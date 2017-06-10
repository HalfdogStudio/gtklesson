#!/usr/bin/env gjs
const Gtk = imports.gi.Gtk;
const WebKit2 = imports.gi.WebKit2;
const Lang = imports.lang;


/*
- Container pack end/start
- lambda functions, convenience needed for non-static functions or functions with
  parameters.
- linked css class
*/

Gtk.init(null);

const HOME_PAGE = 'http://www.duckduckgo.com';

const BrowserWindow = new Lang.Class({
    Name: 'BrowserWindow',
    Extends: Gtk.ApplicationWindow,

    _init: function() {
        this.parent();
        this.set_size_request(750, 600);

        const titlebar = new Gtk.HeaderBar();
        titlebar.set_show_close_button(true);

        const backbutton = Gtk.Button.new_from_icon_name('go-previous-symbolic', Gtk.IconSize.MENU);
        // No Lang.Bind magic needed
        backbutton.connect('clicked', () => this._webview.go_back())
        const forwardbutton = Gtk.Button.new_from_icon_name('go-next-symbolic', Gtk.IconSize.MENU);
        forwardbutton.connect('clicked', () => this._webview.go_forward());

        const buttonbox = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL, 
            spacing: 0
        });
        buttonbox.add(backbutton);
        buttonbox.add(forwardbutton);
        titlebar.pack_start(buttonbox);
        buttonbox.get_style_context().add_class('linked');

        this._urientry = new Gtk.Entry();
        this._urientry.set_size_request(30, -1);
        this._urientry.set_text(HOME_PAGE);
        this._urientry.connect('activate', Lang.bind(this, this._urientryOnActivated));
        titlebar.set_custom_title(this._urientry);

        this.set_titlebar(titlebar);
        this._webview = new WebKit2.WebView();
        this._webview.load_uri(HOME_PAGE);
        this.set_titlebar(titlebar);
        // "notify::" signals names are emitted for every change in a property.
        // This is based on GObject
        this._webview.connect('notify::uri', Lang.bind(this, this._webviewOnUriChanged));
        this.add(this._webview);

        this.show_all();
    },

    _urientryOnActivated: function() {
        const uri = this._urientry.get_text();
        this._webview.load_uri(uri);
    },

    _webviewOnUriChanged: function(signalSender, propertyValue) {
        // property value using gi data structures
        this._urientry.set_text(this._webview.uri);
    }
});


const Browser = new Lang.Class({
    Name: 'Browser',
    Extends: Gtk.Application,

    _init: function() {
        this.parent();
        this._browserwindow = new BrowserWindow();
        this._browserwindow.connect('delete-event', Gtk.main_quit);
    }
});


const app = new Browser();

Gtk.main();
