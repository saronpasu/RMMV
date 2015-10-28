//=============================================================================
// Battery.js
//=============================================================================

/*:
 * @plugindesc about battery plugin. Only support Android.
 * this is misc plugin.
 *
 * @author saronpasu
 *
 * @version 0.0.1
 *
 * @help
 *
 * Plugin Command:
 *   Battery isSupport        # return Battery supported
 *   Battery isCharging       # return Battery Charging status
 *   Battery isFull           # return Battery Full
 *   Battery getLevel         # get Battery Level
 *
 */

/*:ja
 * @plugindesc 端末のバッテリーに関するプラグインです。Android版のみ対応しています。
 * このプラグイン単独では特に意味のある動作はしません。
 *
 * @author saronpasu
 *
 * @help
 *
 * プラグインコマンド:
 *   Battery isSupport        # このプラグインがサポートされているかどうか
 *   Battery isCharging       # 充電中かどうか
 *   Battery isFull           # バッテリーがフル充電かどうか
 *   Battery getLevel         # バッテリー残量を取得
 *
 */

(function() {

    var parameters = PluginManager.parameters('Battery');

    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'TTS') {
            switch (args[0]) {
            case 'isSupport':
                return $gameSystem.isBatterySupport();
            case 'isCharging':
                return $gameSystem.isBatteryCharging();
            case 'isFull':
                return $gameSystem.isBatteryFull();
            case 'getLevel':
                return $gameSystem.getBatteryLevel();
            }
        }
    };

    Game_System.prototype.isBatterySupport = function() {
        return Utils.isAndroidChrome();
    };

    var resultBatteryCharging = '';

    Game_System.prototype.isBatteryCharging = function() {
        if (!$gameSystem.isBatterySupport()) {
            return false;
        };
        navigator.getBattery().then(function(battery) {
            resultBatteryCharging = battery.charging;
        });
        return resultBatteryCharging;
    };

    var resultBatteryFull = '';

    Game_System.prototype.isBatteryFull = function() {
        if (!$gameSystem.isBatterySupport()) {
            return false;
        };
        navigator.getBattery().then(function(battery) {
            resultBatteryFull = (battery.level === 1)
        });
        return resultBatteryFull;
    };

    var resultBatteryLevel = '';

    Game_System.prototype.getBatteryLevel = function() {
        if (!$gameSystem.isBatterySupport()) {
            return false;
        };
        navigator.getBattery().then(function(battery) {
            resultBatteryLevel = (battery.level * 100).toString()+' %';
        });
        return resultBatteryLevel;
    };

})();
