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
var fs = require('fs');

var instructor = function()
{
	 
	 //var instructorRef = new Firebase(instructor_config.server + '/instructions/instructions');

	 var itemsRef = new Firebase(instructor_config.server + '/item_lists/initial_products');
	 var loader = new Loader();

	 this.perform = function()
	 {
		 var product_extractor = new Extractor();
		 
		 var extraction = {};
		 
		 itemsRef.on('value', function(snapshot)
		 {
            var ids = Object.keys(snapshot.val());
            //console.log("items are:", ids);
            while (ids.length > 0)
            {
                extraction.params = {
                    ids: ids.splice(0, 20).join()
                };

                product_extractor.getData(extraction, function (res)
                {
                    var records = "";
                    res.on('data', function(chunk)
                    {
                        records += chunk;
                    });

                    res.on('end', function()
                    {
                        //turn into an object we can use
                        records = JSON.parse(records);

                        var itemArray = records.items;

                        loader.put(itemArray);
                    });
                });
            }
		 });
		 
	 };
	 
	 this.start = function()
	 {
		 var sched = later.parse.text('every 5 minutes');

         this.perform();
		 var timer = later.setInterval(this.perform, sched);
		 
	 }
};

module.exports = instructor;