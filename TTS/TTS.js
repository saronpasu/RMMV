//=============================================================================
// TTS.js
//=============================================================================

/*:
 * @plugindesc Text To Speech plugin. work only native browser.
 * @author saronpasu
 *
 * @version 0.0.1
 *
 * @param Run TTS
 * @desc Escape code for TTS speak.
 * @default T
 *
 * @help
 *
 * Plugin Command:
 *   TTS isSupport            # return TTS supported
 *   TTS init                 # TTS initialize
 *   TTS setVolume            # set volume
 *   TTS setPitch             # set pitch
 *   TTS setRate              # set rate
 *   TTS setLang              # set language
 *   TTS speak                # manual speak text
 *
 * ---Run TTS---
 * if the Run TTS value is 'T', use \T[text] to run TTS.
 *
 */

/*:ja
 * @plugindesc 音声読み上げ(TTS)を実行するプラグインです。対応するブラウザでのみ動作します。
 * @author saronpasu
 *
 * @help
 *
 * @param Run TTS
 * @desc 音声読み上げ(TTS)実行のエスケープコード。
 * @default T
 *
 * プラグインコマンド:
 *   TTS isSupport            # TTSが実行可能かどうか
 *   TTS init                 # TTS の初期化
 *   TTS setVolume            # 音量の設定
 *   TTS setPitch             # ピッチの設定
 *   TTS setRate              # レートの設定
 *   TTS setLang              # 言語の設定
 *   TTS speak                # 手動でのテキストの読み上げ
 *
 * ---Run TTS---
 * プラグイン変数 Run TTS に 'T' を設定している場合、
 * メッセージ中に \T[text] と入れることで読み上げが実行されます。
 *
 */

(function() {

    speechSynthesis.getVoices(); // 1st call return [] on chrome.

    var parameters = PluginManager.parameters('TTS');
    var runTTS = String(parameters['TTS Speak'] || 'T');
    var runTTS_Pattern = runTTS ? new RegExp('\x1b' + runTTS + '\\[(.+)\\]', 'gi') : null;
    var TTS = null;

    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'TTS') {
            switch (args[0]) {
            case 'isSupport':
                return $gameSystem.isTTS();
            case 'init':
                TTS = $gameSystem.initTTS();
            case 'setVolume':
                $gameSystem.setTTS_Volume(args[1]);
            case 'setRate':
                $gameSystem.setTTS_Rate(args[1]);
            case 'setPitch':
                $gameSystem.setTTS_Pitch(args[1]);
            case 'setLang':
                $gameSystem.setTTS_Language(args[1]);
            case 'speak':
                $gameSystem.speakTTS(args[1]);
            }
        }
    };

    Game_System.prototype.isTTS = function() {
        return !(speechSynthesis.getVoices().length === 0);
    };

    Game_System.prototype.initTTS = function() {
        if (!$gameSystem.isTTS()) {
            return false;
        }
        var _TTS = new SpeechSynthesisUtterance();
        var voices = speechSynthesis.getVoices();
        var localeVoice = null;
        switch ($dataSystem.locale.substr(0,2)) {
           case 'ja':
               localeVoice = voices.find(function(e,i,a) {return e.lang === 'ja-JP'});
               break;
           case 'en':
               localeVoice = voices.find(function(e,i,a) {return e.lang === 'en-US'});
               break;
        }
        _TTS.voice = localeVoice;
        return _TTS;
    };

    Game_System.prototype.setTTS_Volume = function(param) {
        if (!$gameSystem.isTTS()) {
            return false;
        }
        if (!TTS) {
            TTS = $gameSystem.initTTS();
        }
        TTS.volume = param;
    };

    Game_System.prototype.setTTS_Rate = function(param) {
        if (!$gameSystem.isTTS()) {
            return false;
        }
        if (!TTS) {
            TTS = $gameSystem.initTTS();
        }
        TTS.rate = param;
    };

    Game_System.prototype.setTTS_Pitch = function(param) {
        if (!$gameSystem.isTTS()) {
            return false;
        }
        if (!TTS) {
            TTS = $gameSystem.initTTS();
        }
        TTS.pitch = param;
    };

    Game_System.prototype.setTTS_Language = function(param) {
        if (!$gameSystem.isTTS()) {
            return false;
        }
        if (!TTS) {
            TTS = $gameSystem.initTTS();
        }
        var voices = speechSynthesis.getVoices();
        var localeVoice = null;
        switch(param) {
           case 'ja-JP':
               localeVoice = voices.find(function(e,i,a) {return e.lang === 'ja-JP'});
               break;
           case 'en-US':
               localeVoice = voices.find(function(e,i,a) {return e.lang === 'en-US'});
               break;
        }
    };

    Game_System.prototype.speakTTS = function(text) {
        if (!$gameSystem.isTTS()) {
            return false;
        }
        if (!TTS) {
            TTS = $gameSystem.initTTS();
        }
        TTS.text = text;
        speechSynthesis.speak(TTS);
    };

    var _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function(text) {
        text = _Window_Base_convertEscapeCharacters.call(this, text);
        if (runTTS) {
           text = text.replace(runTTS_Pattern, function() {
               $gameSystem.speakTTS(arguments[1]);
               return "";
           }.bind(this));
        }
        return text;
    };


})();
