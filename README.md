

# generator-azuresfmesh
> Yeoman generator for Azure Service Fabric Mesh projects

## Installation

First, install [Yeoman](http://yeoman.io) and generator-azuresfmesh using [npm](https://www.npmjs.com/) (we assume you have pre-installed [npm](https://www.npmjs.com/) and [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-azuresfmesh
```
The commands might ask for root access. Please run them with ```sudo```, if needed.

Then generate your new project template:

```bash
yo azuresfmesh
```

Add a new service to a generated app template:

```bash
yo azuresfmesh:addService
```

You can have a look at the [documentation](https://docs.microsoft.com/en-us/azure/service-fabric-mesh/service-fabric-mesh-quickstart-deploy-container) to understand how you can deploy the generated Service Fabric Mesh application


## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

## License

MIT


# Contributing

This project welcomes contributions and suggestions.

## Steps to contribute

Once you have figured out all the legalities above, you can follow the steps below - 

* Create a fork of this [repository](https://github.com/michaelfery/generator-azuresfmesh)
* Git clone the forked repository to your development box
* Make the changes
* You can update your local Yeo using ```npm link``` (or ```sudo npm link``` as required) at the project root-level
* Create a new project with ```yo azuresfmesh``` (ensure it picks Yeo node-module bits from your local changes)
* Add a new service with ```yo azuresfmesh:addService``` (ensure you created a project from previous command)
* Validate that changes are working as expected and not breaking anything regressively by creating and deploying the generated project on Azure
* Raise a pull request and share with us 

## Debugging generator using vscode

* Open the repository's root folder in VScode.
* Run the command ```which yo``` and update the program's value in launch.json if it does not match with yours.
* Press F5 to start debugging.
