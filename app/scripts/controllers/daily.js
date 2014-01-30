'use strict';

var dailyControllers = angular.module('dailyControllers', []);

dailyControllers.controller('DailyCtrl', ['$scope', 'DailyCategoryTotals', 'DailyCategoryFailedTotals', 'DailyServiceTotals', 'DailyServiceFailedTotals', 'DailyFailedReasonTotals', 'DateUtil', '$routeParams', '$q',
  function($scope, DailyCategoryTotals, DailyCategoryFailedTotals, DailyServiceTotals, DailyServiceFailedTotals, DailyFailedReasonTotals, DateUtil, $routeParams, $q) {
  	$scope.isopen1 = true;
  	$scope.isopen2 = true;
  	$scope.isopen3 = true;
	
  	function tooltipContentEditor(str, seriesIndex, pointIndex, plot) {
   		// display series_label, x-axis_tick, y-axis value
   		return plot.series[seriesIndex]["label"] + ", " + plot.data[seriesIndex][pointIndex];
	}
	
  	var selectedDt = new Date($routeParams.dt);
	$scope.category = $routeParams.category;
	$scope.weekStart = DateUtil.dateFormat(DateUtil.weekStart(selectedDt), "MM-DD-YYYY");
	var weekstartInput = DateUtil.dateFormat(DateUtil.weekStart(selectedDt), "YYYYMMDD");
	
	function getDailyTotals(weekstart, category) {
   		var d = $q.defer();
   		var result;
   		if (category == "All") {
   			result = DailyCategoryTotals.get({weekstart: weekstart}, function() {
        		d.resolve(result);
   			});
   		}
   		else {
   			result = DailyServiceTotals.get({weekstart: weekstart, category: category}, function() {
        		d.resolve(result);
   			});
   		}	
   		return d.promise;
	}
	function getDailyFailedTotals(weekstart, category) {
   		var d = $q.defer();
   		var result2;
   		if (category == "All") {
   			result2 = DailyCategoryFailedTotals.get({weekstart: weekstart}, function() {
        		d.resolve(result2);
   			});
   		}
   		else {
   			result2 = DailyServiceFailedTotals.get({weekstart: weekstart, category: category}, function() {
        		d.resolve(result2);
   			});
   		}	
   		return d.promise;
	}
	function getDailyFailedReasonTotals(weekstart, category) {
   		var d = $q.defer();
   		var result3 = DailyFailedReasonTotals.get({weekstart: weekstart, category: category}, function() {
        	d.resolve(result3);
   		});
   		return d.promise;
	}	
	$q.all([
   		getDailyTotals(weekstartInput, $routeParams.category),
   		getDailyFailedTotals(weekstartInput, $routeParams.category),
   		getDailyFailedReasonTotals(weekstartInput, $routeParams.category)
	]).then(function(data) {
		$scope.deliverytotal = data[0].totals;
		if (data[0].totals == 0) {
			$scope.isopen1 = false;
		}
    	$scope.chart = data[0].dailytotals; 
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
               		ticks: data[0].days
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
    	$scope.chart2 = data[1].dailytotals;     	
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
               		ticks: data[1].days
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
    	$scope.chart3 = data[2].dailytotals;     	
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
               		ticks: data[2].days
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

