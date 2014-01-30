
/**
 * Module dependencies.
 */
//require('newrelic');
var async = require("async");
var mongo = require('mongodb');

var express = require('express');
//var mongoskin = require('mongoskin');
//mongodb://newlin:Mike0526@ds027409.mongolab.com:27409/edelivery
//localhost:27027
var db = require('mongoskin').db('mongodb://newlin:Mike0526@ds027709.mongolab.com:27709/edelivery', {w:1});
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments 24.197.95.51
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'test')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
app.get('/servicecategories', function(req,res){
	db.collection('service_category').find().limit(50).toArray(function(error, categories) {
		res.json(categories);
	});
});
app.get('/services', function(req,res){
	db.collection('services').find().limit(50).toArray(function(error, services) {
		res.json(services);
	});
});
app.get('/monthlytotalsbycategory/:year',function(req,res){
  	var keyf = function(doc) { return {month: doc.month, service_category: doc.service_category};} ; 
  	var reduce = function ( curr, result ) {  result.total += curr.total; };
  	var condition = {};
  	condition.year = new mongo.Long(req.params.year);
  	condition.delivery_exception = "";
	var data = {};
	data.category = [];
	data.monthlytotals = [];
	data.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	data.totals = 0;
	db.collection('history').group(keyf, condition,{"total":0},reduce,true,		
  		function(e,results) {
  			results.sort(function(a, b) { return parseInt(a.month) - parseInt(b.month); });
  			var categoryarray = [];
			var montharray = [1,2,3,4,5,6,7,8,9,10,11,12];
  			async.forEachSeries(results,
  				function (element , callback){
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
  				},	
  				function(err) {
  					if (err) {
						chart = null;
  					}
        			res.json(data);
        		}	
  			);	
 		});
});
app.get('/monthlyfailedtotalsbycategory/:year',function(req,res){
  	var keyf = function(doc) { return {month: doc.month, service_category: doc.service_category};} ; 
  	var reduce = function ( curr, result ) {  result.total += curr.total; };
  	var condition = {};
  	condition.year = new mongo.Long(req.params.year);
  	condition.delivery_exception = {};
  	condition.delivery_exception.$ne =  "";  	
	var data = {};
	data.category = [];
	data.monthlytotals = [];
	data.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	data.totals = 0;
	db.collection('history').group(keyf, condition,{"total":0},reduce,true,		
  		function(e,results) {
  			results.sort(function(a, b) { return parseInt(a.month) - parseInt(b.month); });
  			var categoryarray = [];
			var montharray = [1,2,3,4,5,6,7,8,9,10,11,12];
  			async.forEachSeries(results,
  				function (element , callback){
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
  				},	
  				function(err) {
  					if (err) {
						chart = null;
  					}
        			res.json(data);
        		}	
  			);	
 		});
});
app.get('/monthlytotalsbyservice/:year/:category',function(req,res){
  	var keyf = function(doc) { return {month: doc.month, service: doc.service};} ; 
  	var reduce = function ( curr, result ) {  result.total += curr.total; };
  	var condition = {};
  	condition.year = new mongo.Long(req.params.year);
  	condition.service_category = req.params.category;
  	condition.delivery_exception = "";
	var data = {};
	data.category = [];
	data.monthlytotals = [];
	data.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	data.totals = 0;
	db.collection('history').group(keyf, condition,{"total":0},reduce,true,		
  		function(e,results) {
  			results.sort(function(a, b) { return parseInt(a.month) - parseInt(b.month); });
  			var categoryarray = [];
			var montharray = [1,2,3,4,5,6,7,8,9,10,11,12];
  			async.forEachSeries(results,
  				function (element , callback){
 					db.collection('services').findOne({_id: element.service}, function(err, doc) {
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
  				},	
  				function(err) {
  					if (err) {
						chart = null;
  					}
        			res.json(data);
        		}	
  			);	
 		});
});
app.get('/monthlyfailedtotalsbyservice/:year/:category',function(req,res){
  	var keyf = function(doc) { return {month: doc.month, service: doc.service};} ; 
  	var reduce = function ( curr, result ) {  result.total += curr.total; };
  	var condition = {};
  	condition.year = new mongo.Long(req.params.year);
  	condition.service_category = req.params.category;
  	condition.delivery_exception = {};
  	condition.delivery_exception.$ne =  "";  	
	var data = {};
	data.category = [];
	data.monthlytotals = [];
	data.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	data.totals = 0;
	db.collection('history').group(keyf, condition,{"total":0},reduce,true,		
  		function(e,results) {
  			results.sort(function(a, b) { return parseInt(a.month) - parseInt(b.month); });
  			var categoryarray = [];
			var montharray = [1,2,3,4,5,6,7,8,9,10,11,12];
  			async.forEachSeries(results,
  				function (element , callback){
 					db.collection('services').findOne({_id: element.service}, function(err, doc) {
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
  				},	
  				function(err) {
  					if (err) {
						chart = null;
  					}
        			res.json(data);
        		}	
  			);	
 		});
});
app.get('/monthlyfailedreasontotalsbyexception/:year/:category',function(req,res){
  	var keyf = function(doc) { return {month: doc.month, delivery_exception: doc.delivery_exception};} ; 
  	var reduce = function ( curr, result ) {  result.total += curr.total; };
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
	db.collection('history').group(keyf, condition,{"total":0},reduce,true,		
  		function(e,results) {
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
				data.monthlytotals[exceptionindex][monthindex] = results[i].total;
				data.totals += results[i].total;
			}	
			res.json(data);			
 	});
});
app.get('/weeklytotalsbycategory/:year/:month',function(req,res){
  	var keyf = function(doc) { return {week_start: doc.week_start, service_category: doc.service_category};} ; 
  	var reduce = function ( curr, result ) {  result.total += curr.total; };
  	var condition = {};
  	condition.year = new mongo.Long(req.params.year);
  	condition.month = new mongo.Long(req.params.month);
  	condition.delivery_exception = "";
	var data = {};
	data.category = [];
	data.weeklytotals = [];
	data.weekstart = [0,0,0,0,0,0];
	data.totals = 0;
	db.collection('history').group(keyf, condition,{"total":0},reduce,true,		
  		function(e,results) {
  			//results.sort(function(a, b) { return parseInt(a.month) - parseInt(b.month); });
  			var categoryarray = [];
			var weekstartcount = 0;
  			async.forEachSeries(results,
  				function (element , callback){
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
  				},	
  				function(err) {
  					if (err) {
						chart = null;
  					}
        			res.json(data);
        		}	
  			);	
 		});
});
app.get('/weeklyfailedtotalsbycategory/:year/:month',function(req,res){
  	var keyf = function(doc) { return {week_start: doc.week_start, service_category: doc.service_category};} ; 
  	var reduce = function ( curr, result ) {  result.total += curr.total; };
  	var condition = {};
  	condition.year = new mongo.Long(req.params.year);
  	condition.month = new mongo.Long(req.params.month);  	
  	condition.delivery_exception = {};
  	condition.delivery_exception.$ne =  ""; 
	var data = {};
	data.category = [];
	data.weeklytotals = [];
	data.weekstart = [0,0,0,0,0,0];
	data.totals = 0;
	db.collection('history').group(keyf, condition,{"total":0},reduce,true,		
  		function(e,results) {
  			//results.sort(function(a, b) { return parseInt(a.day) - parseInt(b.day); });
  			var categoryarray = [];
			var weekstartcount = 0;
  			async.forEachSeries(results,
  				function (element , callback){
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
  				},	
  				function(err) {
  					if (err) {
						chart = null;
  					}
        			res.json(data);
        		}	
  			);		
 		});
});
app.get('/weeklytotalsbyservice/:year/:month/:category',function(req,res){
  	var keyf = function(doc) { return {week_start: doc.week_start, service: doc.service};} ; 
  	var reduce = function ( curr, result ) {  result.total += curr.total; };
  	var condition = {};
  	condition.year = new mongo.Long(req.params.year);
  	condition.service_category = req.params.category;
  	condition.month = new mongo.Long(req.params.month);
  	condition.delivery_exception = "";
	var data = {};
	data.category = [];
	data.weeklytotals = [];
	data.weekstart = [0,0,0,0,0,0];
	data.totals = 0;
	db.collection('history').group(keyf, condition,{"total":0},reduce,true,		
  		function(e,results) {
  			//results.sort(function(a, b) { return parseInt(a.month) - parseInt(b.month); });
  			var categoryarray = [];
			var weekstartcount = 0;
  			async.forEachSeries(results,
  				function (element , callback){
 					db.collection('services').findOne({_id: element.service}, function(err, doc) {
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
  				},	
  				function(err) {
  					if (err) {
						chart = null;
  					}
        			res.json(data);
        		}	
  			);	
 		});
});
app.get('/weeklyfailedtotalsbyservice/:year/:month/:category',function(req,res){
  	var keyf = function(doc) { return {week_start: doc.week_start, service: doc.service};} ; 
  	var reduce = function ( curr, result ) {  result.total += curr.total; };
  	var condition = {};
  	condition.year = new mongo.Long(req.params.year);
  	condition.month = new mongo.Long(req.params.month);  
  	condition.service_category = req.params.category;	
  	condition.delivery_exception = {};
  	condition.delivery_exception.$ne =  ""; 
	var data = {};
	data.category = [];
	data.weeklytotals = [];
	data.weekstart = [0,0,0,0,0,0];
	data.totals = 0;
	db.collection('history').group(keyf, condition,{"total":0},reduce,true,		
  		function(e,results) {
  			//results.sort(function(a, b) { return parseInt(a.day) - parseInt(b.day); });
  			var categoryarray = [];
			var weekstartcount = 0;
  			async.forEachSeries(results,
  				function (element , callback){
 					db.collection('services').findOne({_id: element.service}, function(err, doc) {
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
  				},	
  				function(err) {
  					if (err) {
						chart = null;
  					}
        			res.json(data);
        		}	
  			);		
 		});
});
app.get('/weeklyfailedreasontotalsbyexception/:year/:month/:category',function(req,res){
  	var keyf = function(doc) { return {week_start: doc.week_start, delivery_exception: doc.delivery_exception};} ; 
  	var reduce = function ( curr, result ) {  result.total += curr.total; };
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
	db.collection('history').group(keyf, condition,{"total":0},reduce,true,		
  		function(e,results) {
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
				data.weeklytotals[exceptionindex][weekstartindex] = results[i].total;
				data.totals += results[i].total;

			}	
			res.json(data);		
 		});
});

app.get('/dailytotalsbycategory/:weekstart',function(req,res){
	var keyf = function(doc) { return {day: doc.day, date: doc.date, service_category: doc.service_category};} ;
  	var reduce = function ( curr, result ) {  result.total += curr.total; };
  	var condition = {};
  	condition.week_start = new mongo.Long(req.params.weekstart);
  	condition.delivery_exception = "";
	var data = {};
	data.category = [];
	data.dailytotals = [];
	data.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	data.totals = 0;
	db.collection('history').group(keyf, condition,{"total":0},reduce,true,		
  		function(e,results) {
  			results.sort(function(a, b) { return parseInt(a.day) - parseInt(b.day); });
  			var categoryarray = [];
			var dayarray = [1,2,3,4,5,6,7];
  			async.forEachSeries(results,
  				function (element , callback){
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
  				},	
  				function(err) {
  					if (err) {
						chart = null;
  					}
        			res.json(data);
        		}	
  			);	
 		});
});
app.get('/dailyfailedtotalsbycategory/:weekstart',function(req,res){
  	var keyf = function(doc) { return {day: doc.day, date: doc.date, service_category: doc.service_category};} ; 
  	var reduce = function ( curr, result ) {  result.total += curr.total; };
  	var condition = {};
  	condition.week_start = new mongo.Long(req.params.weekstart);
  	condition.delivery_exception = {};
  	condition.delivery_exception.$ne =  ""; 
	var data = {};
	data.category = [];
	data.dailytotals = [];
	data.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	data.totals = 0;
	db.collection('history').group(keyf, condition,{"total":0},reduce,true,		
  		function(e,results) {
  			results.sort(function(a, b) { return parseInt(a.day) - parseInt(b.day); });
  			var categoryarray = [];
			var dayarray = [1,2,3,4,5,6,7];
  			async.forEachSeries(results,
  				function (element , callback){
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
  				},	
  				function(err) {
  					if (err) {
						chart = null;
  					}
        			res.json(data);
        		}	
  			);	
 		});
});
app.get('/dailytotalsbyservice/:weekstart/:category',function(req,res){
	var keyf = function(doc) { return {day: doc.day, date: doc.date, service: doc.service};} ;
  	var reduce = function ( curr, result ) {  result.total += curr.total; };
  	var condition = {};
  	condition.week_start = new mongo.Long(req.params.weekstart);
  	condition.service_category = req.params.category;
  	condition.delivery_exception = "";
	var data = {};
	data.category = [];
	data.dailytotals = [];
	data.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	data.totals = 0;
	db.collection('history').group(keyf, condition,{"total":0},reduce,true,		
  		function(e,results) {
  			results.sort(function(a, b) { return parseInt(a.day) - parseInt(b.day); });
  			var categoryarray = [];
			var dayarray = [1,2,3,4,5,6,7];
  			async.forEachSeries(results,
  				function (element , callback){
 					db.collection('services').findOne({_id: element.service}, function(err, doc) {
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
  				},	
  				function(err) {
  					if (err) {
						chart = null;
  					}
        			res.json(data);
        		}	
  			);	
 		});
});
app.get('/dailyfailedtotalsbyservice/:weekstart/:category',function(req,res){
  	var keyf = function(doc) { return {day: doc.day, date: doc.date, service: doc.service};} ; 
  	var reduce = function ( curr, result ) {  result.total += curr.total; };
  	var condition = {};
  	condition.week_start = new mongo.Long(req.params.weekstart);
  	condition.service_category = req.params.category;
  	condition.delivery_exception = {};
  	condition.delivery_exception.$ne =  ""; 
	var data = {};
	data.category = [];
	data.dailytotals = [];
	data.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	data.totals = 0;
	db.collection('history').group(keyf, condition,{"total":0},reduce,true,		
  		function(e,results) {
  			results.sort(function(a, b) { return parseInt(a.day) - parseInt(b.day); });
  			var categoryarray = [];
			var dayarray = [1,2,3,4,5,6,7];
  			async.forEachSeries(results,
  				function (element , callback){
 					db.collection('services').findOne({_id: element.service}, function(err, doc) {
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
  				},	
  				function(err) {
  					if (err) {
						chart = null;
  					}
        			res.json(data);
        		}	
  			);	
 		});
});
app.get('/dailyfailedreasontotalsbyexception/:weekstart/:category',function(req,res){
  	var keyf = function(doc) { return {day: doc.day, date: doc.date, delivery_exception: doc.delivery_exception};} ; 
  	var reduce = function ( curr, result ) {  result.total += curr.total; };
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
	db.collection('history').group(keyf, condition,{"total":0},reduce,true,		
  		function(e,results) {
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
				data.dailytotals[exceptionindex][dayindex] = results[i].total;
				data.totals += results[i].total;
			}	
			res.json(data);		
 		});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});