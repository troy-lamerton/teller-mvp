// create the module and name 'app'
var app = angular.module('teller', ['ngRoute']);

// configure our routes
app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl : 'views/intro.html',
			controller  : 'IntroCtrl'
		})
		.when('/spending', {
			templateUrl : 'views/expenses.html',
			controller  : 'SpendingCtrl'
		})
		.when('/result', {
			templateUrl : 'views/dataDisplay.html',
			controller  : 'DataDisplayCtrl'
		});
});

app.controller('MainCtrl', function($scope, $location) {
	// create a message to display in our view
	$scope.message = 'Welcome to Teller!';
	$scope.changeView = (view = '') => {
		$location.path(view);
  }
});

app.service('recordService', function() {
	/* Each record should follow this format
		{
			name: 'Weekly food',
			amount: 85
		}
	*/

  const records = {
  	expenses: [],
    incomes: [],
  };

  const getRecords = (type) => records[category];

  const addRecord = (category, record) => {
    records[category].push(record);

    /*
    if (category === 'incomes') {
    	records.incomes.push({name: 'Rent', amount: 100});
    } else {
    	records.expenses.push({name: 'food', amount: 120});
    } 
    */
  };

  const deleteRecord = (category, indexOfRecord) => {
  	records[category].splice(indexOfRecord, 1);
  }

  const updateRecord = (category, updatedRecord, indexOfRecord) => {
    records[category][indexOfRecord] = updatedRecord;
  }

  return {
    getRecords,
    addRecord,
    deleteRecord,
    updateRecord,
  };

});
// create the controller and inject Angular's $scope
app.controller('IntroCtrl', function($scope) {
	// create a message to display in our view
	$scope.message = 'Welcome to Teller on the intro page!';
});

app.controller('SpendingCtrl', function($scope, recordService) {
	$scope.addExpense = (record) => {
		recordService.addRecord('expenses', record);
	}
	$scope.updateRecord = (category, record, indexOfRecord) => {
		recordService.updateRecord(category, record, indexOfRecord);
	}
	$scope.addIncome = (record) => {
		recordService.addRecord('incomes', record);
	}
});

app.controller('DataDisplayCtrl', function($scope) {
	$scope.message = 'Look at all the pretty data...';

	// get records data from the service
});
