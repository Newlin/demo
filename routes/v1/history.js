var async = require("async");
var mongo = require('mongodb');

exports.version = "1.0.0";

exports.categoryExceptionListing = function(req, res, next) {
	var keyf = function(doc) { return {date: doc.date, service_category: doc.service_category, service: doc.service, delivery_exception: doc.delivery_exception};} ;
  	var reduce = function(curr, result) {  result.total += curr.total; };
  	var condition = {};
  	condition.date = new mongo.Long(req.params.date);
	var data = {};
	data.listing = [];
	data.delivered_totals = 0;
	data.failed_totals = 0;
	req.db.collection('history').group(keyf, condition, {"total":0}, reduce, true, function(error, results) {
	    if (error) return next(error);
        async.forEachSeries(results, function(element, callback) {
  		    req.db.collection('service_category').findOne({_id: element.service_category}, function(err, doc) {
				if (err) {
					element.category_description = 'No Description';
				}
				else {
					element.category_description = doc.description;
				} 
 				req.db.collection('services').findOne({_id: element.service}, function(err, doc) {
		    		if (err) {
					    element.service_description = 'No Description';
					}
					else {
						element.service_description = doc.description;
					} 
					if (element.delivery_exception.indexOf("opted out") > 0) {
						element.delivery_exception = "Freemonee opt out";
					}							
					data.listing.push(element);
					if (element.delivery_exception == "") {
						data.delivered_totals += element.total;
					}
					else {
						data.failed_totals += element.total;
					}	

					callback(null);
				});						
			});
  		}, function(err) {
  				if (err) {
					data = null;
  				}
        		res.json(data);
        	}	
  		);	
 	});
};