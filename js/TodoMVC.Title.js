/*global Backbone, TodoMVC:true */

var TodoMVC = TodoMVC || {};

(function () {
	'use strict';

	// Name Model
	// ----------
	// Create mode for the header to be named
	TodoMVC.Title = Backbone.Model.extend({
		
		// Set the default values
		defaults: {
			pageTitle: 'Reminders'
		}
	
	});

	// Title Collection
	// ---------------
	TodoMVC.TitleList = Backbone.Collection.extend({
		model: TodoMVC.Title,

		localStorage: new Backbone.LocalStorage('todos-title')
	});
	
	
})();
