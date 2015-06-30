/**
 * Created by Kegbuna on 5/9/2015.
 * The instructor can accept instructions from the instruction.json file located at the root and schedule jobs
 */
var Extractor = require('../extractors/product-extractor');
var Loader = require('../loaders/loader');
var later = require('later');
var EventEmitter = require('events').EventEmitter;
var instructor_config = require('../config/instructor.json');
var Firebase = require('firebase');

var instructor = function()
{
	 
	 var instructorRef = new Firebase(instructor_config.server + '/extractor_instructor');
	 var itemsRef = new Firebase(instructor_config.server + '/item_lists/initial_products');
	 
	 this.perform = function()
	 {
		 var product_extractor = new Extractor();
		 
		 var extraction = {};
		 
		 itemsRef.on('value', function(snapshot)
		 {
 		 	var ids = Object.keys(snapshot.val());
			console.log("items are:", ids);	 
		 });
		 
		 
		 while (ids.length > 0)
		 {
			extraction.params = {
				ids: ids.splice(0, 20).join()
			} 
			
			product_extractor.getData(extraction, function (records)
			{
				 console.log(records);
			});
		 }
		 
	 }
	 
	 this.start = function()
	 {
		 var sched = later.parse.text('every 30 seconds');
		 
		 var timer = later.setInterval(this.perform(), sched);
		 
	 }
};

module.exports = instructor;