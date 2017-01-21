	// create the module and name 'teller'
	const teller = angular.module('teller', ['ngRoute']);

	// configure our routes
	teller.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl : 'pages/home.html',
				controller  : 'introController'
			})
			.when('/about', {
				templateUrl : 'pages/about.html',
				controller  : 'expensesController'
			})
			.when('/contact', {
				templateUrl : 'pages/contact.html',
				controller  : 'dataDisplayController'
			});
	});

	// create the controller and inject Angular's $scope
	teller.controller('introController', function($scope) {
		// create a message to display in our view
		$scope.message = 'Welcome to Teller!';
	});

	teller.controller('expensesController', function($scope) {
		$scope.message = 'Add your income and expesnes below';
	});

	teller.controller('dataDisplayController', function($scope) {
		$scope.message = 'Look at all the pretty data...';
	});