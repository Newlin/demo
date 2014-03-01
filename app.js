
/**
 * Module dependencies.
 */
require('newrelic');
var mongo = require('mongodb');
var jwt = require('express-jwt');
var express = require('express');
//var mongoskin = require('mongoskin');
//mongodb://newlin/:Mike0526@ds027409.mongolab.com:27409/edelivery
//localhost:27017
var db = require('mongoskin').db('mongodb://newlin:Mike0526@ds027709.mongolab.com:27709/edelivery', {w:1});
//var db = require('mongoskin').db('localhost:27017/edelivery', {w:1});
var collections = require('./routes/v1/collections');
var category = require('./routes/v1/categoryHistory');
var service = require('./routes/v1/serviceHistory');
var exceptions = require('./routes/v1/exceptionsHistory');
var history = require('./routes/v1/history');
var http = require('http');
var path = require('path');

var app = express();
var authenticate = jwt({
    secret: new Buffer('sBFSu5Z2bUM8Y__V4ISISlelrKK8YlfClmHOmliucQdUdyHfszVbhY6dJ7j3qIPs', 'base64'),
    audience: 'Bl2CaO5KvF36RoOHJmdPJUdIcWZOGMoY'
});
// all environments 24.197.95.51
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'test')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.configure('production', function() {
    app.use('/api', authenticate);
});

//Routes
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    req.db = db;
    next();
});
app.get('/api/servicecategories', collections.serviceCategories);
app.get('/api/services', collections.services);
app.get('/api/historyactivity', collections.historyActivity);
app.get('/api/monthlytotalsbycategory/:year', category.monthlyTotals);
app.get('/api/monthlyfailedtotalsbycategory/:year', category.monthlyFailedTotals);
app.get('/api/monthlytotalsbyservice/:year/:category', service.monthlyTotals);
app.get('/api/monthlyfailedtotalsbyservice/:year/:category', service.monthlyFailedTotals);
app.get('/api/monthlyfailedreasontotalsbyexception/:year/:category', exceptions.monthlyTotals);
app.get('/api/weeklytotalsbycategory/:year/:month', category.weeklyTotals);
app.get('/api/weeklyfailedtotalsbycategory/:year/:month', category.weeklyFailedTotals);
app.get('/api/weeklytotalsbyservice/:year/:month/:category', service.weeklyTotals);
app.get('/api/weeklyfailedtotalsbyservice/:year/:month/:category', service.weeklyFailedTotals);
app.get('/api/weeklyfailedreasontotalsbyexception/:year/:month/:category', exceptions.weeklyTotals);
app.get('/api/dailytotalsbycategory/:weekstart', category.dailyTotals);
app.get('/api/dailyfailedtotalsbycategory/:weekstart', category.dailyFailedTotals);
app.get('/api/dailytotalsbyservice/:weekstart/:category', service.dailyTotals);
app.get('/api/dailyfailedtotalsbyservice/:weekstart/:category', service.dailyFailedTotals);
app.get('/api/dailyfailedreasontotalsbyexception/:weekstart/:category', exceptions.dailyTotals);
app.get('/api/daytotalslisting/:date', history.categoryExceptionListing);

app.use(function(err, req, res, next) {
  console.log(err);
  console.log(next);
});
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
