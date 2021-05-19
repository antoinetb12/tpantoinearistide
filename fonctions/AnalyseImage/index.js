    'use strict';
    const async = require('async');

    const createReadStream = require('fs').createReadStream;
    const https = require('https');
    const path = require("path");
    const sleep = require('util').promisify(setTimeout);
    const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;
const CosmosClient = require("@azure/cosmos").CosmosClient;

const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
module.exports = async function (context, myBlob) {
    const STATUS_SUCCEEDED = "succeeded";
const STATUS_FAILED = "failed"

    //TODO remplacer les keys
    const keyCognitive = 'd80cfd3c0d774fcab43933276c6d0e5a';
    const endpointCognitive = 'https://westeurope.api.cognitive.microsoft.com/';

    const keyCosmos="g8BIf5fGEJ33ScwlXH7Wiwm80FFy8BsB1qPiwvenBRn7gj7dNqEJddmdbzCBzjEgtDP2mbwcroYvQZFDsy9lfw==";
    const endpointCosmos="https://tpantoinearistide.documents.azure.com:443/";

    const lient = new CosmosClient( {endpoint:endpointCosmos, key:keyCosmos } );
    const database= await lient.databases.createIfNotExists({id:"Task"}); 
    await lient.database("Task").containers.createIfNotExists({ id: "Images", partitionKey:"/image" });
    const container = lient.database("Task").container("Images");
    const computerVisionClient = new ComputerVisionClient(
    new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': keyCognitive } }), endpointCognitive);

    const printedResult = await readTextFromURL(context,computerVisionClient, context.bindingData.uri,myBlob);
    printRecText(context,printedResult);
    /*context.log(await container.items.query({
       query: "SELECT * FROM root r WHERE r.completed=@completed"}).fetchAll());*/
    const resource= await container.items.create({"id":context.bindingData.name,"description":printedResult[0].lines[0].text,"lien_image":context.bindingData.uri});
    
    
    context.log("JavaScript blob trigger function processed blob \n Blob:", context.bindingData.blobTrigger, "\n Blob Size:", myBlob.length, "Bytes");
};
function printRecText(context,readResults) {
  context.log('Recognized text:');
  context.log(readResults);
  for (const page in readResults) {
    if (readResults.length > 1) {
      context.log(`==== Page: ${page}`);
    }
    const result = readResults[page];
    if (result.lines.length) {
      for (const line of result.lines) {
        context.log(line.words.map(w => w.text).join(' '));
      }
    }
    else { context.log('No recognized text.'); }
  }
}
async function readTextFromURL(context,client, url,img) {
  // To recognize text in a local image, replace client.read() with readTextInStream() as shown:
  const STATUS_SUCCEEDED = "succeeded";
const STATUS_FAILED = "failed"
  let result = await client.read(url);
  // Operation ID is last path segment of operationLocation (a URL)
  let operation = result.operationLocation.split('/').slice(-1)[0];

  // Wait for read recognition to complete
  // result.status is initially undefined, since it's the result of read
  while (result.status !== STATUS_SUCCEEDED) { await sleep(1000); result = await client.getReadResult(operation); }
  return result.analyzeResult.readResults; // Return the first page of result. Replace [0] with the desired page if this is a multi-page file such as .pdf or .tiff.
}
