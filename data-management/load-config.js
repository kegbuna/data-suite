var load_config = require('./config/load.json');
var mongo = require('mongodb');
var db = require('monk')(load_config.server + '/' + load_config.database);

var instruction_set = require(load_config.file);

for (var instruction_type in instruction_set)
{
    var current_table = db.get(instruction_type);

    current_table.drop();

    var sets = instruction_set[instruction_type];

    var payload;

    for (var set_name in sets)
    {
        var set_object = sets[set_name];

        payload = {
            name : set_name
        };

        for (var item in set_object)
        {
            payload[item] = set_object[item];
        }

        current_table.insert(payload).on('complete', function(err, doc)
        {
            if (err)
            {
                console.log('ERROR: ', err);
            }
            else
            {
                console.log('loaded: ', doc);
            }
        });
    }
}