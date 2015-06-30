/**
 * Created by Kegbuna on 5/4/2015.
 * Extractor Class - Performs web api calls and returns a promise
 */

var http = require("http");
var https = require("https");

var extractor = function (instruction)
{
    //Some defaults
    var config = {};
    config.apiKey = "jmdtdydcfy8us4ghmuk2cc72";
    config.apiHost = "api.walmartlabs.com";
    config.apiPath = "/v1";
    config.endPoint = "/items";
    config.port = "443";

    if (instruction)
    {
        for (var name in instruction)
        {
            config[name] = instruction[name];
        }
    }
    // Retrieve data using a predefined query string
    this.getData = function (extraction, callback)
    {
        //var client = this.port == 443 ? https : http;
        var client = https;
        var queryString = "";
        
        var params = extraction.params;


        //anything to put in a query string?
        if (params)
        {
            //need one
            queryString += "?";

            var paramString = "";

            //add any parameters, format, etc
            if (typeof params == "object")
            {
                for (var param in params)
                {
                    if (Array.isArray(params[param]))
                    {
                        params[param] = params[param].join();
                    }
                    //put an ampersand just in case
                    paramString += '&' + param + '=' + params[param];
                }
            }

            //Remove the first ampersand if we have a query string
            if (paramString.length > 0)
            {
                paramString = paramString.slice(1);
            }

            queryString += paramString;
            queryString += "&apiKey=" + config.apiKey;
        }

        //create options object
        var options = {
            hostname: config.apiHost,
            path: config.apiPath + config.endPoint + queryString
        };

        console.log("Url being queried: ", config.apiHost + config.apiPath + config.endPoint + queryString);

        var req = client.request(options, callback);

        req.on('error', function (err)
        {
            console.log("Got an error: ", err);
        });

        req.end();

    }
};

module.exports = extractor;