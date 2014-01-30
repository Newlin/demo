
/**
* Format date as a string
* @param date - a date object (usually "new Date();")
* @param format - a string format, eg. "DD-MM-YYYY"
*/

var app = angular.module('utilService', []);

app.service('DateUtil', function(){
    this.dateFormat = function(date, format){
    	format = format.replace("DD", (date.getDate() < 10 ? '0' : '') + date.getDate()); // Pad with '0' if needed
    	format = format.replace("MM", (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1)); // Months are zero-based
    	format = format.replace("YYYY",date.getFullYear());
    	return format;
    };  
    
    this.weekStart = function(date) {
		var weekstartYear = date.getFullYear();
		var weekstartMonth = date.getMonth();
		var weekstartDay = date.getDate() - date.getDay();
	
		if (weekstartDay > date.getDate()) {
			weekstartMonth--;
			if (date.getMonth() == 0) {
				weekstartYear--;
			}
		}
		var weekStart = new Date();
		weekStart.setFullYear(weekstartYear);
		weekStart.setMonth(weekstartMonth);
		weekStart.setDate(weekstartDay); 
		return weekStart;   	
    };    
    
    this.weekEnd = function(date) {

		var weekendYear = date.getFullYear();
		var weekendMonth = date.getMonth();
		var weekendDay = date.getDate() + (6 - date.getDay());
	

		if (weekendDay < date.getDate()) {
			weekendMonth++;
			if (date.getMonth() ==12) {
				weekendYear++;
			}
		}	

	
		var weekEnd = new Date();
		weekEnd.setFullYear(weekendYear);
		weekEnd.setMonth(weekendMonth);
		weekEnd.setDate(weekendDay);
		return weekEnd;
    };
});