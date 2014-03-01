exports.version = "1.0.0";

exports.serviceCategories = function(req, res, next) {
    req.db.collection('service_category').find().limit(50).toArray(function(error, categories) {
        if (error) return next(error);
		res.json(categories);
	});
};

exports.services = function(req, res, next) {
    req.db.collection('services').find().limit(50).toArray(function(error, services) {
        if (error) return next(error);
		res.json(services);
	});
};

exports.historyActivity = function(req, res, next) {
    req.db.collection('history_activity').findOne(function(error, activity) {
        if (error) return next(error);
		res.json(activity);
	});
};