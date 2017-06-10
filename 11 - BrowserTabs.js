#!/usr/bin/env gjs
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;
const WebKit2 = imports.gi.WebKit2;

/*
- Notebook
- Widget ownership
- Custom signals (not explained here) vs public API
*/
Gtk.init(null);

const HOME_PAGE = 'http://www.duckduckgo.com';


const BrowserTab = new Lang.Class({
    Name: 'BrowserTab',
    Extends: Gtk.Grid,

    _init: function(browser) {
        this.parent({
            orientation: Gtk.Orientation.VERTICAL
        });

        this._parent = browser; // browser window
        this._webview = new WebKit2.WebView();
        this._webview.load_uri(HOME_PAGE);
        // "notify::" signals names are emitted for every change in a property.
        // This is based on GObject
        this._webview.connect('notify::uri', Lang.bind(this, this._webviewOnUriChanged));
        this._webview.connect('notify::title', Lang.bind(this, this._webviewOnTitleChanged));
        
        this._webview.expand = true;
        this._webview.fill = true;
        this.attach(this._webview, 0, 0, 1, 1);
        this.show_all();
    },

    _webviewOnUriChanged: function() {
        this._parent.tabOnUriChanged(this, this._webview.uri);
    },

    _webviewOnTitleChanged: function() {
        this._parent.tabOnTitleChanged(this, this._webview.title);
    },

    loadUri: function(uri) {
        this._webview.load_uri(uri);
    },

    getUri: function(uri) {
        return this._webview.uri;
    },

    goBack: function() {
        this._webview.go_back();
    },

    goForward: function() {
        this._webview.go_forward();
    }
});


const BrowserWindow = new Lang.Class({
    Name: 'BrowserWindow',
    Extends: Gtk.ApplicationWindow,

    _init: function() {
        this.parent();
        this.set_size_request(750, 600);

        const titlebar = new Gtk.HeaderBar();
        titlebar.set_show_close_button(true);

        const backbutton = Gtk.Button.new_from_icon_name('go-previous-symbolic', Gtk.IconSize.MENU);
        backbutton.connect('clicked', _ => this._getCurrentTab().goBack());
        const forwardbutton = Gtk.Button.new_from_icon_name('go-next-symbolic', Gtk.IconSize.MENU);
        forwardbutton.connect('clicked', _ => this._getCurrentTab().goForward());
        const buttonbox = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 0
        });
        buttonbox.add(backbutton);
        buttonbox.add(forwardbutton);
        buttonbox.get_style_context().add_class('linked');

        const newtabbutton = Gtk.Button.new_from_icon_name('tab-new-symbolic', Gtk.IconSize.MENU);
        newtabbutton.connect('clicked', _ => this._createTab());


        this._urientry = new Gtk.Entry();
        this._urientry.set_size_request(300, -1);
        this._urientry.hexpand = true;
        this._urientry.set_text(HOME_PAGE);
        this._urientry.connect('activate', Lang.bind(this, this._urientryOnActivated));

        this._notebook = new Gtk.Notebook();
        this._notebook.connect('switch-page', Lang.bind(this, this._notebookOnSwitchPage));

        titlebar.pack_start(buttonbox);
        titlebar.pack_end(newtabbutton);
        titlebar.set_custom_title(this._urientry);
        this.set_titlebar(titlebar);
        this.add(this._notebook);

        this._createTab();
        this.show_all();
    },

    _urientryOnActivated: function() {
        const uri = this._urientry.get_text();
        const currenttab = this._notebook.get_nth_page(this._notebook.get_current_page());
        currenttab.loadUri(uri);
    },

    _notebookOnSwitchPage: function(notebook, current_page/*page*/, pagenum) {
        this._urientry.set_text(current_page.getUri())
    },

    _getCurrentTab: function() {
        return this._notebook.get_nth_page(this._notebook.get_current_page());
    },

    _createTab: function() {
        // It's not just text because we would want to add markup too
        const tab = new BrowserTab(this);
        const titlewidget = new Gtk.Label({ label: 'Loading…'});
        titlewidget.hexpand = true;
        this._notebook.append_page(tab, titlewidget);
        this._notebook.set_current_page(this._notebook.get_n_pages() - 1)
    },

    tabOnUriChanged: function(tab, uri) {
        if (this._getCurrentTab() === tab) {
            this._urientry.set_text(uri);
        }
    },

    tabOnTitleChanged: function(tab, title) {
        const titlewidget = new Gtk.Label({ label: title});
        titlewidget.hexpand = true;
        this._notebook.set_tab_label(tab, titlewidget);
    },
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
