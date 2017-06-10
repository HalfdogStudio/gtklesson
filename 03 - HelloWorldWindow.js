#!/usr/bin/env gjs
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;

/*
- Javascript inheritance
- GObject properties and javascript optional parameters
- Containers, Gtk.Window is a Gtk.Bin
- Our own event handler
*/

Gtk.init(null);

const MyWindow = new Lang.Class({
    Name: 'MyWindow',
    Extends: Gtk.Window,

    _init: function() {
        this.parent({ title: 'Hello World' });

        const button = new Gtk.Button({ label: 'Click Here' });
        button.connect('clicked', this._onButtonClicked);
    },

    _onButtonClicked: function(widget) {
        print('Hello World');
    }
});

const win = new MyWindow();
win.connect('delete-event', Gtk.main_quit);
win.show_all();
Gtk.main();
