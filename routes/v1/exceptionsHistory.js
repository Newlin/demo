var async = require("async");
var mongo = require('mongodb');

exports.version = "1.0.0";

exports.monthlyTotals = function(req, res, next) {
  	var keyf = function(doc) { return {month: doc.month, delivery_exception: doc.delivery_exception};} ; 
  	var reduce = function(curr, result) {  result.total += curr.total; };
  	var condition = {};
  	if (req.params.category != "All") {
  		condition.service_category = req.params.category;
  	}  	
  	condition.year = new mongo.Long(req.params.year);
  	condition.delivery_exception = {};
  	condition.delivery_exception.$ne =  "";  	
	var data = {};
	data.exception = [];
	data.monthlytotals = [];
	data.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	data.totals = 0;
	req.db.collection('history').group(keyf, condition, {"total":0}, reduce, true, function(error, results) {
	    if (error) return next(error);
  		results.sort(function(a, b) { return parseInt(a.month) - parseInt(b.month); });
  		var exceptionarray = [];
		var montharray = [1,2,3,4,5,6,7,8,9,10,11,12];
		for (var i = 0; i < results.length; i++) {
			if (results[i].delivery_exception.indexOf("opted out") > 0) {
				results[i].delivery_exception = "Freemonee opt out";
			}	
			var exceptionindex = exceptionarray.indexOf(results[i].delivery_exception);
			var monthindex = montharray.indexOf(results[i].month);
			if (exceptionindex < 0) {
				var exception = {};
				exception.label = results[i].delivery_exception;
				data.exception.push(exception);
				exceptionarray.push(results[i].delivery_exception);
				data.monthlytotals.push([0,0,0,0,0,0,0,0,0,0,0,0]);
			}
			exceptionindex = exceptionarray.indexOf(results[i].delivery_exception);
			data.monthlytotals[exceptionindex][monthindex] += results[i].total;
			data.totals += results[i].total;
		}	
		res.json(data);			
 	});    
};

exports.weeklyTotals = function(req, res, next) {
  	var keyf = function(doc) { return {week_start: doc.week_start, delivery_exception: doc.delivery_exception};} ; 
  	var reduce = function(curr, result) {  result.total += curr.total; };
  	var condition = {};
  	if (req.params.category != "All") {
  		condition.service_category = req.params.category;
  	}  	
  	condition.year = new mongo.Long(req.params.year);
  	condition.month = new mongo.Long(req.params.month);  	
  	condition.delivery_exception = {};
  	condition.delivery_exception.$ne =  ""; 
	var data = {};
	data.exception = [];
	data.weeklytotals = [];
	data.weekstart = [0,0,0,0,0,0];
	data.totals = 0;
	req.db.collection('history').group(keyf, condition, {"total":0}, reduce, true, function(error, results) {
	    if (error) return next(error);
  		//results.sort(function(a, b) { return parseInt(a.day) - parseInt(b.day); });
  		var exceptionarray = [];
		var weekstartcount = 0;
		for (var i = 0; i < results.length; i++) {
			if (results[i].delivery_exception.indexOf("opted out") > 0) {
				results[i].delivery_exception = "Freemonee opt out";
			}	
			var exceptionindex = exceptionarray.indexOf(results[i].delivery_exception);
			var weekstartindex = data.weekstart.indexOf(results[i].week_start);
			if (exceptionindex < 0) {
				var exception = {};
				exception.label = results[i].delivery_exception;
				data.exception.push(exception);
				exceptionarray.push(results[i].delivery_exception);
				data.weeklytotals.push([0,0,0,0,0,0]);
			}
			if (weekstartindex < 0) {
				data.weekstart[weekstartcount] = results[i].week_start;
				weekstartcount++;
			}	
							
			exceptionindex = exceptionarray.indexOf(results[i].delivery_exception);
			weekstartindex = data.weekstart.indexOf(results[i].week_start);
			data.weeklytotals[exceptionindex][weekstartindex] += results[i].total;
			data.totals += results[i].total;

		}	
		res.json(data);		
 	});    
};

exports.dailyTotals = function(req, res, next) {
  	var keyf = function(doc) { return {day: doc.day, date: doc.date, delivery_exception: doc.delivery_exception};} ; 
  	var reduce = function(curr, result) {  result.total += curr.total; };
  	var condition = {};
  	if (req.params.category != "All") {
  		condition.service_category = req.params.category;
  	}
  	condition.week_start = new mongo.Long(req.params.weekstart);
  	condition.delivery_exception = {};
  	condition.delivery_exception.$ne =  ""; 
	var data = {};
	data.exception = [];
	data.dailytotals = [];
	data.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	data.totals = 0;
	req.db.collection('history').group(keyf, condition, {"total":0}, reduce, true, function(error, results) {
	    if (error) return next(error);
  		results.sort(function(a, b) { return parseInt(a.day) - parseInt(b.day); });
  		var exceptionarray = [];
		var dayarray = [1,2,3,4,5,6,7];
		for (var i = 0; i < results.length; i++) {
			if (results[i].delivery_exception.indexOf("opted out") > 0) {
				results[i].delivery_exception = "Freemonee opt out";
			}	
			var exceptionindex = exceptionarray.indexOf(results[i].delivery_exception);
			var dayindex = dayarray.indexOf(results[i].day);
			if (exceptionindex < 0) {
				var exception = {};
				exception.label = results[i].delivery_exception;
				data.exception.push(exception);
				exceptionarray.push(results[i].delivery_exception);
				data.dailytotals.push([0,0,0,0,0,0,0]);
			}
			exceptionindex = exceptionarray.indexOf(results[i].delivery_exception);
			data.dailytotals[exceptionindex][dayindex] += results[i].total;
			data.totals += results[i].total;
		}	
		res.json(data);		
 	});    
};