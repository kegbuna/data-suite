/**
 * Created by Kegbuna on 5/9/2015.
 * The instructor can accept instructions from the instruction.json file located at the root and schedule jobs
 */
var Extractor = require('../extractors/product-extractor');
var Loader = require('../loaders/mongo-loader');
var later = require('later');
var EventEmitter = require('events').EventEmitter;
var instructor_config = require('../config/instructor.json');

var lessons = require('../instructions.json');

var instructor = function()
{
    var db = require('monk')(instructor_config.server + '/' + instructor_config.database);

    var emitter = new EventEmitter();

    //prepare the different config sections
    var instructions;// = lessons['instructions'];
    var loads;// = lessons['loads'];
    var loaders;// = lessons['loaders'];
    var extractors;// = lessons['extractors'];
    var extractions;// = lessons['extractions'];

    var extractor, loader;

    this.start = function()
    {
        db.get('instructions').find({}, function(err, docs)
        {
            instructions = docs;
            console.log("Got the instructions");
            checkAllReady();
        });
        db.get('loads').find({}, function(err, docs)
        {
            loads = docs;
            console.log("Got the loads");
            checkAllReady();
        });
        db.get('loaders').find({}, function(err, docs)
        {
            loaders = docs;
            console.log("Got the loaders");
            checkAllReady();
        });
        db.get('extractors').find({}, function(err, docs)
        {
            extractors = docs;
            console.log("Got the extractors");
            checkAllReady();
        });
        db.get('extractions').find({}, function(err, docs)
        {
            extractions = docs;
            console.log("Got the extractions");
            checkAllReady();
        });

        emitter.on('ready', function(stream)
        {
            console.log("Got the go ahead");
            console.log("instructions are: ", instructions);
            for (var index =0; index <instructions.length; index++)
            {
                //current set of instructions
                var current_instructions = instructions[index];

                console.log("Running instruction: ", current_instructions);

                var execution_count = 0;
                //configurable limit
                var execution_limit = current_instructions['limit'];

                //get the schedule from the instruction set
                var sched = later.parse.text(current_instructions['schedule']);

                //starts it up
                var t = later.setInterval(execute, sched);

                //collect the class configuration data
                var current_extraction = extractions[current_instructions['extraction']];
                var current_load = loads[current_instructions['load']];

                //perform the instruction
                function execute()
                {
                    //Instantiate the object's we'll be using based on the config
                    extractor = new Extractor(extractors[current_instructions['extractor']]);
                    loader = new Loader(loaders[current_instructions['loader']]);

                    extractor.getData(current_extraction, function(response)
                    {
                        var payload = "";

                        console.log("status code: ", response.statusCode);

                        response.on('data', function (chunk)
                        {
                            payload += chunk;
                        });

                        response.on('end', function()
                        {
                            payload = JSON.parse(payload);
                            var current_item = {};
                            for (var index =0; index<payload.items.length; index++)
                            {
                                //collect the current item in the array
                                current_item = payload.items[index];
                                current_item['timestamp'] = new Date().getTime();

                                //attach it to the data property of our configuration object... good id ea i dont know
                                current_load['data'] = current_item;

                                loader.put(current_load);

                                execution_count++;

                                console.log("We've done this: ", execution_count, " times.");

                                if (execution_count >= execution_limit)
                                {
                                    t.clear();
                                }
                            }
                        });

                        response.on('error', function(error)
                        {
                            console.log("couldn't get it boss");
                            console.log(error);
                        });
                    });
                }
            }
        });

        function checkAllReady()
        {
            var iArray = [instructions,loads,loaders,extractors,extractions];
            for (var i= 0; i<iArray.length; i++)
            {
                if (typeof iArray[i] == "undefined")
                {
                    console.log("instruction set not ready yet");
                    return false;
                }
            }

            console.log("We're ready");
            emitter.emit('ready');
            return true;
        }
    };
};

module.exports = instructor;