//=============================================================================
// CallCommonEventBeforeSkill.js
//=============================================================================

/*:
 * @plugindesc custom made plugin. for baronsengir:twitter
 * order "call common event before use skill".
 * @author saronpasu
 *
 * @version 0.1.0
 *
 * @help
 * Usage:
 *  skill note write on "<before:CommonEvent:1>".
 *  call "common event 0001" before use skill.
 *
 */

/*:ja
 * @plugindesc オーダーメイドのプラグインです。 男爵さん専用。
 * オーダー内容は「スキル使用前にコモンイベント」です。
 * @author saronpasu
 *
 * @version 0.1.0
 *
 * @help
 * 使い方:
 *  スキルのメモに「<before:CommonEvent:1>」と登録して下さい。
 *  スキルを使用する前に「コモンイベント０００１」が呼ばれます。
 *  ほかの番号のコモンイベントでも使えます。
 *
 */

var Imported = Imported || {};
Imported.CallCommonEventBeforeSkill = {};

(function() {

    'use strict';

    var parameters = PluginManager.parameters('CallCommonEventBeforeSkill');

    var CallCommonEvent = function(source) {
        try {
            var pattern = new RegExp('CommonEvent:(\\d+)', 'g');
            var targetId = new Number(pattern.exec(source)[1]);
            if (targetId != NaN) {
                $gameTemp.reserveCommonEvent(targetId);
            }
        } catch (e) {
                console.log(e);
            }
    };

    var BeforeSkillUse = function(item) {
        try {
            var source = item.meta.before;
            CallCommonEvent(source);
        }
        catch (e) {
            console.log(e);
        }
    };

    var Game_Battler_performActionStart = Game_Battler.prototype.performActionStart;
    Game_Battler.prototype.performActionStart = function(action) {

        if(action.isSkill() && !action.isAttack() && !action.isGuard()) {
            BeforeSkillUse(action.item());
        }
        if (!action.isGuard()) {
            Game_Battler_performActionStart.call(this, action);
        }
    };

    var Scene_Skill_useItem = Scene_Skill.prototype.useItem;
    Scene_Skill.prototype.useItem = function() {

        BeforeSkillUse(this.item());

        Scene_Skill_useItem.call(this);
    };


})();

