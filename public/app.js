// create the module and name 'app'
var app = angular.module('teller', ['ngRoute']);

app.directive('ngEnter', function() {
  return function(scope, element, attrs) {
    element.bind('keypress', function(e) {
      if(e.which === 13) {
        scope.$apply(function(){
          scope.$eval(attrs.ngEnter, {'e': e});
        });
        e.preventDefault();
      }
    });
  };
});

// configure our routes
app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl : 'views/intro.html',
      controller  : 'IntroCtrl'
    })
    .when('/spending', {
      templateUrl : 'views/spending.html',
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
  	expenses: [
      {name: 'Weekly food', amount: 85},
      {name: 'Movie', amount: 22},
      {name: '', amount: undefined}
    ],
    incomes: [
      {name: 'rental property', amount: 120}
    ]
  };

  const getRecords = (category) => records[category];
  const addRecord = (category, record) => {
    records[category].push(record);
  };
  const deleteRecord = (category, indexOfRecord) => {
  	records[category].splice(indexOfRecord, 1);
  }
  const updateRecord = (category, indexOfRecord, updatedRecord) => {
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
  $scope.expenses = recordService.getRecords('expenses');
  $scope.incomes = recordService.getRecords('incomes');

  $scope.finishEditing = (category, indexOfRecord, record) => {
    console.log(category, indexOfRecord, record);
    // $scope[category][indexOfRecord].editing = false;
    const finalRecord = Object.assign(record, {editing: false});
    recordService.updateRecord(category, indexOfRecord, finalRecord);
  }
  $scope.updateRecord = (category, indexOfRecord) => {
    const record = $scope[category][indexOfRecord];
    $scope.finishEditing(category, indexOfRecord, record)
    recordService.updateRecord(category, indexOfRecord, record);
  }

  $scope.newRecord = (category) => {
    recordService.addRecord(category, {name: '', amount: undefined, editing: true});
  }
  $scope.editRecord = (category, indexOfRecord, autoFocusAmount = false) => {
    $scope[category][indexOfRecord].editing = true;
  }
  $scope.deleteRecord = (category, indexOfRecord) => {
    console.log('delete record at index', indexOfRecord)
    recordService.deleteRecord(category, indexOfRecord);
  }
});

app.controller('DataDisplayCtrl', function($scope) {
	$scope.message = 'Look at all the pretty data...';

	// get records data from the service
});
