//=============================================================================
// EasterEgg.js
//=============================================================================

/*:
 * @plugindesc EasterEgg(secret command) plugin.
 *
 * @author saronpasu
 *
 * @version 0.0.1
 *
 * @help
 *
 * EasterEgg (secret command) plugin.
 * Control from plugin commands.
 * Create secret command, and start.
 * players input success, when switch trun on.
 * players input miss, when input state reset.
 * miss input count over retry limit, when abort EasterEgg.
 *
 * Support command keys
 *   up down left right ok cancel
 *
 * Plugin Command:
 *   EasterEgg on keyId switchId retryLimit
 *     secret command input on.
 *     keyId: secret keys id [required]
 *     switchId: keycommand succes then switch on [required]
 *     retryLimit: retry limit count. [optional]
 *       (default: Infinity)
 *   EasterEgg off
 *     secret command input off.
 *   EasterEgg isRunning switchesId
 *     Check EasterEgg status, when EasterEgg running return switch on.
 *     switchesId: EasterEgg running then switch on [required]
 *   EasterEgg isInput switchesId
 *     Check EasterEgg status, when player input return switch on.
 *     switchesId: EasterEgg now input then switch on [required]
 *   EasterEgg isComplete switchesId
 *     Check EasterEgg status, when input complete return switch on.
 *     switchesId: EasterEgg input complete then switch on [required]
 *   EasterEgg status variablesId
 *     Check EasterEgg status, status code into variables.
 *     variablesId: EasterEgg status into variables [required]
 *       (StandBy: 0, Running: 1, Input: 2, Complete: 3)
 *   EasterEgg create keyId commands
 *     register secret commands.
 *     keyId: secret keys id [required]
 *     commands: key commands [required]
 *   EasterEgg update keyId commands
 *     update secret commands.
 *     keyId: secret keys id [required]
 *     commands: key commands [required]
 *   EasterEgg delete keyId
 *     delete secret commands.
 *     keyId: secret keys id [required]
 *   EasterEgg delete all
 *     delete all secret commands.
 *
 */

 /*:ja
  * @plugindesc 隠しコマンドプラグイン。
  *
  * @author saronpasu
  *
  * @version 0.0.1
  *
  * @help
  *
  * 隠しコマンドプラグイン。
  * プラグインコマンドで制御します。
  * 隠しコマンドを登録して、隠しコマンドをスタートさせるとプレイヤーの入力を調べます。
  * 隠しコマンドの入力に成功した場合、スイッチがONになります。
  * 隠しコマンドの入力に失敗した場合、入力内容は破棄されます。
  * 隠しコマンドに入力失敗した回数が、最大リトライ回数を超えた場合、隠しコマンドの入力は中断されます。
  *
  * 対応しているコマンドキー
  *   up down left right ok cancel
  *
  * プラグインコマンド:
  *   EasterEgg on キーID スイッチID 最大リトライ回数
  *     隠しコマンドが入力できるようにします。
  *     キーID: 隠しコマンドのID [必須]
  *     スイッチID: 隠しコマンドの入力が成功した時にONにするスイッチID [必須]
  *     最大リトライ回数: 隠しコマンドの入力に失敗しても再挑戦できる回数 [任意]
  *       (デフォルトでは最大リトライ回数は無制限です)
  *   EasterEgg off
  *      隠しコマンドの入力を終了します
  *   EasterEgg isRunning スイッチID
  *     隠しコマンドが実行中かどうかを確認します。結果はスイッチへ返ります。
  *     スイッチID: 隠しコマンドが有効な場合にONにするスイッチID [必須]
  *   EasterEgg isInput スイッチID
  *     隠しコマンドが入力中かどうかを確認します。結果はスイッチへ返ります。
  *     スイッチID: 隠しコマンドが入力中の場合にONにするスイッチID [必須]
  *   EasterEgg isComplete スイッチID
  *     隠しコマンドが入力成功したかどうかを確認します。結果はスイッチへ返ります。
  *     スイッチID: 隠しコマンドが入力成功している場合にONにするスイッチID [必須]
  *   EasterEgg status 変数ID
  *     隠しコマンドのステータスコードを変数に入れます。
  *     変数ID: 隠しコマンドのステータスを返す変数ID [必須]
  *       (スタンバイ: 0, 実行中: 1, 入力中: 2, 入力成功: 3)
  *   EasterEgg create キーID コマンド内容
  *     隠しコマンドを新規登録します。
  *     キーID: 隠しコマンドのキーID [必須]
  *     コマンド内容: コマンド内容 [必須]
  *   EasterEgg update キーID コマンド内容
  *     隠しコマンドを更新します。
  *     キーID: 隠しコマンドのキーID [必須]
  *     コマンド内容: コマンド内容 [必須]
  *   EasterEgg delete keyId
  *     隠しコマンドを削除します。
  *     キーID: 隠しコマンドのキーID [必須]
  *   EasterEgg delete all
  *     隠しコマンドをすべて削除します。
  *
  */

/*
 * Copyright (c) 2015 saronpasu
 *
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 *
 */

var Imported = Imported || {};
Imported.EasterEgg = {};

(function() {

    'use strict';

    // TODO: test code not work.
    var easterEgg;
    var keyStore;

    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        if (command === 'EasterEgg') {
            switch(args[0]) {
                case 'on':
                    if (/^[0-9]+$/.test(args[1]) && /^[0-9]+$/.test(args[2])) {
                        if (/^[0-9]+$/.test(args[3])) {
                            easterEgg.start(args[1], args[2], args[3]);
                        } else {
                            easterEgg.start(args[1], args[2]);
                        }
                    }
                    break;
                case 'off':
                    easterEgg.stop();
                    break;
                case 'isRunning':
                    if (/^[0-9]+$/.test(args[1])) {
                        $gameSwitches.setValue(args[1], easterEgg.isRunning());
                    }
                    break;
                case 'isInput':
                    if (/^[0-9]+$/.test(args[1])) {
                        $gameSwitches.setValue(args[1], easterEgg.isInput());
                    }
                    break;
                case 'isComplete':
                    if (/^[0-9]+$/.test(args[1])) {
                        $gameSwitches.setValue(args[1], easterEgg.isComplete());
                    }
                    break;
                case 'status':
                    if (/^[0-9]+$/.test(args[1])) {
                        var statusCode;
                        switch(easterEgg.status()) {
                            case 'standby':
                                statusCode = 0;
                                break;
                            case 'active':
                                statusCode = 1;
                                break;
                            case 'input':
                                statusCode = 2;
                                break;
                            case 'complete':
                                statusCode = 3;
                                break;
                        }
                        $gameVariables.setValue(args[1], statusCode);
                    }
                    break;
                case 'create':
                    if (/^[0-9]+$/.test(args[1])) {
                        easterEgg.setKeys(args[1], args.slice(2));
                    }
                    break;
                case 'update':
                    if (/^[0-9]+$/.test(args[1])) {
                        easterEgg.updateKeys(args[1], args.slice(2));
                    }
                    break;
                case 'delete':
                    if (/^[0-9]+$/.test(args[1])) {
                        easterEgg.deleteKeys(args[1]);
                    } else if(args[1] === 'all') {
                        keyStore.clear();
                    }
                    break;
            }
        }
    };

    var KeyNames = [
        'up', 'down', 'left', 'right', 'ok', 'cancel'
    ];

    var Validator = {};
    Validator.isValidKey = function(key) {
        if (/^[^A-Za-z]+$/.test(key)) {
            return false;
        }
        return KeyNames.filter(function(i){return key.toLowerCase() === i;}).length !== 0;
    };

    Validator.isValidKeys = function(keys) {
        if (!(keys instanceof Array && keys.length !== 0)) {
            return false;
        }
        return keys.filter(function(i){return !Validator.isValidKey(i);}).length === 0;
    };

    var EasterEgg = function() {
    };

    EasterEgg.prototype.initialize = function() {
        this.setup();
    };

    EasterEgg.prototype.setup = function() {
        this._status = 'standby';
        this._keys = [];
        this._index = 0;
        this._switchId = null;
        this._currentKey = null;
        this._retryLimit = Infinity;
        this._retryCount = 0;
    };

    EasterEgg.prototype.setKeys = function(id, keys) {
        if (keyStore.get(id)) {
            return false;
        }
        keyStore.set(id, keys);
    };

    EasterEgg.prototype.updateKeys = function(id, keys) {
        if (!keyStore.get(id)) {
            return false;
        }
        keyStore.set(id, keys);
    };

    EasterEgg.prototype.deleteKeys = function(id) {
        keyStore.delete(id);
    };

    EasterEgg.prototype.update = function() {
        if (!this.isRunning()) {
            return;
        }
        var inputKeys = KeyNames.filter(function(i){return Input.isTriggered(i);});
        if (inputKeys.length === 0) {
            return;
        } else if (inputKeys.length >= 2) {
            this.onMiss();
            return;
        }
        var inputKey = inputKeys[0];
        switch(this.status()) {
            case 'active':
                if (this.checkKey(inputKey)) {
                    this.setStatus('input');
                    this.onSuccess();
                } else {
                    this.onMiss();
                }
                break;
            case 'input':
                if (this.checkKey(inputKey)) {
                    this.onSuccess();
                } else {
                    this.onMiss();
                }
                break;
            default:
                break;
        }
    };

    EasterEgg.prototype.status = function() {
        return this._status;
    };

    EasterEgg.prototype.isRunning = function() {
        return (this.status() === 'active' || this.status() === 'input');
    };

    EasterEgg.prototype.isInput = function() {
        return this.status() === 'input';
    };

    EasterEgg.prototype.isComplete = function() {
        return this.status() === 'complete';
    };

    EasterEgg.prototype.setStatus = function(state) {
        this._status = state;
    };

    EasterEgg.prototype.start = function(keyId, switchId, retryLimit) {
        if (keyStore.get(keyId) === undefined || this.isRunning()) {
            return;
        }
        this._keys = keyStore.get(keyId);
        this._index = 0;
        this._retryCount = 0;
        this._switchId = switchId;
        this._retryLimit = retryLimit || this._retryLimit;
        this._currentKey = this._keys[0];
        this.activate();
    };

    EasterEgg.prototype.stop = function() {
        if (!this.isRunning()) {
            return;
        }
        this._index = 0;
        this._retryCount = 0;
        this.deactivate();
    };

    EasterEgg.prototype.activate = function() {
        this.setStatus('active');
    };

    EasterEgg.prototype.deactivate = function() {
        this.setStatus('standby');
    };

    EasterEgg.prototype.reset = function() {
        this._index = 0;
        this._currentKey = this._keys[0];
        this.setStatus('active');
    };

    EasterEgg.prototype.checkKey = function(key) {
        return this._currentKey === key;
    };

    EasterEgg.prototype.complete = function() {
        $gameSwitches.setValue(this._switchId, true);
        this.setStatus('complete');
    };

    EasterEgg.prototype.getNextKey = function() {
        return this._keys[this._index+1];
    };

    EasterEgg.prototype.onSuccess = function() {
        var nextKey = this.getNextKey();
        if (nextKey) {
            this._currentKey = nextKey;
            this._index += 1;
        } else {
            this.complete();
        }
    };

    EasterEgg.prototype.onMiss = function() {
        if (this._retryCount >= this._retryLimit) {
            this.stop();
        } else {
            this._retryCount += 1;
            this.reset();
        }
    };

    var KeyStore = function() {
    };

    KeyStore.prototype.initialize = function() {
        this.clear();
    };

    KeyStore.prototype.clear = function() {
        this._keys = {};
    };

    KeyStore.prototype.set = function(id, keys) {
        if (/^[0-9]+$/.test(id) && Validator.isValidKeys(keys)) {
            this._keys[id] = keys;
        }
    };

    KeyStore.prototype.get = function(id) {
        if (!this._keys.hasOwnProperty(id)) {
            return undefined;
        }else if (/^[0-9]+$/.test(id)) {
            return this._keys[id];
        }
    };

    KeyStore.prototype.delete = function(id) {
        if (!this._keys.hasOwnProperty(id)) {
            return;
        }else if (/^[0-9]$/.test(id)) {
            delete this._keys[id];
        }
    };

    var _Scene_Base_update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        _Scene_Base_update.call(this);

        try {
            easterEgg.update();
        }
        catch(e) {
        }
    };

    var _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call();

        easterEgg = new EasterEgg();
        easterEgg.initialize();
        keyStore = new KeyStore();
        keyStore.initialize();

        // Accessor for Export.
        var Accessor = {};
        Accessor.start = easterEgg.start.bind(easterEgg);
        Accessor.stop = easterEgg.stop.bind(easterEgg);
        Accessor.setKeys = easterEgg.setKeys.bind(easterEgg);
        Accessor.updateKeys = easterEgg.updateKeys.bind(easterEgg);
        Accessor.deleteKeys = easterEgg.deleteKeys.bind(easterEgg);
        Accessor.status = easterEgg.status.bind(easterEgg);

        // Export.
        Imported.EasterEgg = Accessor;
    };

    var _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        var contents = _DataManager_makeSaveContents();

        contents.keyStore = keyStore;
        return contents;
    };

    var _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents(contents);

        keyStore = contents.keyStore;
    };

    /* クロージャの関数をテスト用にエクスポート
     * NOTE: NWjs で実行する際にエラーにならないように try catch 構文を使っています。
     * もっとスマートな実装方法がないかな。
     */
    try {
        if (isTest) {
            exports.Validator = Validator;
            exports.EasterEgg = EasterEgg;
            exports.KeyStore = KeyStore;
        }
    }
    catch(e) {
    }
})();
