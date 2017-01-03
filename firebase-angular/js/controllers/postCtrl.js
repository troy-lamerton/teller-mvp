/*global postmvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseObject service
 * - exposes the model to the template and provides event handlers
 */
postmvc.controller('PostCtrl', function PostCtrl($scope, $location, $firebaseArray) {
	var url = 'https://data-filtering-tool.firebaseio.com/posts';
	var fireRefMeta = new Firebase(url + '/meta')
	var fireRefContent = new Firebase(url + '/content')

	// Bind the posts to the firebase provider.
	$scope.posts = $firebaseArray(fireRefMeta);
	$scope.newPostUrl = '';
	$scope.editedPost = null;

	$scope.$watch('posts', function () {
		var total = 0;
		var remaining = 0;
		angular.forEach($scope.posts, function (post) {
			// Skip invalid entries so they don't break the entire app.
			if (!post || !post.title) {
				return;
			}

			total++;
			if (post.marked === false) {
				remaining++;
			}
		});
		$scope.totalCount = total;
		$scope.remainingCount = remaining;
		$scope.markedCount = total - remaining;
		$scope.allChecked = remaining === 0;
	}, true);

	$scope.addPost = function () {
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
			});

		$scope.posts.$add({
			id,
			title,
			url: newPostUrl,
			marked: false
		});
		$scope.newPostUrl = '';
	};

	$scope.editPost = function (post) {
		$scope.editedPost = post;
		$scope.originalPost = angular.extend({}, $scope.editedPost);
	};

	$scope.doneEditing = function (post) {
		$scope.editedPost = null;
		var title = post.title;
		if (title) {
			$scope.posts.$save(post);
		} else {
			$scope.removePost(post);
		}
	};

	$scope.revertEditing = function (post) {
		post.title = $scope.originalPost.title;
		$scope.doneEditing(post);
	};

	$scope.removePost = function (post) {
		$scope.posts.$remove(post);
	};

	$scope.clearCompletedPosts = function () {
		$scope.posts.forEach(function (post) {
			if (post.marked) {
				$scope.removePost(post);
			}
		});
	};

	/*$scope.markAll = function (allCompleted) {
		$scope.posts.forEach(function (post) {
			post.marked = allCompleted;
			$scope.posts.$save(post);
		});
	};*/

	if ($location.path() === '') {
		$location.path('/');
	}
	$scope.location = $location;
});
