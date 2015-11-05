//=============================================================================
// HelloWrold.js
//=============================================================================

/*:
 * @plugindesc "Hello Wrold" call from plugin command.
 * @author saronpasu
 *
 * @version 1.0.0
 *
 * @param Message
 * @desc "Hello, {Message}". plugin parametor.
 * @default World
 *
 * @help
 * Plugin Manager's Help Message write here.
 * Usage: Game Event "plugin command" call "Hello World" then game message "Hello World".
 * "plugin command" call "Hello FooBar" then game message "Hello FooBar".
 *
 */

/*:ja
 * @plugindesc "Hello Wrold" をプラグインコマンドから呼び出すだけのプラグイン。
 * @author saronpasu
 *
 * @version 1.0.0
 *
 * @param Message
 * @desc "Hello, {Message}". プラグインパラメータで任意のメッセージを出すよ。
 * @default World
 *
 * @help
 * プラグインマネージャーに表示するヘルプメッセージはここに書きます。
 * 使い方: イベント編集の「プラグインコマンド」で「Hello World」と実行すると、「Hello World」と表示されます。
 * 「プラグインコマンド」で「Hello Hoge」と実行すると「Hello Hoge」と表示されます。
 *
 */

(function() {

    var parameters = PluginManager.parameters('HelloWorld');
    var Message = String(parameters['Message'] || 'World');

    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'Hello') {
            $gameMessage.add('Hello, '+args[0]);
        }
    };


})();

