#!/usr/bin/env gjs
const Gtk = imports.gi.Gtk;

/*
Mainloop, single-thread, looking at gtk+ code
*/

print ("Start");

Gtk.main();

print ("Finish");
