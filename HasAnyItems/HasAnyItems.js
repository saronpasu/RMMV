//=============================================================================
// IsAllItemHave.js
//=============================================================================

/*:
 * @plugindesc Party members any items and equips check have item from name.
 *
 * @author saronpasu
 *
 * @version 0.0.1
 *
 * @help
 *
 * Plugin Command:
 *   Command IsAllItemHave SwitchId ItemNameA, ItemNameB, ...
 *     SwitchId -> check result.
 *     ItemNameA -> check ItemName
 *
 * Script:
 *   $gameParty.IsAllItemHave(['ItemNameA', 'ItemNameB']);
 *      return -> true (have item)
 *             -> false (not have item)
 *
 */

/*:ja
 * @plugindesc 全員の所持品、装備の中からいずれかのアイテムを所持しているかどうかを返します。
 *
 * @author saronpasu
 *
 * @help
 *
 * Plugin Command:
 *   Command IsAllItemHave SwitchId ItemNameA, ItemNameB, ...
 *     SwitchId -> 持っているかどうかの結果を返すスイッチID
 *     ItemNameA -> 調べるアイテム名
 *
 * Script:
 *   $gameParty.IsAllItemHave(['ItemNameA', 'ItemNameB']);
 *      return -> true (アイテムを持っている場合）
 *             -> false (アイテムを持っていない場合)
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
Imported.HasAnyItems = {};

(function() {

    'use strict';

    var parameters = PluginManager.parameters('HasAnyItems');

    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'hasAnyItems') {
            if (/^[0-9]+$/.test(args[0])) {
                var targets = args.filter(function(i){return /^[^0-9]+$/.test(i);});
                var result = $gameParty.hasAnyItems(targets);
                if (result) {
                    $gameSwitches.setValue(Number(args[0]), true);
                }
            }
        }
    };

    var isValidName = function(name) {
        return typeof name === 'string';
    };

    var isValidTargets = function(targets) {
        if (!(targets instanceof Array)) {
            return false;
        }
        return targets.filter(function(i){return isValidName(i);}).length !== 0;
    };

    Game_Party.prototype.hasAnyItems = function(targets) {
        if (!isValidTargets(targets)) {
            return false;
        }
        var items = this.allItems();
        var equips = this.members().map(function(i){return i.equips();});
        equips = equips.reduce(function(a, b){return a.concat(b);});
        items = items.concat(equips);
        items = items.filter(function(i){return i;});
        items = items.map(function(i){return i.name;});
        var condition = function(i){
            return targets.filter(function(j){
                return i === j;
            }).length === 0 ? false : true;
        };
        var result = items.filter(condition);
        return items.filter(condition).length === 0 ? false : true;
    };

    // クロージャの関数をテスト用にエクスポート
    try {
        if (isTest) {
            exports.hasAnyItems = Game_Party.prototype.hasAnyItems;
            exports.pluginCommand = Game_Interpreter.prototype.pluginCommand;
            exports.isValidName = isValidName;
            exports.isValidTargets = isValidTargets;
        }
    }
    catch(e) {
    }

})();
