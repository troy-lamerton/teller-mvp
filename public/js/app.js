/*global angular */
/*jshint unused:false */
'use strict';

/**
 * The main PostMVC app module
 *
 * @type {angular.Module}
 */
var postmvc = angular.module('postmvc', ['firebase']);

postmvc.filter('postFilter', function ($location) {
	return function (input) {
		var filtered = {};
		angular.forEach(input, function (post, id) {
			var path = $location.path();
			if (path === '/active') {
				if (!post.hidden) {
					filtered[id] = post;
				}
			} else if (path === '/marked') {
				if (post.marked) {
					filtered[id] = post;
				}
			} else {
				filtered[id] = post;
			}
		});
		return filtered;
	};
});
