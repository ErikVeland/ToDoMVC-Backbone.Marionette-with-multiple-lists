/*global Backbone, TodoMVC:true */

var TodoMVC = TodoMVC || {};

(function () {
	'use strict';

	// Set the RootLayout before starting the application
	
	var TodoApp = Mn.Application.extend({
		setRootLayout: function () {
			this.root = new TodoMVC.RootLayout();
		}
	});

	// The Application Object is responsible for kicking off
	// a Marionette application when its start function is called
	//
	// This application has a single root Layout that is attached
	// before it is started.  Other system components can listen
	// for the application start event, and perform initialization
	// on that event
	
	// 01. Initialise the application
	
	TodoMVC.App = new TodoApp();
	
	// Before the application is started, attach the root layout
	TodoMVC.App.on('before:start', function () {
		TodoMVC.App.setRootLayout();
	});

})();
