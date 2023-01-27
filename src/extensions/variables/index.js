const formatMessage = require('format-message');
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const Cast = require('../../util/cast');

class VarExt {
    variables = {};
    getInfo() {
      return {
        id: 'tempVars', // change this if you make an actual extension!
        name: 'Variables',
        blocks: [
          {
            opcode: 'setvar',
            blockType: BlockType.COMMAND,
            text: 'Set [ONE] to [TWO]',
            arguments: {
              ONE: {
                type: ArgumentType.STRING,
                defaultValue: 'Variable'
              },
              TWO: {
                type: ArgumentType.STRING,
                defaultValue: 'Value'
              }
            }
          },
          {
            opcode: 'changevar',
            blockType: BlockType.COMMAND,
            text: 'Change [ONE] by [TWO]',
            arguments: {
              ONE: {
                type: ArgumentType.STRING,
                defaultValue: 'Variable'
              },
              TWO: {
                type: ArgumentType.STRING,
                defaultValue: 'Value'
              }
            }
          },
          {
            opcode: 'getvar',
            blockType: BlockType.REPORTER,
            text: 'Get [ONE]',
            arguments: {
              ONE: {
                type: ArgumentType.STRING,
                defaultValue: 'Variable'
              }
            }
          }
        ]
      };
    }
    setvar(args) {
        this.variables = { [args.ONE]: args.TWO };
        return args.ONE;
    }
    changevar(args) {
        this.variables = { [args.ONE]: this.variables[args.ONE] + args.TWO };
        return args.ONE;
    }
    getvar(args) {
        var amogus = args.ONE;
        return this.variables[amogus];
    }
  }
module.exports = VarExt;