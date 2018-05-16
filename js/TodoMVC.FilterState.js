/*global Backbone */

// This file acts as a Service, providing
// the rest of the app access to the filter state
// as needed, without them needing to know the implementation
// details
(function () {
	'use strict';
	var filterState = new Backbone.Model({
		filter: 'all'
	});
	
	// Using the radio extender listen to the filter state and render it to the view
	var filterChannel = Backbone.Radio.channel('filter');
	filterChannel.reply('filterState', function () {
		return filterState;
	});
})();
