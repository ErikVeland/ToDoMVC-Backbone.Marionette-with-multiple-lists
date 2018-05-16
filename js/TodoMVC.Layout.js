/*global TodoMVC:true, Backbone */

var TodoMVC = TodoMVC || {};

(function () {
	'use strict';

	var filterChannel = Backbone.Radio.channel('filter');
	
	// This is the root layout, containing three regions: header, main and footer
	TodoMVC.RootLayout = Mn.View.extend({
		
		//root element
		el: '#todoapp',

		regions: {
			header: '#header',
			main: '#main',
			footer: '#footer'
		}
	});

	// Layout Header View
	// ------------------
	// Applies the layout and the ui bindings from the HTML template to the header element
	TodoMVC.HeaderLayout = Mn.View.extend({

		template: '#template-header',

		// UI bindings create cached attributes that
		// point to jQuery selected objects
		ui: {
			input: '#new-todo'
		},
		
		// Assign keypress and key up events
		events: {
			'keypress @ui.input': 'onInputKeypress',
			'keyup @ui.input': 'onInputKeyup'
		},

		// According to the spec
		// If escape is pressed during the edit, the edit state should be left and any changes be discarded.
		onInputKeyup: function (e) {
			var ESC_KEY = 27;

			if (e.which === ESC_KEY) {
				this.render();
			}
		},
		
		// If Enter is pressed, add the input value to the collection
		onInputKeypress: function (e) {
			var ENTER_KEY = 13;
			
			// Collect the input value and trim whitespace
			var todoText = this.ui.input.val().trim();
			
			// If enter is hit and todo is populated, create a collection with the value
			if (e.which === ENTER_KEY && todoText) {
				this.collection.create({
					title: todoText
				});
				this.ui.input.val('');
			}
		}
	});

	// Layout Footer View
	// ------------------
	TodoMVC.FooterLayout = Mn.View.extend({
		template: '#template-footer',

		// UI bindings create cached attributes that
		// point to jQuery selected objects
		ui: {
			filters: '#filters a',
			completed: '.completed a',
			active: '.active a',
			all: '.all a',
			summary: '#todo-count',
			clear: '#clear-completed'
		},
		
		// Bind onClearClick function to clicking #clear-completed
		events: {
			'click @ui.clear': 'onClearClick'
		},
		
		
		collectionEvents: {
			all: 'render'
		},

		templateContext: {
			activeCountLabel: function () {
				return (this.activeCount === 1 ? 'item' : 'items') + ' left';
			}
		},

		initialize: function () {
			this.listenTo(filterChannel.request('filterState'), 'change:filter', this.updateFilterSelection, this);
		},

		serializeData: function () {
			var active = this.collection.getActive().length;
			var total = this.collection.length;

			return {
				activeCount: active,
				totalCount: total,
				completedCount: total - active
			};
		},

		onRender: function () {
			this.$el.parent().toggle(this.collection.length > 0);
			this.updateFilterSelection();
		},

		updateFilterSelection: function () {
			this.ui.filters.removeClass('selected');
			this.ui[filterChannel.request('filterState').get('filter')]
			.addClass('selected');
		},

		onClearClick: function () {
			var completed = this.collection.getCompleted();
			completed.forEach(function (todo) {
				todo.destroy();
			});
		}
	});
})();
