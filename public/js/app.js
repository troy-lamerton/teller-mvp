/*global angular */
/*jshint unused:false */
'use strict';

/**
 * The main PostMVC app module
 *
 * @type {angular.Module}
 */
var postchooser = angular.module('postchooser', ['firebase']);

postchooser.filter('postFilter', function ($location) {
	return function (input) {
		var filtered = {};
		var path = $location.path();
		angular.forEach(input, function (post, id) {
			if (path === '/unfiled') {
				if (!post.marked && !post.hidden) {
					filtered[id] = post;
				}
			} else if (path === '/marked') {
				if (post.marked) {
					filtered[id] = post;
				}
			} else if (path === '/hidden') {
				if (post.hidden) {
					filtered[id] = post;
				}
			} else {
				filtered[id] = post;
			}
		});
		return filtered;
	};
});
