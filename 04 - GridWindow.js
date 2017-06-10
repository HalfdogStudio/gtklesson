#!/usr/bin/env gjs
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;

/*
- GtkGrid
- GtkBox
- Size requisitions, default_size, set_size_request, ger_preferred_size, etc.
- Expand and aligment properties
- Enums GTK_POS_BOTTOM, etc.
*/

Gtk.init(null);

const GridWindow = new Lang.Class({
    Name: 'GridWindow',
    Extends: Gtk.Window,

    _init: function() {
        this.parent({
	    title: 'Grid Example'
	    });

	    const grid = new Gtk.Grid();
	    this.add(grid);
	    this.set_default_size(600, 400);

        const button1 = new Gtk.Button({ label: 'Button 1' });
        const button2 = new Gtk.Button({ label: 'Button 2' });
        const button3 = new Gtk.Button({ label: 'Button 3' });
        const button4 = new Gtk.Button({ label: 'Button 4' });
        const button5 = new Gtk.Button({ label: 'Button 5' });
        const button6 = new Gtk.Button({ label: 'Button 6' });
        // button6.set_hexpand(true);

        grid.add(button1);
        grid.attach(button2, 1, 0, 2, 1);
        grid.attach_next_to(button3, button1, Gtk.PositionType.BOTTOM, 1, 2);
        grid.attach_next_to(button4, button3, Gtk.PositionType.RIGHT, 2, 1);
        grid.attach(button5, 1, 2, 1, 1);
        grid.attach_next_to(button6, button5, Gtk.PositionType.RIGHT, 1, 1);
    }
})

const win = new GridWindow();
win.connect('delete-event', Gtk.main_quit);
win.show_all();
Gtk.main();
