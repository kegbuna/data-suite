/**
 * Created by Kegbuna on 5/6/2015.
 * Loader Class - places data into mongodb currently
 */

var mongo = require('mongodb');


var loader = function (instruction)
{
    //Some defaults
    if (instruction)
    {
        for (var name in instruction)
        {
            this[name] = instruction[name];
        }
    }
    else
    {
        throw "Need instructions, boss.";
    }

    this.put = function(loader_instructions)
    {
        var db = require('monk')(this.address);

        var target_table = db.get(loader_instructions['table']);

        target_table.insert(loader_instructions['data']).on('complete', function(err, doc)
        {
            if (err)
            {
                throw err;
            }

            console.log("Successfully loaded: ", doc);
        });
    }
};

module.exports = loader;