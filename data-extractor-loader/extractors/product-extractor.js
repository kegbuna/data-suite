/**
 * Created by Kegbuna on 5/4/2015.
 * Extractor Class - Performs web api calls and returns a promise
 */

var http = require("http");
var https = require("https");

var extractor = function (instruction)
{
    //Some defaults
    this.apiKey = "";
    this.apiHost = "";
    this.apiPath = "";
    this.endPoint = "";
    this.port = "";

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
    // Retrieve data using a predefined query string
    this.getData = function (extraction, callback)
    {
        var client = this.port == 443 ? https : http;
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
        }

        //create options object
        var options = {
            hostname: this.apiHost,
            path: this.apiPath + this.endPoint + queryString
        };

        console.log("Url being queried: ", this.apiHost + this.apiPath + this.endPoint + queryString);

        var req = client.request(options, callback);

        req.end();

    }
};

module.exports = extractor;