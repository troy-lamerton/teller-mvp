/*global todomvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseObject service
 * - exposes the model to the template and provides event handlers
 */
todomvc.controller('TodoCtrl', function TodoCtrl($scope, $location, $firebaseArray) {
	var url = 'https://data-filtering-tool.firebaseio.com/posts';
	var fireRefMeta = new Firebase(url + '/meta')
	var fireRefContent = new Firebase(url + '/content')

	// Bind the todos to the firebase provider.
	$scope.todos = $firebaseArray(fireRefMeta);
	$scope.newPostUrl = '';
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
		var newPostUrl = $scope.newPostUrl
		if (!newPostUrl.length) {
			return;
		}
		var urlParts = newPostUrl.split('/');
		var id = urlParts[urlParts.length-3]
		var title = urlParts[urlParts.length-2];

		var xhr = new XMLHttpRequest();
		if (self.fetch) {
			console.log('fetch supported')
		} else {
			console.error('fetch supported')
		}
		fetch(newPostUrl)
			.then(function(res) {
				console.info(res);
			})
			.catch(function (err) {
				console.error('Error fetching reddit data', err);
			})

		$scope.todos.$add({
			id,
			title,
			url: newPostUrl,
			marked: false
		});
		$scope.newPostUrl = '';
	};

	$scope.editTodo = function (todo) {
		$scope.editedTodo = todo;
		$scope.originalTodo = angular.extend({}, $scope.editedTodo);
	};

	$scope.doneEditing = function (todo) {
		$scope.editedTodo = null;
		var title = todo.title;
		if (title) {
			$scope.todos.$save(todo);
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
			$scope.todos.$save(todo);
		});
	};*/

	if ($location.path() === '') {
		$location.path('/');
	}
	$scope.location = $location;
});
