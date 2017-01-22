// create the module and name 'app'
var app = angular.module('teller', ['ngRoute']);

// configure our routes
app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl : 'public/intro.html',
			controller  : 'IntroCtrl'
		})
		.when('/expenses', {
			templateUrl : 'public/expenses.html',
			controller  : 'ExpensesCtrl'
		})
		.when('/result', {
			templateUrl : 'public/dataDisplay.html',
			controller  : 'DataDisplayCtrl'
		});
});

app.controller('MainCtrl', function($scope) {
	// create a message to display in our view
	$scope.message = 'Welcome to Teller!';
});

// create the controller and inject Angular's $scope
app.controller('IntroCtrl', function($scope) {
	// create a message to display in our view
	$scope.message = 'Welcome to Teller on the intro page!';
});

app.controller('ExpensesCtrl', function($scope) {
	$scope.message = 'Add your income and expenses below';
});

app.controller('DataDisplayCtrl', function($scope) {
	$scope.message = 'Look at all the pretty data...';
});
