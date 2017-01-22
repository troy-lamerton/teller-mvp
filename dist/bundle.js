"use strict";var app=angular.module("teller",["ngRoute"]);app.config(function($routeProvider){$routeProvider.when("/",{templateUrl:"public/intro.html",controller:"IntroCtrl"}).when("/expenses",{templateUrl:"public/expenses.html",controller:"ExpensesCtrl"}).when("/result",{templateUrl:"public/dataDisplay.html",controller:"DataDisplayCtrl"})});app.controller("MainCtrl",function($scope){$scope.message="Welcome to Teller!"});app.controller("IntroCtrl",function($scope){$scope.message="Welcome to Teller on the intro page!"});app.controller("ExpensesCtrl",function($scope){$scope.message="Add your income and expenses below"});app.controller("DataDisplayCtrl",function($scope){$scope.message="Look at all the pretty data..."});
//# sourceMappingURL=bundle.map