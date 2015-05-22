/**
 * Created by Kegbuna on 5/9/2015.
 * The instructor can accept instructions from the instruction.json file located at the root and schedule jobs
 */
var Extractor = require('../extractors/product-extractor');
var Loader = require('../loaders/mongo-loader');
var later = require('later');

//powered by convict
var lessons = require('../instructions.json');

var instructor = function()
{
    this.start = function()
    {
        //prepare the different config sections
        var instructions = lessons['instructions'];
        var loads = lessons['loads'];
        var loaders = lessons['loaders'];
        var extractors = lessons['extractors'];
        var extractions = lessons['extractions'];

        var extractor, loader;

        for (var instruction in instructions)
        {
            console.log("Running instruction: ", instruction);

            //current set of instructions
            var current_instructions = instructions[instruction];

            var execution_count = 0;
            //configurable limit
            var execution_limit = current_instructions['limit'];

            //get the schedule from the instruction set
            var sched = later.parse.text(current_instructions['schedule']);

            //starts it up
            var t =later.setInterval(execute, sched);

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
    }
};

module.exports = instructor;