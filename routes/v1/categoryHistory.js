var async = require("async");
var mongo = require('mongodb');

exports.version = "1.0.0";

exports.monthlyTotals = function(req, res, next) {
    var keyf = function(doc) { return {month: doc.month, service_category: doc.service_category};} ; 
    var reduce = function(curr, result) {  result.total += curr.total; };
    var condition = {};
    condition.year = new mongo.Long(req.params.year);
    condition.delivery_exception = "";
	req.db.collection('history').group(keyf, condition, {"total":0}, reduce, true, function(error, results) {
        if (error) return next(error);
        results.sort(function(a, b) { return parseInt(a.month) - parseInt(b.month); });
	    sendMonthlyResponse(req.db, results, res);
    });
};

exports.monthlyFailedTotals = function(req, res, next) {
    var keyf = function(doc) { return {month: doc.month, service_category: doc.service_category};} ; 
    var reduce = function(curr, result) {  result.total += curr.total; };
    var condition = {};
    condition.year = new mongo.Long(req.params.year);
    condition.delivery_exception = {};
    condition.delivery_exception.$ne =  "";  	
	req.db.collection('history').group(keyf, condition, {"total":0}, reduce, true, function(error, results) {
        if (error) return next(error);
        results.sort(function(a, b) { return parseInt(a.month) - parseInt(b.month); });
        sendMonthlyResponse(req.db, results, res);
 	});
};

function sendMonthlyResponse(db, results, res) {
	var data = {};
	data.category = [];
	data.monthlytotals = [];
	data.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	data.totals = 0;
	var categoryarray = [];
	var montharray = [1,2,3,4,5,6,7,8,9,10,11,12];
	async.forEachSeries(results, function(element, callback) {
 		db.collection('service_category').findOne({_id: element.service_category}, function(err, doc) {
			if (err) {
				element.description = 'No Description';
			}
			else {
				element.description = doc.description;
			} 
			var categoryindex = categoryarray.indexOf(element.description);
			var monthindex = montharray.indexOf(element.month);
			if (categoryindex < 0) {
				var category = {};
				category.label = element.description;
				data.category.push(category);
	    		categoryarray.push(element.description);
				data.monthlytotals.push([0,0,0,0,0,0,0,0,0,0,0,0]);
			}
			categoryindex = categoryarray.indexOf(element.description);
			data.monthlytotals[categoryindex][monthindex] = element.total;
			data.totals += element.total;

			callback(null);
		});
  	}, function(err) {
  	    	if (err) {
				data = null;
  			}
        	res.json(data);
        }	
  	);	
}

exports.weeklyTotals = function(req, res, next) {
  	var keyf = function(doc) { return {week_start: doc.week_start, service_category: doc.service_category};} ; 
  	var reduce = function(curr, result) {  result.total += curr.total; };
  	var condition = {};
  	condition.year = new mongo.Long(req.params.year);
  	condition.month = new mongo.Long(req.params.month);
  	condition.delivery_exception = "";
	req.db.collection('history').group(keyf, condition, {"total":0}, reduce, true, function(error, results) {
        if (error) return next(error);
        //results.sort(function(a, b) { return parseInt(a.month) - parseInt(b.month); });
        sendWeeklyResponse(req.db, results, res);  	    
	});		
};

exports.weeklyFailedTotals = function(req, res, next) {
  	var keyf = function(doc) { return {week_start: doc.week_start, service_category: doc.service_category};} ; 
  	var reduce = function(curr, result) {  result.total += curr.total; };
  	var condition = {};
  	condition.year = new mongo.Long(req.params.year);
  	condition.month = new mongo.Long(req.params.month);
  	condition.delivery_exception = {};
  	condition.delivery_exception.$ne =  ""; 
	req.db.collection('history').group(keyf, condition, {"total":0}, reduce, true, function(error, results) {
        if (error) return next(error);
        //results.sort(function(a, b) { return parseInt(a.month) - parseInt(b.month); });
        sendWeeklyResponse(req.db, results, res);  	    
	});		
};

function sendWeeklyResponse(db, results, res) {
    var data = {};
	data.category = [];
	data.weeklytotals = [];
	data.weekstart = [0,0,0,0,0,0];
	data.totals = 0;
  	var categoryarray = [];
	var weekstartcount = 0;
  	async.forEachSeries(results, function(element , callback) {
 		db.collection('service_category').findOne({_id: element.service_category}, function(err, doc) {
			if (err) {
				element.description = 'No Description';
	    	}
			else {
				element.description = doc.description;
			} 
			var categoryindex = categoryarray.indexOf(element.description);
			var weekstartindex = data.weekstart.indexOf(element.week_start);
			if (categoryindex < 0) {
				var category = {};
				category.label = element.description;
				data.category.push(category);
				categoryarray.push(element.description);
				data.weeklytotals.push([0,0,0,0,0,0]);
			}
			if (weekstartindex < 0) {
				data.weekstart[weekstartcount] = element.week_start;
				weekstartcount++;
			}
			categoryindex = categoryarray.indexOf(element.description);
			weekstartindex = data.weekstart.indexOf(element.week_start);
			data.weeklytotals[categoryindex][weekstartindex] = element.total;
			data.totals += element.total;

			callback(null);
		});
  	}, function(err) {
  			if (err) {
				data = null;
  			}
    		res.json(data);
    	}	
  	);	
}

exports.dailyTotals = function(req, res, next) {
	var keyf = function(doc) { return {day: doc.day, date: doc.date, service_category: doc.service_category};} ;
  	var reduce = function(curr, result) {  result.total += curr.total; };
  	var condition = {};
  	condition.week_start = new mongo.Long(req.params.weekstart);
  	condition.delivery_exception = "";
	req.db.collection('history').group(keyf, condition, {"total":0}, reduce, true, function(error, results) {
        if (error) return next(error);
        results.sort(function(a, b) { return parseInt(a.day) - parseInt(b.day); });
        sendDailyResponse(req.db, results, res);  	    
	});		
};

exports.dailyFailedTotals = function(req, res, next) {
	var keyf = function(doc) { return {day: doc.day, date: doc.date, service_category: doc.service_category};} ;
  	var reduce = function(curr, result) {  result.total += curr.total; };
  	var condition = {};
  	condition.week_start = new mongo.Long(req.params.weekstart);
  	condition.delivery_exception = {};
  	condition.delivery_exception.$ne =  ""; 
	req.db.collection('history').group(keyf, condition, {"total":0}, reduce, true, function(error, results) {
        if (error) return next(error);
        results.sort(function(a, b) { return parseInt(a.day) - parseInt(b.day); });
        sendDailyResponse(req.db, results, res);  	    
	});		
};

function sendDailyResponse(db, results, res) {
	var data = {};
	data.category = [];
	data.dailytotals = [];
	data.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	data.totals = 0;    
  	var categoryarray = [];
	var dayarray = [1,2,3,4,5,6,7];
  	async.forEachSeries(results, function (element, callback) {
 		db.collection('service_category').findOne({_id: element.service_category}, function(err, doc) {
			if (err) {
				element.description = 'No Description';
			}
			else {
				element.description = doc.description;
			} 
			var categoryindex = categoryarray.indexOf(element.description);
			var dayindex = dayarray.indexOf(element.day);
			if (categoryindex < 0) {
				var category = {};
				category.label = element.description;
				data.category.push(category);
				categoryarray.push(element.description);
				data.dailytotals.push([0,0,0,0,0,0,0]);
			}
			categoryindex = categoryarray.indexOf(element.description);
			data.dailytotals[categoryindex][dayindex] = element.total;
			data.totals += element.total;

			callback(null);
		});
  	}, function(err) {
  			if (err) {
				data = null;
  			}
    		res.json(data);
    	}	
  	);	
}