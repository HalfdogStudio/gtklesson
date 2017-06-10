#!/usr/bin/env gjs
const Gtk = imports.gi.Gtk;
const WebKit2 = imports.gi.WebKit2;
const Lang = imports.lang;

/*
- Gtk.Application
- Header bar, Client Side Decorations vs Server Side Decorations
- WebKit and WebKitView as gtk+ interface
*/

Gtk.init(null);

const HOME_PAGE = "http://www.duckduckgo.com"

const BrowserWindow = new Lang.Class({
    Name: 'BrowserWindow',
    Extends: Gtk.ApplicationWindow,

    _init: function() {
        this.parent();
        this.set_size_request(750, 600);

        const titlebar = new Gtk.HeaderBar();
        titlebar.set_show_close_button(true);
        this.set_titlebar(titlebar);

        this._webview = new WebKit2.WebView();
        this._webview.load_uri(HOME_PAGE);
        this.add(this._webview);

        this.show_all();
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
