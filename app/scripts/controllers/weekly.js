'use strict';

var weeklyControllers = angular.module('weeklyControllers', []);

weeklyControllers.controller('WeeklyCtrl', ['$scope', 'WeeklyCategoryTotals', 'WeeklyCategoryFailedTotals', 'WeeklyServiceTotals', 'WeeklyServiceFailedTotals', 'WeeklyFailedReasonTotals', 'DateUtil', '$routeParams', '$q',
  function($scope, WeeklyCategoryTotals, WeeklyCategoryFailedTotals, WeeklyServiceTotals, WeeklyServiceFailedTotals, WeeklyFailedReasonTotals, DateUtil, $routeParams, $q) {
  	$scope.isopen1 = true;
  	$scope.isopen2 = true;
  	$scope.isopen3 = true;
  	function tooltipContentEditor(str, seriesIndex, pointIndex, plot) {
   		// display series_label, x-axis_tick, y-axis value
   		return plot.series[seriesIndex]["label"] + ", " + plot.data[seriesIndex][pointIndex];
	}
	
  	var selectedDt = new Date($routeParams.dt);
  	$scope.category = $routeParams.category;
  	$scope.date = selectedDt;
	$scope.year = selectedDt.getFullYear();
	$scope.month = selectedDt.getMonth() + 1;

	$scope.monthyear = DateUtil.dateFormat(selectedDt, "MM-YYYY");
	
	function getWeeklyTotals(selectedDt, category) {
   		var d = $q.defer();
   		var result;
   		if (category == "All") {
   			
   			result = WeeklyCategoryTotals.get({year: selectedDt.getFullYear(), month: selectedDt.getMonth() + 1}, function() {
        		d.resolve(result);
        	});
        }
        else {
   			result = WeeklyServiceTotals.get({year: selectedDt.getFullYear(), month: selectedDt.getMonth() + 1, category: category}, function() {
        		d.resolve(result);
        	});        	
        }	
   		return d.promise;
	}
	function getWeeklyFailedTotals(selectedDt, category) {
   		var d = $q.defer();
   		var result2;
   		if (category == "All") {
   			
   			result2 = WeeklyCategoryFailedTotals.get({year: selectedDt.getFullYear(), month: selectedDt.getMonth() + 1}, function() {
        		d.resolve(result2);
        	});
        }
        else {
   			result2 = WeeklyServiceFailedTotals.get({year: selectedDt.getFullYear(), month: selectedDt.getMonth() + 1, category: category}, function() {
        		d.resolve(result2);
        	});        	
        }		

   		return d.promise;
	}
	function getWeeklyFailedReasonTotals(selectedDt, category) {
   		var d = $q.defer();
   		var result3 = WeeklyFailedReasonTotals.get({year: selectedDt.getFullYear(), month: selectedDt.getMonth() + 1, category: category}, function() {
        	d.resolve(result3);
   		});
   		return d.promise;
	}	
	$q.all([
   		getWeeklyTotals(selectedDt, $routeParams.category),
   		getWeeklyFailedTotals(selectedDt, $routeParams.category),
   		getWeeklyFailedReasonTotals(selectedDt, $routeParams.category)
	]).then(function(data) {
		$scope.deliverytotal = data[0].totals;
		if (data[0].totals == 0) {
			$scope.isopen1 = false;
		}
    	$scope.chart = data[0].weeklytotals; 
    	$scope.chartOptions =  {
    		stackSeries: true,
        	seriesDefaults:{
            	renderer:jQuery.jqplot.BarRenderer,
            	rendererOptions: {fillToZero: true},
          	},
        	series: data[0].category,
        	legend: {
            	show: true,
            	placement: 'outsideGrid'
        	},
        	axes: {
            	xaxis: {
                	renderer: jQuery.jqplot.CategoryAxisRenderer,
               		ticks: data[0].weekstart
            	},
            },	
    		highlighter: {
      			show: true,
      			showTooltip: true,      // show a tooltip with data point values.
            	tooltipLocation: 'ne',  // location of tooltip: n, ne, e, se, s, sw, w, nw.
           		tooltipContentEditor:tooltipContentEditor 
    		},
    	};
    	$scope.faileddeliverytotal = data[1].totals;
    	if (data[1].totals == 0) {
			$scope.isopen2 = false;
		}
    	$scope.chart2 = data[1].weeklytotals;     	
    	$scope.chartOptions2 =  {
    		stackSeries: true,
        	seriesDefaults:{
            	renderer:jQuery.jqplot.BarRenderer,
            	rendererOptions: {fillToZero: true},
        	},
        	series: data[1].category,
        	legend: {
            	show: true,
            	placement: 'outsideGrid'
        	},
        	axes: {
            	xaxis: {
                	renderer: jQuery.jqplot.CategoryAxisRenderer,
               		ticks: data[1].weekstart
            	},

        	},
    		highlighter: {
      			show: true,
      			showTooltip: true,      // show a tooltip with data point values.
            	tooltipLocation: 'ne',  // location of tooltip: n, ne, e, se, s, sw, w, nw.
           		tooltipContentEditor:tooltipContentEditor 
    		},        	
    	};  
    	$scope.failedreasonstotal = data[2].totals; 
		if (data[2].totals == 0) {
			$scope.isopen3 = false;
		}    	 	
    	$scope.chart3 = data[2].weeklytotals;     	
    	$scope.chartOptions3 =  {
    		stackSeries: true,
        	seriesDefaults:{
            	renderer:jQuery.jqplot.BarRenderer,
            	rendererOptions: {fillToZero: true},
	
        	},
        	series: data[2].exception,
        	legend: {
            	show: true,
            	placement: 'outsideGrid'
        	},
        	axes: {
            	xaxis: {
                	renderer: jQuery.jqplot.CategoryAxisRenderer,
               		ticks: data[2].weekstart
            	},

        	},
    		highlighter: {
      			show: true,
      			showTooltip: true,      // show a tooltip with data point values.
            	tooltipLocation: 'ne',  // location of tooltip: n, ne, e, se, s, sw, w, nw.
           		tooltipContentEditor:tooltipContentEditor 
    		},        	
    	};    	    	
	});	
}]);
