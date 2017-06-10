#!/usr/bin/env gjs
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;
const WebKit2 = imports.gi.WebKit2;


/*
- Async vs sync, and the importance of having the two
*/

Gtk.init(null);

const HOME_PAGE = 'http://www.duckduckgo.com';
const DOWNLOADS_FOLDER = 'file:///home/reverland/';


const BrowserWindow = new Lang.Class({
    Name: 'BrowserWindow',
    Extends: Gtk.ApplicationWindow,

    _init: function() {
        this.parent();
        this.set_size_request(750, 680);

        const titlebar = new Gtk.HeaderBar();
        titlebar.set_show_close_button(true);

        this._urientry = new Gtk.Entry();
        this._urientry.set_size_request(300, -1);
        this._urientry.set_text(HOME_PAGE);
        this._urientry.connect('activate', Lang.bind(this, this._urientryOnActivated));
        this._urientry.hexpand = true;
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
        this._checkDownloadsFolder();
        const uri = this._urientry.get_text();
        this._webview.load_uri(uri);
    },

    _checkDownloadsFolder: function() {
        const file = Gio.File.new_for_uri(DOWNLOADS_FOLDER);
		listFileAsync(file);
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

// https://bitbucket.org/mathematicalcoffee/gnome-shell-doc/src/bae8d9bd9403747ee6ec8d95e702a8b35f74009d/js/misc/fileUtils.js?at=gnome-3-2&fileviewer=file-view-default
function listFileAsync(file) {
    file.enumerate_children_async(Gio.FILE_ATTRIBUTE_STANDARD_NAME,
                                  Gio.FileQueryInfoFlags.NONE,
                                  GLib.PRIORITY_LOW, null, function (obj, res) {
        let enumerator = obj.enumerate_children_finish(res);
        function onNextFileComplete(obj, res) {
            let files = obj.next_files_finish(res);
            if (files.length) {
                files.forEach(function(file) {
                    print(file.get_name());
                    let type = file.get_file_type();
                    if (type === Gio.FileType.DIRECTORY) {
                        fileObj = enumerator.get_child(file);
                        listFileAsync(fileObj);
                    }
                });
                enumerator.next_files_async(1, GLib.PRIORITY_LOW, null, onNextFileComplete);
            } else {
                enumerator.close(null);
            }
        }
        enumerator.next_files_async(100, GLib.PRIORITY_LOW, null, onNextFileComplete);
    });
}
