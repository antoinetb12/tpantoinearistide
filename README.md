#Création du groupe de ressource

az group create --name cnamparis -l westeurope

#Création du compte de stockage

az storage account create --name tpantoinearistide --resource-group cnamparis --sku Standard_LRS -l westeurope

#Créer la ressource Cognitive services

az cognitiveservices account create -n tpantoinearistide -g cnamparis --kind ComputerVision --sku F0 -l WestEurope --yes


#Créer la ressource Cosmos

az cosmosdb create --name tpantoinearistide --resource-group cnamparis --kind  
GlobalDocumentDB --locations regionName=WestEurope --capabilities EnableServerless


#Créer une ressource Web app


az appservice plan create --resource-group cnamparis --name plantpantoinearistide

az webapp create -g cnamparis -p plantpantoinearistide -n tpantoinearistide --runtime "node|12-lts"

#Créer une ressource Function app

az functionapp create --consumption-plan-location WestEurope --name tpantoinearistide2 --os-type Windows --resource-group cnamparis --runtime node --storage-account tpantoinearistide --runtime-version 10

#Configuration function

Dans la fonction app : (Analyse Image)
Dans la console d’AnalyseImage

npm install @azure/ms-rest-js
npm install async
npm install @azure/cognitiveservices-computervision 
npm install @azure/cosmos



Ces fonctions se trouvent dans le git dans le dossier fonctions il faudra les importer dans l’application de fonction
: Analyse Image et getImages

pour lancer les fonction il faudra changer les keys dans les programmes avec les valeurs que Azure vous a fournit

#Test du web

Pour le web il faudra le faire en local, car le déploiement n’a pas fonctionné, il suffit normalement de juste faire un npm install et npm start pour que le projet fonctionne.
 De plus il faudra ajouter dans le azure-storage-blob.ts le Token SAP qu’il faudra générer dans le Storage account et ensuite remplacer le const sasToken = process.env.storagesastoken || "sv=2020-02-10&ss=bfqt&srt=sco&sp=rwdlacupx&se=2021-05-28T14:30:07Z&st=2021-05-19T06:30:07Z&spr=https&sig=caVSUsDR6Y2bBQ%2BTNFPoj%2BYdXDyM7BSy74MzoBfzuxg%3D"; // Fill string with your SAS token

const containerName = `images`
const storageAccountName = process.env.storageresourcename || "tpantoinearistide"; // Fill string with your Storage resource name

si besoin d’information complémentaire : https://docs.microsoft.com/fr-fr/azure/developer/javascript/tutorial/browser-file-upload-azure-storage-blob 

Ensuite vous pourrez lancer la commande npm start afin de lancer le site et de le tester. Dans celui ci vous pourrez upload une photo en jpg, je vous conseille de tester avec l’image 
https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/MultiLingual.png en la transformant en jpg ou alors de la récupérer dans le git celle ci s’appelle test.jpg. Ceci va appeler la fonction azure AnalyseImage.

Puis vous pourrez voir dans azure que la base de données cosmosdb s’est remplie avec le texte contenu dans la photo. Et que la photo se trouve dans le groupe de stockage.

De plus vous pourrez tester directement sur Azure la fonction getImage en lui spécifiant pas de paramètre, ou alors en lancant la fonction depuis l'extérieur comme une api

En soit le projet était presque terminé, nos point de blocages actuels sont la non connaissance de react qui nous empêche de transformer la réponse json que nous renvoie getImages en grille lisible et le fait que le déploiement du site ne fonctionne pas depuis github sur Azure.

Pour plus de question veuillez contacter antoine.dabilly@hotmail.fr ou aristide.lame2@gmail.com
