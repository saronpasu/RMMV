//=============================================================================
// MoveAWSD.js
//=============================================================================

/*:
 * @plugindesc skill cost change pay from game variable. for baronsengir:twitter
 * order "call common event before use skill".
 * @author saronpasu
 *
 * @version 0.0.1
 *
 * @help
 * Usage:
 *  skill note write on "<variableCost:[1, 5]>".
 *  skill cost pay "5" from "game variable 0001".
 *
 */

/*:ja
 * @plugindesc オーダーメイドのプラグインです。 男爵さん専用。
 * オーダー内容は「スキルのコストに変数xをｎ点使用する」です。
 * @author saronpasu
 *
 * @version 0.0.1
 *
 * @help
 * 使い方:
 *  スキルのメモに「<variableCost:[1, 5]>」と登録して下さい。
 *  スキルが「変数０００１」を「５」消費して使うようになります。
 *  ほかの番号の変数でも使えます。
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

    Game_BattlerBase.prototype.skillIsVariableCost = function(skill) {
        try {
            if (!(skill.meta.variableCost === undefined) &&
                (JsonEx.parse(skill.meta.variableCost).length === 2)) {
                return true;
            }
        }
        catch (e) {
        }
        return false;
    };

    Game_BattlerBase.prototype.skillVariableCost = function(skill) {
        try {
            return JsonEx.parse(skill.meta.variableCost);
        }
        catch (e) {
        }
        return [0, 0];
    };

//-----------------------------------------------------------------------------
// Game_BattlerBase
//
// OverRide from rpg_objects.js Game_BatterBase class.

    Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
        if (this.skillIsVariableCost(skill)) {
            var variableCost = this.skillVariableCost(skill);
            return $gameVariables.value([variableCost[0]]) >= variableCost[1];
        }

        return this._tp >= this.skillTpCost(skill) && this._mp >= this.skillMpCost(skill);
    };

    Game_BattlerBase.prototype.paySkillCost = function(skill) {
        if (this.skillIsVariableCost(skill)) {
             var variableCost = this.skillVariableCost(skill);
             $gameVariables.setValue(
                 variableCost[0],
                 ($gameVariables.value(variableCost[0]) - variableCost[1])
             );
        }

        this._mp -= this.skillMpCost(skill);
        this._tp -= this.skillTpCost(skill);
    };

})();

