'use strict';

var weeklyControllers = angular.module('weeklyControllers', []);

weeklyControllers.controller('WeeklyCtrl', ['$scope', 'WeeklyCategoryTotals', 'WeeklyCategoryFailedTotals', 'WeeklyServiceTotals', 'WeeklyServiceFailedTotals', 'WeeklyFailedReasonTotals', 'DateUtil', '$routeParams', 'Activity', 'ActivityService',
  function($scope, WeeklyCategoryTotals, WeeklyCategoryFailedTotals, WeeklyServiceTotals, WeeklyServiceFailedTotals, WeeklyFailedReasonTotals, DateUtil, $routeParams, Activity, ActivityService) {
  	$scope.isopen1 = true;
  	$scope.isopen2 = true;
  	$scope.isopen3 = true;
    ActivityService.get(function(activity) {
   		Activity.setLastUpdate(activity.last_update);
   	});	
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
	
	if ($routeParams.category == "All") {
		WeeklyCategoryTotals.get({year: selectedDt.getFullYear(), month: selectedDt.getMonth() + 1}, function(data) {
			$scope.deliverytotal = data.totals;
			if (data.totals > 0) {
				$scope.isopen1 = true;
    			loadSuccessfulChart(data);
    		}
    		else {
    			$scope.isopen1 = false;
    		}	
		});
		WeeklyCategoryFailedTotals.get({year: selectedDt.getFullYear(), month: selectedDt.getMonth() + 1}, function(data) {
			$scope.faileddeliverytotal = data.totals;
			if (data.totals > 0) {
				$scope.isopen2 = true;
    			loadFailedChart(data);
    		}
    		else {
    			$scope.isopen2 = false;
    		}	
		});		
	}
	else {
		WeeklyServiceTotals.get({year: selectedDt.getFullYear(), month: selectedDt.getMonth() + 1, category: $routeParams.category}, function(data) {
			$scope.deliverytotal = data.totals;
			if (data.totals > 0) {
				$scope.isopen1 = true;
    			loadSuccessfulChart(data);
    		}
    		else {
    			$scope.isopen1 = false;
    		}	
		});
		WeeklyServiceFailedTotals.get({year: selectedDt.getFullYear(), month: selectedDt.getMonth() + 1, category: $routeParams.category}, function(data) {
			$scope.faileddeliverytotal = data.totals;
			if (data.totals > 0) {
				$scope.isopen2 = true;
    			loadFailedChart(data);
    		}
    		else {
    			$scope.isopen2 = false;
    		}	

		});		
	}
	function loadSuccessfulChart(data) {
    	$scope.chart = data.weeklytotals; 
    	$scope.chartOptions =  {
    		stackSeries: true,
        	seriesDefaults:{
            	renderer:jQuery.jqplot.BarRenderer,
            	rendererOptions: {fillToZero: true},
          	},
        	series: data.category,
        	legend: {
            	show: true,
            	placement: 'outsideGrid'
        	},
        	axes: {
            	xaxis: {
                	renderer: jQuery.jqplot.CategoryAxisRenderer,
               		ticks: data.weekstart
            	},
            },	
    		highlighter: {
      			show: true,
      			showTooltip: true,      // show a tooltip with data point values.
            	tooltipLocation: 'ne',  // location of tooltip: n, ne, e, se, s, sw, w, nw.
           		tooltipContentEditor:tooltipContentEditor 
    		},
    	};
		
	}
	function loadFailedChart(data) {
    	$scope.chart2 = data.weeklytotals;     	
    	$scope.chartOptions2 =  {
    		stackSeries: true,
        	seriesDefaults:{
            	renderer:jQuery.jqplot.BarRenderer,
            	rendererOptions: {fillToZero: true},
        	},
        	series: data.category,
        	legend: {
            	show: true,
            	placement: 'outsideGrid'
        	},
        	axes: {
            	xaxis: {
                	renderer: jQuery.jqplot.CategoryAxisRenderer,
               		ticks: data.weekstart
            	},

        	},
    		highlighter: {
      			show: true,
      			showTooltip: true,      // show a tooltip with data point values.
            	tooltipLocation: 'ne',  // location of tooltip: n, ne, e, se, s, sw, w, nw.
           		tooltipContentEditor:tooltipContentEditor 
    		},        	
    	}; 		
	}

   	WeeklyFailedReasonTotals.get({year: selectedDt.getFullYear(), month: selectedDt.getMonth() + 1, category: $routeParams.category}, function(data) {
		$scope.failedreasonstotal = data.totals;
		if (data.totals > 0) {
			$scope.isopen3 = true;
    		loadFailedReasonChart(data);
    	}
    	else {
    		$scope.isopen3 = false;
    	}	
   	});
	function loadFailedReasonChart(data) {
    	$scope.chart3 = data.weeklytotals;     	
    	$scope.chartOptions3 =  {
    		stackSeries: true,
        	seriesDefaults:{
            	renderer:jQuery.jqplot.BarRenderer,
            	rendererOptions: {fillToZero: true},
	
        	},
        	series: data.exception,
        	legend: {
            	show: true,
            	placement: 'outsideGrid'
        	},
        	axes: {
            	xaxis: {
                	renderer: jQuery.jqplot.CategoryAxisRenderer,
               		ticks: data.weekstart
            	},

        	},
    		highlighter: {
      			show: true,
      			showTooltip: true,      // show a tooltip with data point values.
            	tooltipLocation: 'ne',  // location of tooltip: n, ne, e, se, s, sw, w, nw.
           		tooltipContentEditor:tooltipContentEditor 
    		},        	
    	};    	    	
	}
}]);
