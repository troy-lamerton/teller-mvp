/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseObject service
 * - exposes the model to the template and provides event handlers
 */
todomvc.controller('TodoCtrl', function TodoCtrl($scope, $location, $firebaseArray) {
	var url = 'https://data-filtering-tool.firebaseio.com/posts';
	var fireRef = new Firebase(url);

	// Bind the todos to the firebase provider.
	$scope.todos = $firebaseArray(fireRef);
	$scope.newTodo = '';
	$scope.editedTodo = null;

	$scope.$watch('todos', function () {
		var total = 0;
		var remaining = 0;
		angular.forEach($scope.todos, function (todo) {
			// Skip invalid entries so they don't break the entire app.
			if (!todo || !todo.title) {
				return;
			}

			total++;
			if (todo.marked === false) {
				remaining++;
			}
		});
		$scope.totalCount = total;
		$scope.remainingCount = remaining;
		$scope.markedCount = total - remaining;
		$scope.allChecked = remaining === 0;
	}, true);

	$scope.addTodo = function () {
		var newTodo = $scope.newTodo.trim();
		if (!newTodo.length) {
			return;
		}
		$scope.todos.$add({
			title: newTodo,
			marked: false
		});
		$scope.newTodo = '';
	};

	$scope.editTodo = function (todo) {
		$scope.editedTodo = todo;
		$scope.originalTodo = angular.extend({}, $scope.editedTodo);
	};

	$scope.doneEditing = function (todo) {
		$scope.editedTodo = null;
		var title = todo.title.trim();
		if (title) {
			$scope.todos.$save();
		} else {
			$scope.removeTodo(todo);
		}
	};

	$scope.revertEditing = function (todo) {
		todo.title = $scope.originalTodo.title;
		$scope.doneEditing(todo);
	};

	$scope.removeTodo = function (todo) {
		$scope.todos.$remove(todo);
	};

	$scope.clearCompletedTodos = function () {
		$scope.todos.forEach(function (todo) {
			if (todo.marked) {
				$scope.removeTodo(todo);
			}
		});
	};

	/*$scope.markAll = function (allCompleted) {
		$scope.todos.forEach(function (todo) {
			todo.marked = allCompleted;
			$scope.todos.$save();
		});
	};*/

	if ($location.path() === '') {
		$location.path('/');
	}
	$scope.location = $location;
});
