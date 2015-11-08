//=============================================================================
// DiceRoll.js
//=============================================================================

/*:
 * @plugindesc Dice Roll. run plugin command or script event. for baronsengir:twitter
 * @author saronpasu
 *
 * @version 0.0.1
 *
 * @help
 * Usage:
 * ex1) on game event use "plugin command" onliner.
 *  "DiceRoll 2d6 1". then variable 0001 in 2d6 result.
 *
 * ex2) on game event use "control variables" with "script". 
 *  into script write "DiceRoll('2d6');". then valiable in 2d6 result.
 *
 * and game event "show text" on variable is write "\V[1]".
 * other, "DiceRoll('10d2')", "DiceRoll('8d3')" can use.
 * error case has return 0.
 *
 */

/*:ja
 * @plugindesc サイコロ風乱数。 プラグインコマンドかスクリプトイベントで使います。 男爵さんへ。
 * @author saronpasu
 *
 * @help
 * 使い方
 * その１) ゲームイベントの「プラグインコマンド」で、次のように１行入れます。
 *  「DiceRoll 2d6 1」
 *  すると、ダイスロール「２Ｄ６」の結果が変数０００１に入ります。
 *
 * その２) ゲームイベントの「変数の操作」で、入力を「スクリプト」にします。
 *  スクリプトの内容には「DiceRoll('2d6');」と入力します。これでダイスロール「２Ｄ６」の内容が変数に入ります。
 * 
 * あと、ゲームイベント「テキスト表示」で、変数の内容を出す方法は「\V[1]」と書くと変数０００１が表示されます。
 * 他にも「DiceRoll('10d2')」や「DiceRoll('8d3')」とか、他のダイスの組み合わせも使えます。
 * おかしなダイスが入力された場合は「０」を返します。
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

    var parameters = PluginManager.parameters('DiceRoll');
    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'DiceRoll') {
            if(typeof args[0] === 'string' && !isNaN(new Number(args[1]))) {
                return DiceRoll(args[0], new Number(args[1]));
            }
        }
    };

    var DiceRollArgs = ['(\\d+)[dD](\\d+)', 'g'];
    DiceRoll = function(source, variables_number) {
        var min = 1;
        var max = 1;
        var rolls = 1;
        var result = 0;
        try {
            var DiceRollPattern = new RegExp(DiceRollArgs[0], DiceRollArgs[1]);
            var match = DiceRollPattern.exec(source);
            max = match[2];
            rolls = match[1];
        }
         catch (e) {
            console.log(e);
            return 0;
        }
        for(i=0;i<rolls;i++) {
            result += Math.floor(Math.random() * max) + min;
        }
        if (typeof variables_number === 'object') {
            $gameVariables.setValue(variables_number, result);
            return 0;
        } else {
            return result;
        }
    };

})();

