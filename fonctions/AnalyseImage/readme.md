# BlobTrigger - JavaScript

The `BlobTrigger` makes it incredibly easy to react to new Blobs inside of Azure Blob Storage. This sample demonstrates a simple use case of processing data from a given Blob using JavaScript.

## How it works

For a `BlobTrigger` to work, you provide a path which dictates where the blobs are located inside your container, and can also help restrict the types of blobs you wish to return. For instance, you can set the path to `samples/{name}.png` to restrict the trigger to only the samples path and only blobs with ".png" at the end of their name.

## Learn more

Pour que cette fonction fonctionne il faut mettre les clés qui correspondent dans le script index.js

Cette fonction récupère la photo dans le blob l'analyse avec l'api puis sauvegarde la description et le lien de la photo dans la base de donnée

Si une photo est mise 2 fois avec le même nom cela ne fonctionne pas car il faut des photos différentes