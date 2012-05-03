//
// === Main Application
//

var version = "1.1.1";

//
// === Load dependent class files
//
var MainWindow = require('ui/MainWindow');
var mainWindow = new MainWindow();
mainWindow.open();

// var log = require('helpers/logger');
// var foo = require('foo');
// 
// var x = new foo(1, 2, 3, 4);
// var y = new foo(5, 6, 7, 8);
// 
// log.error('X FOO a=' + x.a + ' b=' + x.b() + ' c=' + x.c + ' d=' + x.d());
// log.error('Y FOO a=' + y.a + ' b=' + y.b() + ' c=' + y.c + ' d=' + y.d());