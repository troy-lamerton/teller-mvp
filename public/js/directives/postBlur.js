/*global postchooser */
'use strict';

/**
 * Directive that executes an expression when the element it is applied to loses focus
 */
postchooser.directive('postBlur', function () {
	return function (scope, elem, attrs) {
		elem.bind('blur', function () {
			scope.$apply(attrs.postBlur);
		});

		scope.$on('$destroy', function () {
			elem.unbind('blur');
		});
	};
});
