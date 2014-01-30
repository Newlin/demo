'use strict';

var monthlyControllers = angular.module('monthlyControllers', []);

monthlyControllers.controller('MonthlyCtrl', ['$scope', 'MonthlyCategoryTotals', 'MonthlyCategoryFailedTotals', 'MonthlyServiceTotals', 'MonthlyServiceFailedTotals', 'MonthlyFailedReasonTotals', '$routeParams', '$q',
  function($scope, MonthlyCategoryTotals, MonthlyCategoryFailedTotals, MonthlyServiceTotals, MonthlyServiceFailedTotals, MonthlyFailedReasonTotals, $routeParams, $q) {
  	$scope.isopen1 = true;
  	$scope.isopen2 = true;
  	$scope.isopen3 = true;
  	function tooltipContentEditor(str, seriesIndex, pointIndex, plot) {
   		// display series_label, x-axis_tick, y-axis value
   		return plot.series[seriesIndex]["label"] + ", " + plot.data[seriesIndex][pointIndex];
	}
	
  	var selectedDt = new Date($routeParams.dt);
  	$scope.category = $routeParams.category;
	$scope.year = selectedDt.getFullYear();

	function getMonthlyTotals(selectedDt,category) {
   		var d = $q.defer();
   		var result;
   		if (category == "All") {
   			result = MonthlyCategoryTotals.get({year: selectedDt.getFullYear()}, function() {
        		d.resolve(result);
   			});
   		}
   		else {
   			result = MonthlyServiceTotals.get({year: selectedDt.getFullYear(), category: category}, function() {
        		d.resolve(result);
   			});   			
   		}	
   		return d.promise;
	}
	function getMonthlyFailedTotals(selectedDt,category) {
   		var d = $q.defer();
   		var result2;
   		if (category == "All") {
   			result2 = MonthlyCategoryFailedTotals.get({year: selectedDt.getFullYear()}, function() {
        		d.resolve(result2);
   			});
   		}
   		else {
   			result2 = MonthlyServiceFailedTotals.get({year: selectedDt.getFullYear(), category: category}, function() {
        		d.resolve(result2);
   			});   			
   		}	
   		return d.promise;
	}	
	function getMonthlyFailedReasonTotals(selectedDt,category) {
   		var d = $q.defer();
   		var result3 = MonthlyFailedReasonTotals.get({year: selectedDt.getFullYear(), category: category}, function() {
        	d.resolve(result3);
   		});
   		return d.promise;
	}	
	$q.all([
   		getMonthlyTotals(selectedDt,$routeParams.category),
   		getMonthlyFailedTotals(selectedDt,$routeParams.category),
   		getMonthlyFailedReasonTotals(selectedDt,$routeParams.category)
	]).then(function(data) {
		$scope.deliverytotal = data[0].totals;
		if (data[0].totals == 0) {
			$scope.isopen1 = false;
		}		
    	$scope.chart = data[0].monthlytotals; 
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
               		ticks: data[0].months
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
    	$scope.chart2 = data[1].monthlytotals;     	
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
               		ticks: data[1].months
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
    	$scope.chart3 = data[2].monthlytotals;     	
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
               		ticks: data[2].months
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