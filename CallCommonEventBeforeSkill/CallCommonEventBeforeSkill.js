//=============================================================================
// CallCommonEventBeforeSkill.js
//=============================================================================

/*:
 * @plugindesc custom made plugin. for baronsengir:twitter
 * order "call common event before use skill".
 * @author saronpasu
 *
 * @version 0.0.2
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
 * @version 0.0.1
 *
 * @help
 * 使い方:
 *  スキルのメモに「<before:CommonEvent:1>」と登録して下さい。
 *  スキルを使用する前に「コモンイベント０００１」が呼ばれます。
 *  ほかの番号のコモンイベントでも使えます。
 *
 */

(function() {

    var parameters = PluginManager.parameters('CallCommonEventBeforeSkill');

//-----------------------------------------------------------------------------
// CallCommonEvent
//
// call common event.

    var CallCommonEvent = function(source) {
        try {
            var pattern = new RegExp('CommonEvent:(\\d+)', 'g');
            var targetId = new Number(pattern.exec(source)[1]);
            if (targetId != NaN) {
                var event = $dataCommonEvents[targetId];
                var interpreter = new Game_Interpreter();
                interpreter.setup(event.list, 1);
                interpreter.update();
            }
        } catch (e) {
                console.log(e);
            }
    };

//-----------------------------------------------------------------------------
// BeforeSkillUse
//
// before skill use.

    var BeforeSkillUse = function(item) {
        console.log(item);
        try {
            var source = item.meta.before;
            CallCommonEvent(source);
        }
        catch (e) {
            console.log(e);
        }
    };

//-----------------------------------------------------------------------------
// Game_Battler
//
// OverRide from rpg_objects.js Game_Battler class.

    Game_Battler.prototype.performActionStart = function(action) {

        /* --- custom code --- */
        console.log('before Game_Battler.prototype.performActionStart');
        /* --- custom code --- */

        /* --- original code --- */
        if(action.isSkill() && !action.isAttack() && !action.isGuard()) {
            BeforeSkillUse(action.item());
        }
        if (!action.isGuard()) {
            this.setActionState('acting');
        }
        /* --- original code --- */
    };

//-----------------------------------------------------------------------------
// Scene_Skill
//
// OverRide from rpg_scenes.js Scene_Skill class.

    Scene_Skill.prototype.useItem = function() {

        /* --- custom code --- */
        BeforeSkillUse(this.item());
        /* --- custom code --- */

        /* --- original code --- */
        Scene_ItemBase.prototype.useItem.call(this);
        this._statusWindow.refresh();
        this._itemWindow.refresh();
        /* --- original code --- */
    };


})();

