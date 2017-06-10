#!/usr/bin/env gjs
const Gtk = imports.gi.Gtk;

/*
Signals, virtual methods, default handlers
*/

Gtk.init(null);

const win = new Gtk.Window();
win.connect('delete-event', Gtk.main_quit);
win.show_all();
Gtk.main();
