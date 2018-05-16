/*global TodoMVC:true, Backbone */

var TodoMVC = TodoMVC || {};

(function() {
	'use strict';
	var filterChannel = Backbone.Radio.channel('filter');
	
	// This is the root layout, containing three regions: header, main and footer
	TodoMVC.RootLayout = Mn.View.extend({
		
		//root element
		el: '#todoapp',
		// Define the different regions of the app and assign it to DOM elements
		regions: {
			titleInput: '#title-input',
			header: '#header',
			main: '#main',
			footer: '#footer'
		}
	});
	
	// Title View
		// ------------------
		// Applies the layout and the ui bindings from the HTML template to the title element
		TodoMVC.TitleView = Mn.View.extend({
		
		// Header template with input for adding todos
		template: _.template('<input id="title" placeholder="Reminders" value="" autofocus>'),
		// UI bindings create cached attributes that
		// point to jQuery selected objects
		ui: {
			title: '#title'
		},
		// Assign keypress and key up events
		events: {
			'change @ui.title': 'onTitleChange',
			'keyup @ui.title': 'onTitleKeyup'
		},
		// If escape is pressed during the edit, the edit state should be left and any changes be discarded.
		onTitleKeyup: function (e) {
			var ESC_KEY = 27;
			if (e.which === ESC_KEY) {
				this.render();
			}
			
			console.log(this.collection.get('pageTitle'));
		}, // If title changes, add it to the collection
		onTitleChange: function (e) {
			console.log("Title has changed to");
			// Collect the input value and trim whitespace
			var titleText = this.ui.title.val().trim();
			console.log(titleText);
			// If title is populated, create a collection with the value
			//if (e.which === titleText) {
				this.collection.create({
				pageTitle: titleText
			});
			//}
		},
			onRender: function () {
			//this.showChildView('listBody', new TodoMVC.ListTitle({
			//	collection: this.collection
			//}));
			this.ui.title.val('Reminders');
		}
	});
	
	
	// Layout Header View
	// ------------------
	// Applies the layout and the ui bindings from the HTML template to the header element
	TodoMVC.HeaderLayout = Mn.View.extend({
		
		// Header template with input for adding todos
		template: _.template('<input id="new-todo" placeholder="Add reminder">'),
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
		// If escape is pressed during the edit, the edit state should be left and any changes be discarded.
		onInputKeyup: function (e) {
			var ESC_KEY = 27;
			if (e.which === ESC_KEY) {
				this.render();
			}
		}, // If Enter is pressed, add the input value to the collection
		onInputKeypress: function (e) {
			var ENTER_KEY = 13;
			
			// Collect the input value and trim whitespace
			var todoText = this.ui.input.val().trim();
			console.log(todoText);
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
		
		// Dynamic counter with static-ish label (reminder/reminders)
		template: _.template('<span id="todo-count">	<strong><%= activeCount %></strong> <%= activeCountLabel() %></span><!-- Filters create URLs to be handled by the router --><ul id="filters"><li class="all"><a href="#/">All</a></li><li class="remaining"><a href="#/active">Show remaining</a></li>	<li class="completed"><a href="#/completed">Show completed</a></li>	</ul><!-- Only show button if there are completed items --><button id="clear-completed" title="Clear completed" <% if (!completedCount) { %>class="hidden"<% } %>><i class="fa fa4x fa-trash"></i></button>'),
		// UI bindings create cached attributes that
		// point to jQuery selected objects
		
		// Changed active to the more sensible "remaining"
		ui: {
			filters: '#filters a',
			completed: '.completed a',
			active: '.remaining a',
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
				return (this.activeCount === 1 ? 'reminder': 'reminders') + ' left';
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
			completed.forEach(function(todo) {
				todo.destroy();
			});
		}
	});
})();
