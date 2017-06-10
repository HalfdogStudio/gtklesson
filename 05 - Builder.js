#!/usr/bin/env gjs
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;

/*
- Glade
- GtkBuilder, from file or data
*/

Gtk.init(null);

const GridWindow = new Lang.Class({
    Name: 'GridWindow',
    Extends: Gtk.Window,

    _init: function() {
        this.parent({
	    title: 'Grid Example'
	});

	this.set_default_size(600, 400);

	const builder = new Gtk.Builder();
        builder.add_from_file('./grid.ui');
	const grid = builder.get_object('OurGrid');
	this.add(grid);
    }
});

const win = new GridWindow();
win.connect('delete-event', Gtk.main_quit);
win.show_all();
Gtk.main();
