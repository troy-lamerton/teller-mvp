/*global postmvc, angular, Firebase */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the $firebaseObject service
 * - exposes the model to the template and provides event handlers
 */
postmvc.controller('PostCtrl', function PostCtrl($scope, $location, $firebaseArray) {
	const url = 'https://data-filtering-tool.firebaseio.com/posts';
	const fireRefMeta = new Firebase(url + '/meta')
	const fireRefContent = new Firebase(url + '/content')

	// Bind the posts to the firebase provider.
	$scope.posts = $firebaseArray(fireRefMeta);
	$scope.postsContent = $firebaseArray(fireRefContent);
	$scope.newPostUrl = '';
	$scope.editedPost = null;

	$scope.$watch('posts', function () {
		let total = 0;
		let remaining = 0;
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

	$scope.importUrlError = ({type} = {type: ''}) => {
		switch (type) {
			case 'DUPLICATE':
				window.alert('Post is already in the list');
				break;
			default:
				window.alert('URL is not a valid Reddit post url');
		}
	}

	$scope.addPost = function () {
		let newPostUrl = $scope.newPostUrl.slice(0, -1)
		if (!newPostUrl.length) {
			return;
		}
		const urlParts = newPostUrl.split('/');
		if (urlParts.length >= 6) {
			// check if this post is already in the list
			const newPostId = urlParts[urlParts.length-2]
			const duplicatePost = $scope.posts.find(function(post) {
				return post.id === newPostId;
			});
			if (duplicatePost) {
				$scope.importUrlError({type: 'DUPLICATE'}); 
				return;
			}
		}
		else {
			return $scope.importUrlError();
		}

		const queryStringStart = newPostUrl.indexOf('?');
		if (queryStringStart > -1) {
			newPostUrl = newPostUrl.slice(0, queryStringStart);
		}
		const redditUrlRegex = /https:\/\/(?:www\.)?reddit\.com\/[-a-zA-Z0-9@:%._\+~#=\/]{2,256}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/;
		if (!self.fetch) {
			console.error('JavaScript fetch NOT supported');
			return;
		}
		if (redditUrlRegex.test(newPostUrl)) {
			fetch(newPostUrl + '.json')
				.then(function(res) {
					res.json().then(function(data) {
						if (typeof data === 'object' && data instanceof Array) {
							const postData = data[0].data.children[0].data;
							const { title, id, author, score, created_utc, url, selftext } = postData;
							$scope.posts.$add({
								id,
								title,
								author,
								score,
								url,
								createdAt: created_utc,
								marked: false,
								hidden: false
							});
							fireRefContent.child(id).set({
								id,
								selftext
							});
							$scope.newPostUrl = '';
						} else {
							console.warn('Reddit data fetched json is not an Array')
						}
					})
				})
				.catch(function (err) {
					console.error('Error fetching reddit data', err);
				});
		} else {
			return $scope.importUrlError();
		}

	};

	$scope.editPost = function (post) {
		$scope.editedPost = post;
		$scope.originalPost = angular.extend({}, $scope.editedPost);
	};

	$scope.doneEditing = function (post) {
		$scope.editedPost = null;
		const title = post.title;
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
