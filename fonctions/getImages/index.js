const CosmosClient = require("@azure/cosmos").CosmosClient;
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    const keyCosmos="g8BIf5fGEJ33ScwlXH7Wiwm80FFy8BsB1qPiwvenBRn7gj7dNqEJddmdbzCBzjEgtDP2mbwcroYvQZFDsy9lfw==";
    const endpointCosmos="https://tpantoinearistide.documents.azure.com:443/";

    const lient = new CosmosClient( {endpoint:endpointCosmos, key:keyCosmos } );
    const database= await lient.databases.createIfNotExists({id:"Task"}); 
    await lient.database("Task").containers.createIfNotExists({ id: "Images", partitionKey:"/image" });
    const container = lient.database("Task").container("Images");

    
    const result=await container.items.query({
       query: "SELECT * FROM c"}).fetchAll();
       context.log(await container.items.query({
       query: "SELECT * FROM c"}).fetchAll());
    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        headers: {
            'Content-Type': 'application/json'
        },
        body: result
    };
}