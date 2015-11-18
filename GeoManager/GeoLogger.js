//=============================================================================
// GeoLogger.js
//=============================================================================

/*:
 * @plugindesc GeoManager module demo plugin "GeoLogger"
 * logger work interval timer.
 * logging between start to stop moved point distance log.
 *
 * @author saronpasu
 *
 * @version 0.0.3
 *
 * @help
 *
 * @param Unit
 * @desc distance report unit [m(metar,km(kilometar),ft(feet),ml(mile)]
 * @default 'm'
 *
 * @param HighAccuracy
 * @desc geo location api option
 * @default true
 *
 * @param MaximumAge
 * @desc geo location api option (ms)
 * @default 0
 *
 * @param Timeout
 * @desc geo location api option (ms)
 * @default 10000
 *
 * @param Interval
 * @desc logging interval (sec)
 * @default 30
 *
 * Plugin Command:
 *   GeoLogger isSupport 1      # geo location api supported status into variables[1] (0 or 1)
 *   GeoLogger start            # start logging
 *   GeoLogger update           # update log
 *   GeoLogger stop             # stop logging
 *   GeoLogger clear            # clear log
 *   GeoLogger isRunning 1      # check GeoLogger status into variables[1] (0 or 1)
 *   GeoLogger changeUnit km    # change distance report unit
 *   GeoLogger totalDistance 1  # return total distance.
 *
 * Help message write here.
 *
 *
 * [Dependency Plugins]
 * GeoManager.js
 *
 */

/*:ja
 * @plugindesc 「ジオマネージャー」 モジュールのデモ用プラグイン「ジオロガー」
 * インターバルタイマーでログ取得します。移動距離を記録して、出力してくれます。
 *
 * @author saronpasu
 *
 * @help
 *
 * @param Unit
 * @desc 距離を出力する際の単位 [m(メートル),km(キロメートル),ft(フィート),ml(マイル)]
 * @default 'm'
 *
 * @param HighAccuracy
 * @desc ジオロケーションAPIのオプション
 * @default true
 *
 * @param MaximumAge
 * @desc ジオロケーションAPIのオプション (ミリ秒)
 * @default 0
 *
 * @param Timeout
 * @desc ジオロケーションAPIのオプション (ミリ秒)
 * @default 10000
 *
 * @param Interval
 * @desc ジオログ取得間隔 (秒)
 * @default 10
 *
 * Plugin Command:
 *   GeoLogger isSupport 1      # ジオロケーションAPIがサポートされているかどうかを変数「１」に返します（０か１）
 *   GeoLogger start            # ジオログ取得開始
 *   GeoLogger update           # ジオログ手動更新
 *   GeoLogger stop             # ジオログ取得停止
 *   GeoLogger clear            # ジオログ削除
 *   GeoLogger isRunning 1      # ジオログ取得中かどうかを変数「１」に返します（０か１）
 *   GeoLogger changeUnit km    # 距離の単位を切り替えます
 *   GeoLogger totalDistance 1  # 移動距離を変数「１」に返します
 *
 * Help message write here.
 *
 *
 * [依存プラグイン]
 * GeoManager.js
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

if (Imported['GeoManager'] === undefined ) {
    console.error('Download GeoManager.js [https://github.com/saronpasu/RMMV/blob/master/GeoManager/GeoManager.js]');
    throw new Error('This plugin needs GeoManager.js');
}

Imported.GeoLogger = {};

(function() {

    'use strict';

    var intervalTimer;
    var geoLogger;
    var geoLog;

    var parameters = PluginManager.parameters('GeoLogger');
    var Unit = String(parameters['Unit'] || 'm');
    var HighAccuracy = Boolean(parameters['HighAccuracy'] || true);
    var MaximumAge = Number(parameters['MaximumAge'] || 0);
    var Timeout = Number(parameters['Timeout'] || 70000);
    var Interval = Number(parameters['Interval'] || 10);

    // GeoManager をインポート
    var GeoManager = Imported['GeoManager'];

    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        if (command === 'GeoLogger') {
            switch (args[0]) {
                case 'isSupport':
                    if (/^[0-9]+$/.test(args[1])) {
                        $gameVariables.setValue(Number(args[1]), geoLogger.isSupport() ? 1 : 0);
                    }
                    break;
                case 'start':
                    geoLogger.start();
                    break;
                case 'update':
                    geoLogger.logging();
                    break;
                case 'stop':
                    geoLogger.stop();
                    break;
                case 'clear':
                    geoLogger.clear();
                    break;
                case 'isRunning':
                    if (/^[0-9]+$/.test(args[1])) {
                        $gameVariables.setValue(Number(args[1]), geoLogger.isLogging() ? 1 : 0);
                    }
                    break;
                case 'ChangeUnit':
                    if (/^(m|km|ft|ml)$/.test(args[1])) {
                        geoLogger.changeUnit(args[1]);
                    }
                    break;
                case 'totalDistance':
                    if (/^[0-9]+$/.test(args[1])) {
                        $gameVariables.setValue(Number(args[1]), geoLogger.getTotalDistance());
                    }
                    break;
                default:
            }
        }
    };

    // インターバルタイマーさん。バックグラウンドでの測地に必要。
    var IntervalTimer = function() {
        this.initialize.apply(this, arguments);
    };

    IntervalTimer.prototype.initialize = function(func, interval) {
        this._working = false;
        this._frames = 0;
        this.setup(func, interval);
    };

    IntervalTimer.prototype.setup = function(func, interval) {
        this._interval = interval || Interval;
        this._interval = this._interval * 60;
        this._func = func || null;
    };

    IntervalTimer.prototype.setFunction = function(func) {
        this._func = func;
    };

    IntervalTimer.prototype.setInterval = function(param) {
        this._interval = param || this._interval;
    };

    IntervalTimer.prototype.start = function(interval) {
        this._frames = 0;
        this._working = true;
        this._interval = interval || this._interval;
    };

    IntervalTimer.prototype.stop = function() {
        this._working = false;
    };

    IntervalTimer.prototype.update = function() {
        if (this._working) {
            this._frames++;
            if (this._interval && this._frames >= this._interval) {
                this.onExpire();
            }
        }
    };

    IntervalTimer.prototype.isValidInterval = function(interval) {
        return /^[0-9]+$/.test(String(interval));
    };

    IntervalTimer.prototype.isWorking = function() {
        return this._working;
    };

    IntervalTimer.prototype.onExpire = function() {
        this._func();

        this.reset();
    };

    IntervalTimer.prototype.reset = function(interval) {
        this.clear();
        this.setInterval(interval);
    };

    IntervalTimer.prototype.clear = function() {
        this._frames = 0;
    };

    var GeoLogger = function() {
        this.initialize.apply(this, arguments);
    };

    // ジオレコーダーさん。本体はここよー。
    GeoLogger.prototype.initialize = function(unit, opts) {
        this.setup(unit);
        this.setupOpts(opts);

        if (intervalTimer) {
            intervalTimer.setFunction(this.logging.bind(this));
        }
    };

    GeoLogger.prototype.isValidUnit = function(param) {
        return /^[m|km|ft|ml]$/.test(String(param));
    };

    GeoLogger.prototype.successFunction = function(position) {
        this._position = {
            lat: position['coords']['latitude'],
            lon: position['coords']['longitude']
        };
    };

    GeoLogger.prototype.setup = function(unit) {
        this._GeoManager = new GeoManager();
        this._position = null;
        this._logging = false;
        this._unit = unit || Unit;
    };

    GeoLogger.prototype.isValidOption = function(opts) {
        var result = [
            opts.enableHighAccuracy && typeof opts.enableHighAccuracy === 'boolean',
            opts.maximumAge && typeof opts.maximumAge === 'number',
            opts.timeout && typeof opts.timeout === 'number'
        ];
        return result.filter(function(x){x;}).length === 0;
    };

    GeoLogger.prototype.setupOpts = function(opts) {
        var defaultOpts = {
            enableHighAccuracy: HighAccuracy,
            maximumAge: MaximumAge,
            timeout: Timeout
        };
        opts = opts || defaultOpts;
        this._opts = opts;
        this._GeoManager.setupOpts(this._opts);
    };

    GeoLogger.prototype.isSupport = function() {
        return this._GeoManager.isSupport();
    };

    GeoLogger.prototype.isVlaidUnit = function(unit) {
        return /^[m|km|ft|ml]$/.test(String(param));
    };

    GeoLogger.prototype.changeUnit = function(unit) {
        if (this.isValidUnit(unit)) {
            return false;
        }
        this._unit = unit || this._unit;
        this._GeoManager.setUnit(this._unit);
    };

    GeoLogger.prototype.getCurrent = function() {
        this._GeoManager.getCurrent(this.successFunction.bind(this));
        return this._position;
    };

    GeoLogger.prototype.startLogging = function() {
        this._GeoManager.getCurrent(this.successFunction.bind(this));
        this._logging = true;
        return true;
    };

    GeoLogger.prototype.stopLogging = function() {
        if (!this.isLogging()) {
            return false;
        }
        this._logging = false;
        return true;
    };

    GeoLogger.prototype.getLog = function() {
        return this._geoLog;
    };

    GeoLogger.prototype.getTotalDistance = function() {
        if (geoLog.totalDistance) {
            return this._GeoManager.convertUnit(geoLog.totalDistance);
        } else {
            return 0;
        }
    };

    GeoLogger.prototype.isLogging = function() {
        return this._logging;
    };

    GeoLogger.prototype.clearLog = function() {
        geoLog.totalDistance = 0;
        geoLog.prevPosition = {
            lat: null,
            lon: null
        };
        geoLog.currentPosition = {
            lat: null,
            lon: null
        };
    };

    GeoLogger.prototype.addLog = function(logData) {
        var masterLog = geoLog;
        if (masterLog.currentPosition.lat === logData.position.lat &&
            masterLog.currentPosition.lon === logData.position.lon) {
            return;
        }
        masterLog.prevPosition = masterLog.currentPosition;
        masterLog.currentPosition = logData.position;
        if (logData.distance) {
            masterLog.totalDistance += logData.distance;
        }
    };

    // NOTE: インターバルタイマーで実行する関数
    GeoLogger.prototype.logging = function() {
        this.getCurrent();
        if (!this._position) {
            return;
        } else if (!geoLog.currentPosition && this._position) {
            geoLog.currentPosition = this._position;
            geoLog.totalDistance = 0;
            return;
        } else if (
            this._position &&
            this._position.lat === geoLog.currentPosition.lat &&
            this._position.lon === geoLog.currentPosition.lon
        ) {
            return;
        }
        var prevPosition = geoLog.currentPosition;
        var currentPosition = this._position;
        var distance = this.calculate(
            prevPosition.lat,
            prevPosition.lon,
            currentPosition.lat,
            currentPosition.lon
        );
        var newLog = {
            position: this._position,
            distance: distance
        };
        this.addLog(newLog);
    };

    GeoLogger.prototype.start = function() {
        this.startLogging();
        geoLog.currentPosition = this._position;
        intervalTimer.setFunction(this.logging.bind(this));
        intervalTimer.start();
    };

    GeoLogger.prototype.stop = function() {
       this._logging = false;
       this.stopLogging();
       intervalTimer.stop();
    };

    GeoLogger.prototype.clear = function() {
       this._logging = false;
       intervalTimer.stop();
       this.clearLog();
    };

    GeoLogger.prototype.calculate = function(lat1, lon1, lat2, lon2) {
       return this._GeoManager.calcHubenyFormula(lat1, lon1, lat2, lon2);
    };

    var GeoLog = function() {
    };

    var _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects();

        intervalTimer = new IntervalTimer();
        geoLogger = new GeoLogger();
        geoLog = new GeoLog();

        // エクスポート用のアクセサ
        var Accessor = {};
        Accessor.get = geoLogger.getCurrent.bind(geoLogger);
        Accessor.start = geoLogger.start.bind(geoLogger);
        Accessor.update = geoLogger.logging.bind(geoLogger);
        Accessor.stop = geoLogger.stop.bind(geoLogger);
        Accessor.clear = geoLogger.clear.bind(geoLogger);
        Accessor.distance = geoLogger.getTotalDistance.bind(geoLogger);

        // エクスポート
        Imported.GeoLogger = Accessor;
    };

    var _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        var contents = _DataManager_makeSaveContents();

        contents.geoLog = geoLog;
        return contents;
    };

    var _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents(contents);

        geoLog = contents.geoLog;
    };

    var Scene_Base_update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        if (intervalTimer.isWorking()) {
            intervalTimer.update();
        }

        Scene_Base_update.call(this);
    };

})();
