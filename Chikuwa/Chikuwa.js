//=============================================================================
// Chikuwa.js
//=============================================================================

/*:
 * @plugindesc variable store chikuwa
 * @author saronpasu
 *
 * @version 0.0.2
 *
 * @param FileName
 * @desc Save FileName
 * @default chikuwa
 *
 * @param WebStorageKey
 * @desc WebStorageKey
 * @default Chikuwa
 *
 * @help
 * plugin command "Chikuwa 1 = 6" then chikuwa variables[1] set 6.
 * "Chikuwa 1 + 6" then chikuwa variables[1] increment 6.
 * "Chikuwa 1 > 2" then chikuwa variables[1] set $gameVariables[2]
 * "Chikuwa 1 < 2" then $gameVariables[2] set chikuwa variables[1]
 *
 */

/*:ja
 * @plugindesc 「どのデータをロードしても共有した変数を読み込める」プラグイン
 * @author saronpasu
 *
 * @param FileName
 * @desc ちくわ変数のセーブファイル名
 * @default chikuwa
 *
 * @param WebStorageKey
 * @desc ちくわ変数のWebStorageKey
 * @default Chikuwa
 *
 * @help
 * プラグインコマンドで「Chikuwa 1 = 2」とやると、セーブデータを横断して
 * ちくわ変数「１」番に値「２」が保存されます。
 * 代入「=」と加算「+」と減算「-」に対応しています。
 * ちくわ変数とゲーム変数の操作は次の通りです。
 * プラグインコマンド「Chikuwa 1 > 2」で、ちくわ変数「１」番の値をゲーム変数「２」に取り出せます。
 * プラグインコマンド「Chikuwa 1 < 2」で、ゲーム変数「２」番の値をちくわ変数「１」に代入できます。
 *
 */

/*
 * Copyright (c) 2015 saronpasu
 *
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 *
 */

(function() {

    var parameters = PluginManager.parameters('Chikuwa');
    var FileName = String(parameters['FileName'] || 'chikuwa');
    var WebStorageKey = String(parameters['WebStrageKey'] || 'Chikuwa');

    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'Chikuwa') {
            var chikuwa = new Chikuwa();
            switch (args[1]) {
                case '=':
                    chikuwa.set(args[0], Number(args[2]));
                    break;
                case '+':
                    chikuwa.increment(args[0], Number(args[2]));
                    break;
                case '-':
                    chikuwa.decrement(args[0], Number(args[2]));
                    break;
                case '>':
                    $gameVariables.setValue(args[2], chikuwa.get(args[0]));
                    break;
                case '<':
                    chikuwa.set(args[0], $gameVariables.value(args[2]));
                    break;
            }
        }
    };

    var Chikuwa = function() {
    };

    Chikuwa.prototype.initialize = function() {
        this._variables = {};
        this.applyData();
    };

    Chikuwa.prototype.applyData = function() {
        this._variables = this.load();
    };

    Chikuwa.prototype.increment = function(id, param) {
        var value = this.get(id);
        value += param;
        this.set(id, value);
    };

    Chikuwa.prototype.decrement = function(id, param) {
        var value = this.get(id);
        value -= param;
        this.set(id, value);
    };

    Chikuwa.prototype.set = function(id, param) {
        this.applyData();
        this._variables[id] = param;
        var json = JSON.stringify(this.makeData());
        this.save(json);
    };

    Chikuwa.prototype.get = function(id) {
        this.applyData();
        var value = this._variables[id];
        if (typeof value === 'undefined') {
            return 0;
        } else {
            return value;
        }
    };

    Chikuwa.prototype.makeData = function() {
        return this._variables;
    };

    Chikuwa.prototype.save = function(json) {
        if (StorageManager.isLocalMode()) {
            var data = LZString.compressToBase64(json);
            var fs = require('fs');
            var dirPath = StorageManager.localFileDirectoryPath();
            var filePath = this.localFilePath();
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }
            fs.writeFileSync(filePath, data);
        } else {
            var data = LZString.compressToBase64(json);
            localStorage.setItem(WebStorageKey, data);
        }
    };

    Chikuwa.prototype.load = function() {
        var json;
        var result = {};
        try {
            if (StorageManager.isLocalMode()) {
                var data = null;
                var fs = require('fs');
                var filePath = this.localFilePath();
                if (fs.existsSync(filePath)) {
                    data = fs.readFileSync(filePath, { encoding: 'utf8' });
                }
                json = LZString.decompressFromBase64(data);
            } else {
                var data = localStorage.getItem(WebStorageKey);
                json = LZString.decompressFromBase64(data);
            }
        } catch(e) {
            console.error(e);
        }
        if (json) {
            result = JSON.parse(json);
        }
        return result;
    };

    Chikuwa.prototype.delete = function() {
        if (StorageManager.isLocalMode()) {
            var fs = require('fs');
            var filePath = this.localFilePath();
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } else {
            localStorage.removeItem(WebStorageKey);
        }
    };

    Chikuwa.prototype.exists = function() {
        if (StorageManager.isLocalMode()) {
            var fs = require('fs');
            return fs.existsSync(this.localFilePath);
        } else {
            return !!localStorage.getItem(WebStorageKey);
        }
    };

    Chikuwa.prototype.localFilePath = function() {
        return StorageManager.localFileDirectoryPath() + FileName + '.rpgsave';
    };

    Chikuwa.prototype.webStorageKey = function() {
         return WebStrageKey;
    };

})();

