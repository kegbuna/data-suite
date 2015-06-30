var Firebase = require('firebase');

startListening();

function startListening()
{
    var product_list = new Firebase('https://flickering-heat-9411.firebaseio.com/products');

    product_list.on('child_changed', function (snapshot, previousChild)
    {
        console.log("Previous Child was: ", previousChild);
        console.log("new value: ", snapshot.val());
    });
}