'use strict';

var path = require('path')
  , generators = require('yeoman-generator')
  , yosay = require('yosay');
var ServiceGenerator = generators.Base.extend({
  constructor: function () {    
    generators.Base.apply(this, arguments);

    this.desc('Generate Service Fabric Mesh service template');
    var chalk = require('chalk');
    if (this.config.get('projName')) {
      console.log(chalk.green("Setting project name to", this.config.get('projName')));
    } else {
      var err = chalk.red("Project name not found in .yo-rc.json. Exiting ...");
      throw err;
    }

    this.option('isNewApp', {
      type: Boolean
      , required: true
    });
  },

  prompting: function () {
    var done = this.async();

    var prompts = [
      {
        type: 'input',
        name: 'serviceName',
        message: 'Name of the application service:',
        default: 'MyService'
      },

      {
        type: 'input',
        name: 'imageName',
        message: 'Input the Image Name:'
      },

      {
        type: 'input',
        name: 'portMap',
        message: 'Enter the container host mapping in the following format, container_port:host_port or press enter if not needed:'
      },

      {
        type: 'list',
        name: 'osType',
        message: 'Choose an OS for your service',
        default: this.config.get('osType'),
        choices: ["Linux", "Windows"]
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      this.config.set(props);

      done();
    }.bind(this));
  },

  _assert: function (condition, message) {
    if (!condition) {
      console.log(message)
      throw new Error();
    }
  },

  writing: function () {  

    var templatePath = this.destinationPath('deploy/mesh.template.json');
    this.appTemplate = this.fs.readJSON(templatePath, 'utf8');

    var appName = this.config.get('projName');
    var serviceName = this.props.serviceName;
    var imageName = this.props.imageName;

    if (this.props.portMap != "") {
      var portMap = this.props.portMap.split(":");
      this._assert(portMap.length == 2, "Entered format is incorrect");
      var portMapContainer = portMap[0];
      var portMapHost = portMap[1];
      this._assert(!isNaN(portMapContainer), "The container port is not a number")
      this._assert(!isNaN(portMapHost), "The host port is not a number")
    }
    else {
      var portMapContainer = "";
      var portMapHost = "";
    }

    if (this.props.osType == "Windows") {
      this.osType = "windows";
    } else if (this.props.osType == "Linux") {
      this.osType = "linux";
    }

    var serviceTemplate = this.fs.readJSON(this.templatePath('service.template.json'));

    serviceTemplate.name = serviceName;
    serviceTemplate.properties.description = "Service Fabric Mesh " + serviceName + " Application!";
    serviceTemplate.properties.osType = this.osType;
    serviceTemplate.properties.codePackages[0].name = serviceName + "Code";
    serviceTemplate.properties.codePackages[0].image = imageName;
    serviceTemplate.properties.networkRefs[0].name = "[resourceId('Microsoft.ServiceFabricMesh/networks', '" + appName + "Network')]";

    if (this.props.portMap != "") {
      var endpoint = {
        name: serviceName + "Listener",
        port: portMapContainer
      };
      serviceTemplate.properties.codePackages[0].endpoints.push(endpoint);

      var layer = {
        name: serviceName + "Ingress",
        publicPort: portMapHost,
        applicationName: appName,
        serviceName: serviceName,
        endpointName: serviceName + "Listener"
      }
      this.appTemplate.resources[0].properties.ingressConfig.layer4.push(layer);
    }

    this.appTemplate.resources.push(serviceTemplate);

    var templatePath = this.destinationPath("deploy/mesh.template.json");
    this.fs.writeJSON(templatePath, this.appTemplate);
  },

  end: function () {
    console.log("finished");
    // nothing to do for now
  }
});

module.exports = ServiceGenerator;

