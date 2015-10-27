//=============================================================================
// TranslateTerms.js
//=============================================================================

/*:
 * @plugindesc Terms change translate your language.
 * @author saronpasu
 *
 * @version 0.0.4
 *
 * @help
 *
 * Plugin Command:
 *   Language check           # return your native language
 *   Language set ja          # language setting "Japanese"
 *   Language set en          # language setting "English"
 *   Language set default     # language setting default setting
 *   Language set auto        # language auto setting from native language
 *   Language get             # get language settings
 *
 */

/*:ja
 * @plugindesc 用語(Terms)などの言語設定を切り替えるプラグインです。
 * @author saronpasu
 *
 * @help
 *
 * プラグインコマンド:
 *   Language check           # 自動検出のネイティブ言語を返します
 *   Language set ja          # 言語設定を日本語(ja)に設定します
 *   Language set en          # 言語設定を英語(en)に設定します
 *   Language set default     # 言語設定を初期設定にします
 *   Language set auto        # 言語設定を自動検出に設定します
 *   Language get             # 言語設定を返します
 *
 */

(function() {

    var parameters = PluginManager.parameters('TranslateTerms');

    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'Language') {
            switch (args[0]) {
            case 'check':
                return (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0,2);
                break;
            case 'set':
                $gameSystem.setLanguage(args[1]);
                break;
            case 'get':
                $gameSystem.getLanguage();
                break;
            }
        }
    };

    Game_System.prototype.setLanguge = function(language) {
        if (ConfigManager['language'] == undefined) {
            this.clearLanguage();
        }
        this._LanguageSettings = language;
        switch(language) {
          case 'auto':
            $dataSystem.locale = (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0,5);
            break;
          case 'ja':
            $dataSystem.locale = 'ja_JP';
            break;
          case 'en':
            $dataSystem.locale = 'en_US';
            break;
          default:
            $dataSystem.locale = 'en_US';
            break;
        }
    };

    Game_System.prototype.getLanguage = function() {
        if (ConfigManager['language'] == undefined) {
            this.clearLanguage();
        }
        if (ConfigManager['language'] == 'auto') {
            return (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0,2);
        } else {
            return ConfigManager['language'];
        }
    };

    Game_System.prototype.clearLanguage = function() {
        this._LanguageSettings = 'auto';
        ConfigManager['language'] = 'auto';
        $dataSystem.locale = (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0,5);
    };

/*
  Override rpg_manager.js DataManager
*/

DataManager._databaseFiles.push(
    { name: '$terms_en_US',      src: '../js/plugins/terms/en_US.json'},
    { name: '$terms_ja_JP',      src: '../js/plugins/terms/ja_JP.json'}
);

DataManager.loadDatabase = function() {
    var test = this.isBattleTest() || this.isEventTest();
    var prefix = test ? 'Test_' : '';
    for (var i = 0; i < this._databaseFiles.length; i++) {
        var name = this._databaseFiles[i].name;
        var src = this._databaseFiles[i].src;
        if (test == true ) {
            file = src.replace(/(\w+)\.json/, "Test_$&" )
            this.loadDataFile(name, file);
        } else {
            this.loadDataFile(name, prefix + src);
        }
    }
    if (this.isEventTest()) {
        this.loadDataFile('$testEvent', prefix + 'Event.json');
    }
};


/*
  Override rpg_manager.js TextManager
*/

TextManager.basic = function(basicId) {
    switch (Game_System.prototype.getLanguage()) {
        case 'default':
            return $dataSystem.terms.basic[basicId] || '';
            break;
        case 'ja':
            return $terms_ja_JP.basic[basicId] || '';
            break;
        case 'en':
            return $terms_en_US.basic[basicId] || '';
            break;
        default:
            return $dataSystem.terms.basic[basicId] || '';
            break;
    }
};

TextManager.param = function(paramId) {
    switch (Game_System.prototype.getLanguage()) {
        case 'default':
            return $dataSystem.terms.params[paramId] || '';
            break;
        case 'ja':
            return $terms_ja_JP.params[paramId] || '';
            break;
        case 'en':
            return $terms_en_US.params[paramId] || '';
            break;
        default:
            return $dataSystem.terms.params[paramId] || '';
            break;
    }
};

TextManager.command = function(commandId) {
    switch (Game_System.prototype.getLanguage()) {
        case 'default':
            return $dataSystem.terms.commands[commandId] || '';
            break;
        case 'ja':
            return $terms_ja_JP.commands[commandId] || '';
            break;
        case 'en':
            return $terms_en_US.commands[commandId] || '';
            break;
        default:
console.log("call");
            return $dataSystem.terms.commands[commandId] || '';
            break;
    }
};

TextManager.message = function(messageId) {
    switch (Game_System.prototype.getLanguage()) {
        case 'default':
            return $dataSystem.terms.messages[messageId] || '';
            break;
        case 'ja':
            return $terms_ja_JP.messages[messageId] || '';
            break;
        case 'en':
            return $terms_en_US.messages[messageId] || '';
            break;
        default:
            return $dataSystem.terms.messages[messageId] || '';
            break;
    }
};

Object.defineProperties(TextManager, {
    language      : TextManager.getter('message', 'language'),
});

/*
  Override rpg_manager.js ConfigManager
*/

ConfigManager.language        = 'auto';

ConfigManager.makeData = function() {
    var config = {};
    config.alwaysDash = this.alwaysDash;
    config.commandRemember = this.commandRemember;
    config.bgmVolume = this.bgmVolume;
    config.bgsVolume = this.bgsVolume;
    config.meVolume = this.meVolume;
    config.seVolume = this.seVolume;
    config.language = this.language;
    return config;
};

ConfigManager.applyData = function(config) {
    this.alwaysDash = this.readFlag(config, 'alwaysDash');
    this.commandRemember = this.readFlag(config, 'commandRemember');
    this.bgmVolume = this.readVolume(config, 'bgmVolume');
    this.bgsVolume = this.readVolume(config, 'bgsVolume');
    this.meVolume = this.readVolume(config, 'meVolume');
    this.seVolume = this.readVolume(config, 'seVolume');
    this.language = this.readLanguage(config, 'language');
};

ConfigManager.readLanguage = function(config, name) {
    return config[name];
};

/*
  Override rpg_window.js Window_Options
*/

Window_Options.prototype.makeCommandList = function() {
    this.addGeneralOptions();
    this.addVolumeOptions();
    this.addLanguageOptions();
};

Window_Options.prototype.addLanguageOptions = function() {
    this.addCommand(TextManager.language, 'language');
};

Window_Options.prototype.statusText = function(index) {
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(symbol);
    if (this.isVolumeSymbol(symbol)) {
        return this.volumeStatusText(value);
    } else if (this.isLanguageSymbol(symbol)) {
        return this.languageStatusText(value);
    } else {
        return this.booleanStatusText(value);
    }
};

Window_Options.prototype.isLanguageSymbol = function(symbol) {
    return symbol.contains('language');
};

Window_Options.prototype.languageStatusText = function(value) {
    switch(value) {
        case 'auto':
            return 'auto';
            break;
        case 'ja':
            return '日本語';
            break;
        case 'en':
            return 'English';
            break;
        case 'default':
            return 'default';
            break;
        default:
            return 'default';
            break;
    };
};

Window_Options.prototype.processOk = function() {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(symbol);
    var languageList = ['auto', 'ja', 'en', 'default'];
    if (this.isVolumeSymbol(symbol)) {
        value += this.volumeOffset();
        if (value > 100) {
            value = 0;
        }
        value = value.clamp(0, 100);
        this.changeValue(symbol, value);
    } else if (this.isLanguageSymbol(symbol)) {
        value = languageList.indexOf(value);
        value += this.languageOffset();
        if (value > 3) {
            value = 0;
        }
        value = value.clamp(0, 3);
        this.changeValue(symbol, languageList[value]);
    } else {
        this.changeValue(symbol, !value);
    }
};

Window_Options.prototype.cursorRight = function(wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(symbol);
    var languageList = ['auto', 'ja', 'en', 'default'];
    if (this.isVolumeSymbol(symbol)) {
        value += this.volumeOffset();
        value = value.clamp(0, 100);
        this.changeValue(symbol, value);
    } else if (this.isLanguageSymbol(symbol)) {
        value = languageList.indexOf(value);
        value += this.languageOffset();
        if (value > 3) {
            value = 0;
        }
        value = value.clamp(0, 3);
        this.changeValue(symbol, languageList[value]);
    } else {
        this.changeValue(symbol, true);
    }
};

Window_Options.prototype.cursorLeft = function(wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(symbol);
    var languageList = ['auto', 'ja', 'en', 'default'];
    if (this.isVolumeSymbol(symbol)) {
        value -= this.volumeOffset();
        value = value.clamp(0, 100);
        this.changeValue(symbol, value);
    } else if (this.isLanguageSymbol(symbol)) {
        value = languageList.indexOf(value);
        value -= this.languageOffset();
        if (value > 3) {
            value = 0;
        }
        value = value.clamp(0, 3);
        this.changeValue(symbol, languageList[value]);
    } else {
        this.changeValue(symbol, false);
    }
};

Window_Options.prototype.languageOffset = function() {
    return 1;
};

Window_Options.prototype.setConfigValue = function(symbol, volume) {
    ConfigManager[symbol] = volume;
    if (symbol == 'language') {
        Game_System.prototype.setLanguge(volume);
    };
};


})();
