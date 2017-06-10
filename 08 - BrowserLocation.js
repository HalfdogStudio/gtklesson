#!/usr/bin/env gjs
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;
const WebKit2 = imports.gi.WebKit2;

/*
- Gtk.Entry
- notify::
*/

Gtk.init(null);

const HOME_PAGE = "http://www.duckduckgo.com"

const BrowserWindow = new Lang.Class({
    Name: 'BrowserWindow',
    Extends: Gtk.ApplicationWindow,

    _init: function() {
        this.parent();

        const titlebar = new Gtk.HeaderBar();
        titlebar.set_show_close_button(true);

        this._urientry = new Gtk.Entry();
        this._urientry.hexpand = true;
        this._urientry.set_size_request(300, -1);
        this._urientry.set_text(HOME_PAGE);
        this._urientry.connect('activate', Lang.bind(this, this._urientryOnActivated));
        titlebar.set_custom_title(this._urientry);
        this.set_titlebar(titlebar);

        this._webview = new WebKit2.WebView();
        this._webview.load_uri(HOME_PAGE);
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
        print('ss', signalSender);
        print('pv', propertyValue);
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
})

const browser = new Browser();
Gtk.main();
