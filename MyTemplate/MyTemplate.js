//=============================================================================
// PluginName.js
//=============================================================================

/*:
 * @plugindesc Description
 *
 * @author saronpasu
 *
 * @version 0.0.1
 *
 * @help
 *
 * @param PluginParam
 * @desc Description
 * @default
 *
 * Plugin Command:
 *   Command argment      # description
 *
 * Help message write here.
 *
 */

/*:ja
 * @plugindesc 説明とか。
 *
 * @author saronpasu
 *
 * @help
 *
 * @param PluginParam
 * @desc 説明とか
 * @default
 *
 * Plugin Command:
 *   Command argments      # 説明とか
 *
 * ヘルプメッセージを書くとこ。
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
Imported.PluginName = {};

(function() {

    'use strict';

    var parameters = PluginManager.parameters('PluginName');
    var PluginParam = String(parameters['PluginParam'] || 'default');

    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'CommandName') {
        }
    };

    /* クロージャの関数をテスト用にエクスポート
     * NOTE: NWjs で実行する際にエラーにならないように try catch 構文を使っています。
     * もっとスマートな実装方法がないかな。
     */
    try {
        if (isTest) {
            // exports.MyTemplate = LocalFunction;
        }
    }
    catch(e) {
    }
})();
