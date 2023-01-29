const formatMessage = require('format-message');
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const Cast = require('../../util/cast');

class FreshPkgExt {
    getInfo() {
        

      return {
        id: 'freshpkg', // change this if you make an actual extension!
        name: 'Fresh Package Manager',
        blocks: [
            {
                opcode: 'loadPM',
                blockType: BlockType.COMMAND,
                text: 'Load Package Manager'
            }
        ]
      };
    }
    loadPM() {
        const url="https://raw.githubusercontent.com/familycomicsstudios/FreshPkg/main/Sprite1.sprite3";
        fetch(url).then((e=>e.arrayBuffer())).then((e=>{var r=new Uint8Array(e);
        vm.addSprite(r)}));
    }
  }
module.exports = FreshPkgExt;