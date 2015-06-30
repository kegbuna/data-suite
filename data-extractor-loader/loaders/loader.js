/**
 * Created by Kegbuna on 5/6/2015.
 * Loader Class - places data into mongodb currently
 */

var Firebase = require('firebase');
var fs = require('fs');

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
        
        var productsSaved = 0;
            
        for (var i=0; i<productArray.length; i++)
        {
            currentProduct = productArray[i];
            
            myProductRef = new Firebase(config.product + '/' + currentProduct.itemId);
            checkProduct(myProductRef, currentProduct);
        }
        
        function checkProduct(fireRef, product)
        {
            fireRef.on('value', function (snapshot)
            {
                //console.log("Snapshot exists? ", snapshot.exists());
                //console.log("Snapshot value? ", snapshot.val());
                //console.log('Current product value? ', product);
                
                if (!productsEqual(snapshot.val(), product))
                {
                    myProductRef.set(product);
                    myHistoryRef = new Firebase(config.history + '/' + product.itemId + '/' + timeStamp);
                    myHistoryRef.set(product);
                    
                    console.log(product.name + ' was changed or didnt exist yet so we are going to save it to the DB.');
                    productsSaved++;
                    console.log(productsSaved + " products updated/pushed on this run.");            
                }
                else
                {
                    console.log("Nothing to do here folks.");
                }    
            });
        }
        
        function productsEqual(obj, receivedProduct)
        {
            if (obj == null || receivedProduct == null)
            {
                console.log('One of these objects is null.');
                return false;
            }
            
            for (var property in receivedProduct)
            {
                if (typeof receivedProduct[property] === 'object' && obj.hasOwnProperty(property))
                {
                    //console.log('Looks like we have an object here. ' + JSON.stringify(obj[property]));
                    //console.log('Versus ', receivedProduct[property]);
                    console.log('Diving into the object.');
                    if (!productsEqual(receivedProduct[property], obj[property]))
                    {
                        console.log("Did not pass the recursive test.");
                        return false;
                    }
                }
                else if (JSON.stringify(obj[property]) != JSON.stringify(receivedProduct[property]))
                {
                    console.log(obj.name + '\'s ' + property + ' changed from ' + JSON.stringify(obj[property]));
                    console.log('To ', receivedProduct[property]);
                    return false;
                }    
            }   
            return true;
        }
        
    };
};

module.exports = loader;