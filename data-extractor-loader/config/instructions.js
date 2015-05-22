//for creating configs
var convict = require('convict');

var instructions = convict();

// load environment dependent configuration

var file_type = "instructions";

instructions.loadFile('../' + file_type + '.json');

// perform validation

instructions.validate();

module.exports = instructions;
