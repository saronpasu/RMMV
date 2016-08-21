//=============================================================================
// Yorozu.js
//=============================================================================

/*:
 * @plugindesc Yorozu (萬). Name Change Plugin. It's a joke plugin.
 *
 * @author saronpasu
 *
 * @version 0.0.1
 *
 * @help
 *
 *
 */

/*:ja
 * @plugindesc よろず（萬）プラグインです。名前を変更して遊ぶジョークプラグインです。
 *
 * @author saronpasu
 *
 * @help
 *
 * 特にヘルプするまでもないかな。
 *
 */

/*
 * Copyright (c) 2016 saronpasu
 *
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 *
 */

var Imported = Imported || {};
Imported.Yorozu = {};

(function() {

    'use strict';

    var fs = require('fs');
    var rl = require('readline');

    var Yorozu;
    var Generator;

    var parameters = PluginManager.parameters('Yorozu');
    var PluginParam = String(parameters['EnemyPrefix'] || true);
    var PluginParam = String(parameters['Enemies'] || false);

    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'Yorozu') {
        }
    };

    Yorozu = function() {
        this.initialize.apply(this, arguments);
    };
    Yorozu.prototype.initialize = function() {
        this.setup();
    };
    Yorozu.prototype.setup = function() {
        var dirPath = StorageManager.localFileDirectoryPath()
        this.dataPath = dirPath + '../js/plugins/Yorozu/';
        this.enemyPath = 'enemy/';
        var prefixPath = this.dataPath+this.enemyPath+'prefix.txt';
        var suffixPath = this.dataPath+this.enemyPath+'suffix.txt';
        this.enemy = {
            'prefix': this.loadFile(prefixPath),
            'suffix': this.loadFile(suffixPath),
        }
    };

    Yorozu.prototype.loadFile = function(path) {
        var inputStream = fs.createReadStream(path);
        var inputReadLine = rl.createInterface({'input': inputStream, 'output': {}});
        var result = []
        inputReadLine.on('line', function(line) {
            result.push(line);
        }).on('close', function(){});
        return result;
    };

    Game_Enemy.prototype.randomPrefix = function() {
        console.log(Generator.enemy);
        var size = Generator.enemy['prefix'].length;
        return Generator.enemy['prefix'][Math.randomInt(size)];
    };

    Game_Enemy.prototype.randomSuffix = function() {
        console.log(Generator.enemy);
        var size = Generator.enemy['suffix'].length;
        return Generator.enemy['suffix'][Math.randomInt(size)];
    };

    Game_Enemy.prototype.originalName = function() {
        return this.prefix + this.enemy().name + this.suffix;
    };

    var _Game_Enemy_setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        this._enemyId = enemyId;
        this._screenX = x;
        this._screenY = y;

        this.prefix = this.randomPrefix();
        this.suffix = this.randomSuffix();
    };

    // DataManager を alias して上書き
    var _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects();

        if (!Generator) {
            Generator = new Yorozu();
        }
    }
})();
