'use strict';

var edeliveryControllers = angular.module('edeliveryControllers', []);


edeliveryControllers.controller('MainCtrl', ['$scope',
  function($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
  
