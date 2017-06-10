#!/usr/bin/env gjs
const Gdk = imports.gi.Gdk;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;

/*
- Diferent constructors with GObject
- Icon browser
- Symbolic vs non symbolic
- Css
- Style providers
*/

Gtk.init(null);

const theme= `
image {animation: spin 1s linear infinite;}

@keyframes spin {
  from {color:red;}
  to { -gtk-icon-transform: rotate(1turn); color: green;}
}
`

const GridWindow = new Lang.Class({
    Name: 'GridWindow',
    Extends: Gtk.Window,

    _init: function() {
        this.parent({
            title: 'Theme'
        });

        const grid = new Gtk.Grid();
        this.add(grid);

        const button1 = Gtk.Button.new_from_icon_name('folder-music-symbolic', Gtk.IconSize.DND);
        const button2 = Gtk.Button.new_from_icon_name('folder-music-symbolic', Gtk.IconSize.DND);
        const button3 = Gtk.Button.new_from_icon_name('folder-music-symbolic', Gtk.IconSize.DND);
        const button4 = Gtk.Button.new_from_icon_name('folder-music-symbolic', Gtk.IconSize.DND);
        const button5 = Gtk.Button.new_from_icon_name('folder-music-symbolic', Gtk.IconSize.DND);
        const button6 = Gtk.Button.new_from_icon_name('folder-music-symbolic', Gtk.IconSize.DND);
        button6.set_hexpand(true);

        grid.add(button1);
        grid.attach(button2, 1, 0, 2, 1);
        grid.attach_next_to(button3, button1, Gtk.PositionType.BOTTOM, 1, 2);
        grid.attach_next_to(button4, button3, Gtk.PositionType.RIGHT, 2, 1);
        grid.attach(button5, 1, 2, 1, 1);
        grid.attach_next_to(button6, button5, Gtk.PositionType.RIGHT, 1, 1);

        const cssProvider = new Gtk.CssProvider();

        cssProvider.load_from_data(theme);
        Gtk.StyleContext.add_provider_for_screen(Gdk.Display.get_default().get_default_screen(),
                cssProvider, Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION);
        
    }
});


const win = new GridWindow();
win.connect('delete-event', Gtk.main_quit);
win.show_all();
Gtk.main();
