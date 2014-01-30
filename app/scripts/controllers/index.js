'use strict';

var indexControllers = angular.module('indexControllers', []);

indexControllers.controller('NavCtrl', ['$scope', '$route', '$location', 'ServiceCategories',
  function($scope, $route, $location, ServiceCategories) {
$scope.isActive = function (loadedView) {
	if (!$route.current) { return false;}
     var active = (loadedView === $route.current.loadedView);
     return active;
};  	
  $scope.today = function() {
  	$scope.dt = new Date();
      	$scope.$watch('dt', function() {
      		if (!$route.current) { return;}
      		if ($route.current.loadedView == 'daily') {
    			$location.path("/daily/" + $scope.dt + "/" + $scope.category);
    		}
      		if ($route.current.loadedView == 'monthly') {
    			$location.path("/monthly/" + $scope.dt + "/" + $scope.category);
    		}	
      		if ($route.current.loadedView == 'weekly') {
    			$location.path("/weekly/" + $scope.dt + "/" + $scope.category);
    		}  		
  	});
  };
  $scope.today();
  $scope.categories = ServiceCategories.query();
  $scope.category = "All";
  $scope.$watch('category', function() {
  	if (!$route.current) { return;}
      		if ($route.current.loadedView == 'daily') {
    			$location.path("/daily/" + $scope.dt + "/" + $scope.category);
    		}
      		if ($route.current.loadedView == 'monthly') {
    			$location.path("/monthly/" + $scope.dt + "/" + $scope.category);
    		}	
      		if ($route.current.loadedView == 'weekly') {
    			$location.path("/weekly/" + $scope.dt + "/" + $scope.category);
    		}   
  });
  
  $scope.showWeeks = true;
  $scope.toggleWeeks = function () {
    $scope.showWeeks = ! $scope.showWeeks;
  };

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = ( $scope.minDate ) ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 0
  };

  $scope.format = 'dd-MMMM-yyyy';


}]);