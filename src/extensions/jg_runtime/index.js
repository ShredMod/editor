const formatMessage = require('format-message');
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
// const Cast = require('../../util/cast');

/**
 * Class for Runtime blocks
 * @constructor
 */
class JgRuntimeBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'jgRuntime',
            name: 'Runtime',
            color1: '#777777',
            color2: '#555555',
            blocks: [
                {
                    opcode: 'addCostumeUrl',
                    text: 'add costume [name] from [URL]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://penguinmod.github.io/PenguinMod-Gui/static/assets/9525874be2b1d66bd448bf53400011a9.svg'
                        },
                        name: {
                            type: ArgumentType.STRING,
                            defaultValue: 'blue flag'
                        }
                    }
                },
                {
                    opcode: 'deleteCostume',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.deleteCostume',
                        default: 'delete costume at index [COSTUME]',
                        description: 'Deletes a costume at the specified index.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        COSTUME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'setStageSize',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.setStageSize',
                        default: 'set stage width: [WIDTH] height: [HEIGHT]',
                        description: 'Sets the width and height of the stage.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        WIDTH: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 480
                        },
                        HEIGHT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 360
                        }
                    }
                },
                {
                    opcode: 'turboModeEnabled',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.turboModeEnabled',
                        default: 'turbo mode enabled?',
                        description: 'Block that returns whether Turbo Mode is enabled on the project or not.'
                    }),
                    disableMonitor: false,
                    blockType: BlockType.BOOLEAN
                },
                {
                    opcode: 'amountOfClones',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.amountOfClones',
                        default: 'clone count',
                        description: 'Block that returns the amount of clones that currently exist.'
                    }),
                    disableMonitor: false,
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getStageWidth',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.getStageWidth',
                        default: 'stage width',
                        description: 'Block that returns the width of the stage.'
                    }),
                    disableMonitor: false,
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getStageHeight',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.getStageHeight',
                        default: 'stage height',
                        description: 'Block that returns the height of the stage.'
                    }),
                    disableMonitor: false,
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'setMaxFrameRate',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.setMaxFrameRate',
                        default: 'set max framerate to: [FRAMERATE]',
                        description: 'Sets the max allowed framerate.'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        FRAMERATE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 30
                        }
                    }
                },
                {
                    opcode: 'getMaxFrameRate',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.getMaxFrameRate',
                        default: 'max framerate',
                        description: 'Block that returns the amount of FPS allowed.'
                    }),
                    disableMonitor: false,
                    blockType: BlockType.REPORTER
                },
                {
                    opcode: 'getIsClone',
                    text: formatMessage({
                        id: 'jgRuntime.blocks.getIsClone',
                        default: 'is clone?',
                        description: 'Block that returns whether the sprite is a clone or not.'
                    }),
                    disableMonitor: true,
                    blockType: BlockType.BOOLEAN
                }
            ]
        };
    }
    addCostumeUrl (args, util) {
        fetch(args.URL, { method: 'GET' }).then(x => x.blob().then(blob => {
            if (!(
                (blob.type === 'image/png') || 
                (blob.type === 'image/svg+xml')
            )) throw new Error(`Invalid mime type: "${blob.type}"`);
            
            const assetType = blob.type === 'image/png'
                ? this.runtime.storage.AssetType.ImageBitmap 
                : this.runtime.storage.AssetType.ImageVector;
            
            const dataType = blob.type === 'image/png' 
                ? this.runtime.storage.DataFormat.PNG 
                : this.runtime.storage.DataFormat.SVG;
            
            blob.arrayBuffer()
                .then(buffer => {
                    const asset = this.runtime.storage.createAsset(assetType, dataType, buffer, null, true);
                    const name = `${asset.assetId}.${asset.dataFormat}`;
                    const spriteJson = {
                        asset: asset, 
                        md5ext: name, 
                        name: args.name
                    };
                    vm.addCostume(name, spriteJson, util.target.id);
                })
                .catch(err => {
                    console.error(`Failed to Load Costume: ${err}`);
                    console.warn(err);
                });
        }));
    }
    deleteCostume (args, util) {
        const index = (Number(args.COSTUME) ? Number(args.COSTUME) : 1) - 1;
        if (index < 0) return;
        util.target.deleteCostume(index);
    }
    setStageSize (args) {
        let width = Number(args.WIDTH) || 480;
        let height = Number(args.HEIGHT) || 360;
        if (width <= 0) width = 1;
        if (height <= 0) height = 1;
        if (vm) vm.setStageSize(width, height);
    }
    turboModeEnabled () {
        return this.runtime.turboMode;
    }
    amountOfClones () {
        return this.runtime._cloneCounter;
    }
    getStageWidth () {
        return this.runtime.stageWidth;
    }
    getStageHeight () {
        return this.runtime.stageHeight;
    }
    getMaxFrameRate () {
        return this.runtime.frameLoop.framerate;
    }
    getIsClone (args, util) {
        return !(util.target.isOriginal);
    }
    setMaxFrameRate (args) {
        let frameRate = Number(args.FRAMERATE) || 1;
        if (frameRate <= 0) frameRate = 1;
        this.runtime.frameLoop.setFramerate(frameRate);
    }
}

module.exports = JgRuntimeBlocks;