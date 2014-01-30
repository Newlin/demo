
/**
 * Module dependencies.
 */
//require('newrelic');
var async = require("async");
var mongo = require('mongodb');

var express = require('express');
//var mongoskin = require('mongoskin');
//mongodb://newlin:Mike0526@ds027409.mongolab.com:27409/edelivery
var db = require('mongoskin').db('localhost:27017/edelivery', {w:1});
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
app.use(express.static(path.join(__dirname, 'app')));
app.use(express.static(path.join(__dirname, 'test')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
app.get('/users', user.list);
console.log(process.env);
app.get('/collections/:name',function(req,res){
  var collection = db.get(req.params.name);
  collection.find({},{limit:20},function(e,docs){
    res.json(docs);
  });
});
app.get('/months', function(req,res){
	db.collection('month').find().limit(12).toArray(function(error, months) {
		res.json(months);
	});
	
	
});
app.get('/servicecategories', function(req,res){
	db.collection('service_category').find().limit(50).toArray(function(error, categories) {
		res.json(categories);
	});
	
	
});
app.get('/newmonthlytotalsbycategory/:year',function(req,res){
  	var keyf = function(doc) { return {month: doc.month, service_category: doc.service_category};} ; 
  	var reduce = function ( curr, result ) {  result.total += curr.total; };
  	var condition = {};
  	condition.year = new mongo.Long(req.params.year);
  	condition.delivery_exception = "";
	var data = {};
	data.category = [];
	data.monthlytotalsbycategory = [];
	data.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
							data.monthlytotalsbycategory.push([0,0,0,0,0,0,0,0,0,0,0,0]);
						}
						categoryindex = categoryarray.indexOf(element.description);
						data.monthlytotalsbycategory[categoryindex][monthindex] = element.total;


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
app.get('/newmonthlyfailedtotalsbycategory/:year',function(req,res){
  	var keyf = function(doc) { return {month: doc.month, service_category: doc.service_category};} ; 
  	var reduce = function ( curr, result ) {  result.total += curr.total; };
  	var condition = {};
  	condition.year = new mongo.Long(req.params.year);
  	condition.delivery_exception = {};
  	condition.delivery_exception.$ne =  "";  	
	var data = {};
	data.category = [];
	data.monthlytotalsbycategory = [];
	data.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
							data.monthlytotalsbycategory.push([0,0,0,0,0,0,0,0,0,0,0,0]);
						}
						categoryindex = categoryarray.indexOf(element.description);
						data.monthlytotalsbycategory[categoryindex][monthindex] = element.total;


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
app.get('/monthlyfailedreasontotalsbycategory/:year',function(req,res){
  	var keyf = function(doc) { return {month: doc.month, delivery_exception: doc.delivery_exception};} ; 
  	var reduce = function ( curr, result ) {  result.total += curr.total; };
  	var condition = {};
  	condition.year = new mongo.Long(req.params.year);
  	condition.delivery_exception = {};
  	condition.delivery_exception.$ne =  "";  	
	var data = {};
	data.exception = [];
	data.monthlytotalsbyexception = [];
	data.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
					data.monthlytotalsbyexception.push([0,0,0,0,0,0,0,0,0,0,0,0]);
				}
				exceptionindex = exceptionarray.indexOf(results[i].delivery_exception);
				data.monthlytotalsbyexception[exceptionindex][monthindex] = results[i].total;
			}	
			res.json(data);			
 	});
});
app.get('/monthlytotalsbycategory/:year',function(req,res){
  	var keyf = function(doc) { return {month: doc.month, service_category: doc.service_category};} ; 
  	var reduce = function ( curr, result ) {  result.total += curr.total; };
  	var condition = {};
  	condition.year = new mongo.Long(req.params.year);
  	condition.delivery_exception = "";
	var chart = {};
	chart.type = 'BarChart';
	chart.displayed = false;
	chart.cssStyle = 'height:100%; width:100%';
	chart.data = {};
	chart.data.cols = [];
	chart.data.rows = [];
	chart.options = {};
	chart.options.title = "Emails Sent";
	chart.options.isStacked = "true";
	chart.options.fill = 20;
	chart.options.displayExactValues = true;
	chart.options.vAxis = {};
	chart.options.vAxis.title = "";
	chart.options.vAxis.gridlines = {};
	chart.options.vAxis.gridlines.count = 1;
	chart.options.hAxis = {};
	chart.options.hAxis.title = "Emails Sent";
	chart.formatters = {};
	db.collection('history').group(keyf, condition,{"total":0},reduce,true,		
  		function(e,results) {
  			results.sort(function(a, b) { return parseInt(a.month) - parseInt(b.month); });
  			var colsindex = ["Month"];
			chart.data.cols[0] = {};
			chart.data.cols[0].id = 'Month';
			chart.data.cols[0].label = 'Month';
			chart.data.cols[0].type = 'string'; 
			var rowsindex = [];		
  			async.forEachSeries(results,
  				function (element , callback){
 					db.collection('service_category').findOne({_id: element.service_category}, function(err, doc) {
						if (err) {
							element.description = 'No Description';
						}
						else {
							element.description = doc.description;
						} 
						var colIndex = colsindex.indexOf(element.description);
						var rowIndex = rowsindex.indexOf(element.month);
						if (colIndex < 0) {
							var category = {};
							category.id = element.service_category;
							category.label = element.description;
							category.type = "number";
							chart.data.cols.push(category);
							colsindex.push(element.description);
							
						}
						colIndex = colsindex.indexOf(element.description);
						if (rowIndex < 0) {
							rowsindex.push(element.month);
							var c1 = {};
							c1.c = [];
							c1.c[0] = {};
							c1.c[0].v = "January";
							c1.c[colIndex] = {};
							c1.c[colIndex].v = element.total;
							chart.data.rows.push(c1);
						}
						else {
							chart.data.rows[rowIndex].c[colIndex] = {};
							chart.data.rows[rowIndex].c[colIndex].v = element.total;
						}	
						callback(null);
					});
  				},	
  				function(err) {
  					if (err) {
						chart = null;
  					}
  					
        			res.json(chart);
        		}	
  			);	
 		});
});
app.get('/historytotalsbycategory/:year/:month',function(req,res){
  	var keyf = function(doc) {return { service_category: doc.service_category};} ; 
  	var reduce = function ( curr, result ) {  result.total += curr.total; };
  	var condition = {};
  	condition.year = new mongo.Long(req.params.year);
  	condition.month = new mongo.Long(req.params.month);
  	condition.delivery_exception = '';

	db.collection('history').group( keyf, condition,{"total":0},reduce,true,		
  		function(e,results) {
  			results.sort(function(a, b) { return b.service_category < a.service_category; });
 			var total = 0;
  			var output = {};
  			async.forEachSeries(results,
  				function (element , callback){
  					
					db.collection('service_category').findOne({_id: element.service_category}, function(err, doc) {
						if (err) {
							element.description = 'No Description';
						}
						else {
							element.description = doc.description;
						} 
						total += element.total; 
						callback(null);
					});
  				},	
  				function(err) {
  					if (err) {
  						output.historytotalsbycategory = null;
  						output.total = 0;
  					}
  					else {
   					
  						output.historytotalsbycategory = results;  			
	  					output.total = total;
	  				}	  					
        			res.json(output);
        		}	
  			);	
 		});
});
app.get('/historychartbycategory/:year/:month',function(req,res){
  	var keyf = function(doc) {return { service_category: doc.service_category};} ; 
  	var reduce = function ( curr, result ) {  result.total += curr.total; };
  	var condition = {};
 	condition.year = new mongo.Long(req.params.year);
  	condition.month = new mongo.Long(req.params.month);
  	condition.delivery_exception = '';
	var chart = {};
	chart.type = 'BarChart';
	chart.displayed = false;
	chart.cssStyle = 'height:100%; width:100%';
	chart.data = {};
	chart.data.cols = [];
	chart.data.cols[0] = {};
	chart.data.cols[0].id = 'Service';
	chart.data.cols[0].label = 'Service';
	chart.data.cols[0].type = 'string';
	chart.data.cols[1] = {};
	chart.data.cols[1].id = 'Count';
	chart.data.cols[1].label = 'Count';
	chart.data.cols[1].type = 'number';	
	chart.data.rows = [];
	chart.options = {};
	chart.options.title = "Emails Sent per Service";
	chart.options.isStacked = "true";
	chart.options.fill = 20;
	chart.options.displayExactValues = true;
	chart.options.vAxis = {};
	chart.options.vAxis.title = "";
	chart.options.vAxis.gridlines = {};
	chart.options.vAxis.gridlines.count = 1;
	chart.options.hAxis = {};
	chart.options.hAxis.title = "Emails Sent";
	chart.formatters = {};
	db.collection('history').group( keyf, condition,{"total":0},reduce,true,		
  		function(e,results) {
  			results.sort(function(a, b) { return b.service_category < a.service_category; });
  			var index = 0;
  			async.forEachSeries(results,
  				function (element , callback) {
  					
					db.collection('service_category').findOne({_id: element.service_category}, function(err, doc) {
						if (err) {
							element.description = 'No Description';
						}
						else {
							element.description = doc.description;
						} 
						chart.data.rows[index] = {};
						chart.data.rows[index].c = [];
						chart.data.rows[index].c[0] = {};
						chart.data.rows[index].c[0].v = element.description;
						chart.data.rows[index].c[1] = {};
						chart.data.rows[index].c[1].v = element.total;
						index++;
						
						callback(null);
					});
  				},	
  				function(err) {
  					if (err) {
  						chart = null;
  					}
  					
        			res.json(chart);
        		}	
  			);	
 		});
});
app.get('/historytotalsbycategory/failed/:year/:month',function(req,res){
  	var keyf = function(doc) {return { service_category: doc.service_category};} ; 
  	var reduce = function ( curr, result ) {  result.total += curr.total; };
  	var condition = {};
  	condition.year = new mongo.Long(req.params.year);
  	condition.month = new mongo.Long(req.params.month);
  	condition.delivery_exception = {};
  	condition.delivery_exception.$ne =  "";

	db.collection('history').group( keyf, condition,{"total":0},reduce,true,		
  		function(e,results) {
  			results.sort(function(a, b) { return b.service_category < a.service_category; });
 			var total = 0;
  			var output = {};
  			async.forEachSeries(results,
  				function (element , callback) {
  					
					db.collection('service_category').findOne({_id: element.service_category}, function(err, doc) {
						if (err) {
							element.description = 'No Description';
						}
						else {
							element.description = doc.description;
						} 
						total += element.total; 
						callback(null);
					});
  				},	
  				function(err) {
  					if (err) {
  						output.historytotalsbycategory = null;
  						output.total = 0;
  					}
  					else {
   					
  						output.historytotalsbycategory = results;  			
	  					output.total = total;
	  				}	  					
        			res.json(output);
        		}	
  			);	
 		});
});
app.get('/historychartbycategory/failed/:year/:month',function(req,res){
  	var keyf = function(doc) {return { service_category: doc.service_category};} ; 
  	var reduce = function ( curr, result ) {  result.total += curr.total; };
  	var condition = {};
  	condition.year = new mongo.Long(req.params.year);
  	condition.month = new mongo.Long(req.params.month);
  	condition.delivery_exception = {};
  	condition.delivery_exception.$ne =  "";
	var chart = {};
	chart.type = 'BarChart';
	chart.displayed = true;
	chart.cssStyle = 'height:100%; width:100%';
	chart.data = {};
	chart.data.cols = [];
	chart.data.cols[0] = {};
	chart.data.cols[0].id = 'Service';
	chart.data.cols[0].label = 'Service';
	chart.data.cols[0].type = 'string';
	chart.data.cols[1] = {};
	chart.data.cols[1].id = 'Count';
	chart.data.cols[1].label = 'Count';
	chart.data.cols[1].type = 'number';	
	chart.data.rows = [];
	chart.options = {};
	chart.options.title = "Failed Emails per Service";
	chart.options.isStacked = "true";
	chart.options.fill = 20;
	chart.options.displayExactValues = true;
	chart.options.vAxis = {};
	chart.options.vAxis.title = "";
	chart.options.vAxis.gridlines = {};
	chart.options.vAxis.gridlines.count = 1;
	chart.options.hAxis = {};
	chart.options.hAxis.title = "Failed Emails";
	chart.formatters = {};
	db.collection('history').group( keyf, condition,{"total":0},reduce,true,		
  		function(e,results) {
  			results.sort(function(a, b) { return b.service_category < a.service_category; });
  			var index = 0;
  			async.forEachSeries(results,
  				function (element , callback) {
  					
					db.collection('service_category').findOne({_id: element.service_category}, function(err, doc) {
						if (err) {
							element.description = 'No Description';
						}
						else {
							element.description = doc.description;
						} 
						chart.data.rows[index] = {};
						chart.data.rows[index].c = [];
						chart.data.rows[index].c[0] = {};
						chart.data.rows[index].c[0].v = element.description;
						chart.data.rows[index].c[1] = {};
						chart.data.rows[index].c[1].v = element.total;
						index++;
						
						callback(null);
					});
  				},	
  				function(err) {
  					if (err) {
  						chart = null;
  					}
  					
        			res.json(chart);
        		}	
  			);	
 		});
});
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
