//=============================================================================
// CallCommonEventBeforeSkill.js
//=============================================================================

/*:
 * @plugindesc custom made plugin.
 * order "call common event before use skill".
 * @author saronpasu
 *
 * @version 0.1.6
 *
 * @help
 * Usage:
 *  skill note write on "<before:CommonEvent:1>".
 *  call "common event 0001" before use skill.
 *
 */

/*:ja
 * @plugindesc オーダーメイドのプラグインです。
 * オーダー内容は「スキル使用前にコモンイベント」です。
 * @author saronpasu
 *
 * @version 0.1.6
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

    var IsCallCommonEvent = function(item) {
        try {
           var source = item.meta.before;
        }
        catch(e) {
           return false;
        }
        var pattern = new RegExp('CommonEvent:(\\d+)', 'g');
        return pattern.test(source);
    };

    var CallCommonEvent = function(source) {
        var pattern = new RegExp('CommonEvent:(\\d+)', 'g');
        var targetId = new Number(pattern.exec(source)[1]);
        if (targetId != NaN) {
            $gameTemp.reserveCommonEvent(targetId);
            if (!$gameParty.inBattle()) {
                SceneManager.update();
            }
        }
    };

    var BeforeSkillUse = function(item) {
        try {
            var source = item.meta.before;
            CallCommonEvent(source);
        }
        catch (e) {
        }
    };

    var dummySkill = {
        animationId: 0,
        hitType: 0,
        mpCost: 0,
        tpCost: 0,
        tpGain: 0,
        iconIndex: 0,
        scope: 0,
        successRate: 100,
        speed: 0,
        requireWtypeId1: 0,
        requireWytpeId2: 0,
        reqpeats: 1,
        occasion: 0,
        message1: '',
        message2: '',
        damage: { type: 0 },
        effects: []
    };

    var flags = [false, false];

    var Game_Battler_onAllActionsEnd = Game_Battler.prototype.onAllActionsEnd;
    Game_Battler.prototype.onAllActionsEnd = function() {
        flags = [false, false];

        Game_Battler_onAllActionsEnd.call(this);
    }

    var Game_Battler_onTrunEnd = Game_Battler.prototype.onTurnEnd;
    Game_Battler.prototype.onTurnEnd = function	() {
        flags = [false, false];

        Game_Battler_onTrunEnd.call(this);
    };

    var Game_Battler_currentAction = Game_Battler.prototype.currentAction;
    Game_Battler.prototype.currentAction = function() {

        if(flags[0]) {
            return Game_Battler_currentAction.call(this);
        }
        var action = this._actions[0];
        if(action && action.isSkill() && !action.isAttack() && !action.isGuard()) {
           if(!IsCallCommonEvent(action.item())) {
                return Game_Battler_currentAction.call(this);
            }
            this._actions.unshift(action);
            flags[1] = true;
            var dummyAction = new Game_Action(this, true);
            $dataSkills.push(dummySkill);
            dummyAction.setSkill($dataSkills.length-1);
            dummyAction._item._itemId = $dataSkills.length-1;
            BeforeSkillUse(action.item());
            return dummyAction;
        }

        return Game_Battler_currentAction.call(this);
    };

    var Scene_Skill_useItem = Scene_Skill.prototype.useItem;
    Scene_Skill.prototype.useItem = function() {

        BeforeSkillUse(this.item());

        Scene_Skill_useItem.call(this);
    };

    var Game_Interpreter_terminate = Game_Interpreter.prototype.terminate;
    Game_Interpreter.prototype.terminate = function() {
        if (flags[1]) {
            $dataSkills.pop();
            BattleManager._subject._actions.shift();
            
            flags[1] = false;
            flags[0] = !flags[0];
        }

        Game_Interpreter_terminate.call(this);
    };

})();

