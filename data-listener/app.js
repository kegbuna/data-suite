var Firebase = require('firebase');

var listenerConfig = require('./config/config.json');

var twilioClient = require('twilio')(listenerConfig.sid, listenerConfig.authToken);

startListening();

function startListening()
{
    var product_list = new Firebase('https://flickering-heat-9411.firebaseio.com/products');
    var target_numbers  = ['+19734595140', '+12013170075'];
    
    console.log("Listening now.");
    product_list.on('child_changed', function (snapshot, previousChild)
    {
        console.log("Previous Child was: ", previousChild);
        
        var changedProduct = snapshot.val();
        
        console.log("new value: ", changedProduct.itemId);
        
        /*for (var j in target_numbers)
        {
            console.log("Notifying: ", target_numbers[j]);
            
            twilioClient.sendMessage(
            {
                to: target_numbers[j],
                from: listenerConfig.phone,
                body: "Product " + changedProduct.itemId + " (" + changedProduct.name + ") has changed."    
            }, function (err, responseData)
            {
                if (err)
                {
                    console.log(err);
                }
                else
                {
                    console.log(responseData);
                }
            });    
        }*/
        
    });
}