'use strict';

var path = require('path')
  , generators = require('yeoman-generator')
  , yosay = require('yosay');
var AppGenerator = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this.desc('Generate Service Fabric Mesh application template');
    this.isAddNewService = this.options.isAddNewService;
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

    this.fs.copyTpl(this.templatePath('app.template.json'),
      this.destinationPath('deploy/mesh.template.json'),
      {
        appName: appName
      }
    );

    this.composeWith('azuresfmesh:addService', {
       options: { isNewApp: true }
     });  
  },

  end: function () {
    this.config.save();
  }
});

module.exports = AppGenerator;
