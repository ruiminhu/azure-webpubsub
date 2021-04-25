module.exports = async function (context, myTimer) {
    var message = 260 + (Math.random() - 0.5) * 20;
    context.bindings.webPubSubOperation = {
        "operationKind": "sendToAll",
        "message": `MSFT price: ${message}`,
        "dataType": "text"
    }
    context.done();
};