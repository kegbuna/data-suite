/**
 * Created by Kegbuna on 5/6/2015.
 * Loader Class - places data into mongodb currently
 */

var Firebase = require('firebase');


var loader = function (instruction)
{
    //Some defaults
    var config = {};
    config.history = 'https://flickering-heat-9411.firebaseio.com/history';
    config.product = 'https://flickering-heat-9411.firebaseio.com/products';

    if (instruction)
    {
        for (var name in instruction)
        {
            config[name] = instruction[name];
        }
    }

    this.put = function(productArray)
    {
        var timeStamp = Date.now();
        var myHistoryRef,
            myProductRef,
            currentProduct;
            
        for (var i=0; i<productArray.length; i++)
        {
            currentProduct = productArray[i];
            
            myHistoryRef = new Firebase(config.history + '/' + currentProduct.itemId + '/' + timeStamp);

            myHistoryRef.set(currentProduct);
            
            myProductRef = new Firebase(config.product + '/' + currentProduct.itemId);
            
            myProductRef.set(currentProduct);
        }

        console.log(productArray.length + " products updated/pushed.");
        
    }
};

module.exports = loader;