/*global postchooser */
'use strict';

/**
 * Directive that places focus on the element it is applied to when the expression it binds to evaluates to true
 */
postchooser.directive('postFocus', function postFocus($timeout) {
	return function (scope, elem, attrs) {
		scope.$watch(attrs.postFocus, function (newVal) {
			if (newVal) {
				$timeout(function () {
					elem[0].focus();
				}, 0, false);
			}
		});
	};
});
