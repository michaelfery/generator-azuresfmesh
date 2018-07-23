'use strict';

var path = require('path')
  , generators = require('yeoman-generator')
  , yosay = require('yosay');
var GuestGenerator = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.desc('Generate Service Fabric Mesh application template');
  },

  prompting: function () {
    var done = this.async();

    this.log(yosay(
      'Welcome to Service Fabric Mesh application generator'
    ));

    var prompts = [
      {
        type: 'input',
        name: 'projName',
        message: 'Name your application',
        validate: function (input) {
          return input ? true : false;
        }
      },

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
      this.props.projName = this.props.projName.trim();
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

    var appName = this.props.projName;
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
    var serviceEndPointName = this.props.serviceName + 'Listener';

    if (this.props.osType == "Windows") {
      this.osType = "windows";
    } else if (this.props.osType == "Linux") {
      this.osType = "linux";
    }

    var template = this.templatePath('deploy/mesh.template.json');
    var destination = this.destinationPath(path.join(appName, '/mesh.template.json'));
    this.fs.copyTpl(this.templatePath('deploy/mesh.template.json'),
      this.destinationPath(path.join('deploy', '/mesh.template.json')),
      {
        appName: appName,
        serviceName: serviceName,
        imageName: imageName,
        serviceEndPointName: serviceEndPointName,
        portMapContainer: portMapContainer,
        portMapHost: portMapHost,
        osType: this.osType
      }
    );
  },

  end: function () {
    // nothing to do for now
  }
});

module.exports = GuestGenerator;

