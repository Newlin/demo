'use strict';

var monthlyControllers = angular.module('monthlyControllers', []);

monthlyControllers.controller('MonthlyCtrl', ['$scope', 'MonthlyCategoryTotals', 'MonthlyCategoryFailedTotals', 'MonthlyServiceTotals', 'MonthlyServiceFailedTotals', 'MonthlyFailedReasonTotals', '$routeParams', 'Activity', 'ActivityService',
  function($scope, MonthlyCategoryTotals, MonthlyCategoryFailedTotals, MonthlyServiceTotals, MonthlyServiceFailedTotals, MonthlyFailedReasonTotals, $routeParams, Activity, ActivityService) {
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
	$scope.year = selectedDt.getFullYear();

	if ($routeParams.category == "All") {
		MonthlyCategoryTotals.get({year: selectedDt.getFullYear()}, function(data) {
			$scope.deliverytotal = data.totals;
			if (data.totals > 0) {
				$scope.isopen1 = true;
    			loadSuccessfulChart(data);
    		}
    		else {
    			$scope.isopen1 = false;
    		}	
		});
		MonthlyCategoryFailedTotals.get({year: selectedDt.getFullYear()}, function(data) {
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
		MonthlyServiceTotals.get({year: selectedDt.getFullYear(), category: $routeParams.category}, function(data) {
			$scope.deliverytotal = data.totals;
			if (data.totals > 0) {
				$scope.isopen1 = true;
    			loadSuccessfulChart(data);
    		}
    		else {
    			$scope.isopen1 = false;
    		}	
		});
		MonthlyServiceFailedTotals.get({year: selectedDt.getFullYear(), category: $routeParams.category}, function(data) {
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
    	$scope.chart = data.monthlytotals; 
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
               		ticks: data.months
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
    	$scope.chart2 = data.monthlytotals;     	
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
               		ticks: data.months
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

   	MonthlyFailedReasonTotals.get({year: selectedDt.getFullYear(), category: $routeParams.category}, function(data) {
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
    	$scope.chart3 = data.monthlytotals;     	
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
               		ticks: data.months
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