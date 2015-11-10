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
 * @version 0.0.1
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
 * @default 30000
 *
 * @param Timeout
 * @desc geo location api option (ms)
 * @default 27000
 *
 * @param Interval
 * @desc logging interval (sec)
 * @default 30
 *
 * Plugin Command:
 *   GeoLogger isSupport 1      # geo location api supported status into variables[1] (0 or 1)
 *   GeoLogger start            # start logging
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
 * @default 30000
 *
 * @param Timeout
 * @desc ジオロケーションAPIのオプション (ミリ秒)
 * @default 27000
 *
 * @param Interval
 * @desc ジオログ取得間隔 (秒)
 * @default 30
 *
 * Plugin Command:
 *   GeoLogger isSupport 1      # ジオロケーションAPIがサポートされているかどうかを変数「１」に返します（０か１）
 *   GeoLogger start            # ジオログ取得開始
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
    console.error('Download GeoManager.js [url]');
    throw new Error('This plugin needs GeoManager.js');
}

Imported.GeoLogger = {};

(function() {

    'use strict';

    var parameters = PluginManager.parameters('GeoLogger');
    var Unit = String(parameters['Unit'] || 'm');
    var HighAccuracy = Boolean(parameters['HighAccuracy'] || true);
    var MaximumAge = Number(parameters['MaximumAge'] || 30000);
    var Timeout = Number(parameters['Timeout'] || 27000);
    var Interval = Number(parameters['Interval'] || 30);

    // GeoManager をインポート
    var GeoManager = Imported['GeoManager'];

    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'GeoLogger') {
            var chikuwa = new Chikuwa();
            switch (args[0]) {
                case 'isSupport':
                    if (/^[0-9]+$/.test(args[1])) {
                        $gameVariables[args[1]] = geoLogger.isSupport() ? 0 : 1;
                    }
                case 'Start':
                    geoLogger.start();
                    break;
                case 'Stop':
                    geoLogger.stop();
                    break;
                case 'Clear':
                    geoLogger.clear();
                    break;
                case 'isRunning':
                    if (/^[0-9]+$/.test(args[1])) {
                        $gameVariables[args[1]] = geoLogger.isLogging() ? 0 : 1;
                    }
                    break;
                case 'ChangeUnit':
                    if (/^(m|km|ft|ml)$/.test(args[1])) {
                        geoLogger.changeUnit(args[1]);
                    }
                    break;
                case 'TotalDistance':
                    if (/^[0-9]+$/.test(args[1])) {
                        $gameVariables[args[1]] = geoLogger.getTotalDistance();
                    }
                    break;
                default:
            }
        }
    };

    // インターバルタイマーさん。バックグラウンドでの測地に必要。
    var IntervalTimer = function() {
    };

    IntervalTimer.prototype.initialize = function(func, interval) {
        this._working = false;
        this._frame = 0;
        this.setup(func, interval);
    };

    IntervalTimer.prototype.setup = function(func, interval) {
        this._interval = interval || Interval;
        this._interval = this._interval * 60;
        this._func = func || geoLogger.logging;
    };

    IntervalTimer.prototype.setFunction = function(func) {
        this._func = func;
    };

    IntervalTimer.prototype.setInterval = function(param) {
        this._interval = param;
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
        this._frame = 0;
    };

    var GeoLogger = function() {
    };

    // ジオレコーダーさん。本体はここよー。
    GeoLogger.prototype.initialize = function(unit, opts) {
        this.setup(unit);
        this.setupOpts(opts);
    };

    GeoLogger.prototype.isValidUnit = function(param) {
        return /^[m|km|ft|ml]$/.test(String(param));
    };

    GeoLogger.prototype.successFunction = function(position) {
        this._position = {
            lat: positon.coords.latitude,
            lon: position.coords.longitude
        };
    };

    GeoLogger.prototype.setup = function(unit) {
        this._GeoManager = GeoManager.new();
        this._positoin = null;
        this._logging = false;
        this._unit = unit || Unit;
    };

    GeoLogger.prototype.isValidOption = function(opts) {
        var result = [
            opts.enableHighAccuracy && typeof opts.enableHighAccuracy === 'boolean',
            opts.maximumAge && typeof opts.maximumAge === 'number',
            opts.timeout && typeof opts.timeout === 'number'
        ];
        return result.filter(function(x){x}).length === 0;
    };

    GeoLogger.prototype.setupOpts = function(opts) {
        defualtOpts = {
            enableHighAccuracy: HighAccuracy,
            maximumAge: MaximumAge,
            timeout: Timeout
        };
        var opts = opts || defaultOpts;
        this._opts = opts;
    };

    GeoLogger.prototype.isVlaidUnit = function(unit) {
        return /^[m|km|ft|ml]$/.test(String(param));
    };

    GeoLogger.prototype.changeUnit = function(unit) {
        if (this.isValidUnit(unit)) {
            return false;
        }
        this._unit = unit;
    };

    GeoLogger.prototype.getCurrent = function() {
        this._GeoManager.getCurrent(this.successFunction);
    };

    GeoLogger.prototype.startLogging = function() {
        this._GeoManager.startWatch(this.successFunction);
        this._logging = true;
        return true;
    };

    GeoLogger.prototype.stopLogging = function() {
        if (!this.isLogging()) {
            return false;
        }
        this._GeoManager.stopWatch();
        this._logging = false;
        return true;
    };

    GeoLogger.prototype.getLog = function() {
        return this._geoLog;
    };

    GeoLogger.prototype.getTotalDistance = function() {
        var totalDistance = this._geoLog.totalDistance;
        return this._GeoManager.convertUnit(totalDistance, this._unit);
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

    GeoLogger.prototype.calcDistance = function() {
        this._geoLog.totalDistance = 0;
    };

    GeoLogger.prototype.addLog = function(logData) {
        var masterLog = geoLog;
        masterLog.prevPosition = masterLog.currentPosition;
        masterLog.currentPosition = logData.position;
        masterLog.totalDistance += logData.distance;
    };

    // NOTE: インターバルタイマーで実行する関数
    GeoLogger.prototype.logging = function() {
        this.startLogging(this.successFuntion);
        if (geoLog.currentPosition.lat === null) {
            geoLog.currentPosition = this._position;
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
        this.startLogging(this.successFunction);
        geoLog.currentPosition = this._position;
        intervalTimer.start();
    };

    GeoLogger.prototype.stop = function() {
       this._logging = false;
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

    var geoLog;
    var geoLogger;
    var intervalTimer;

    var DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        DataManager_createGameObjects();

        intervalTimer = new IntervalTimer();
        geoLogger = new GeoLogger();
        geoLog = new GeoLog();
    };

    var DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        var contents = DataManger_makeSaveContents();

        contents.geoLog = geoLog;
    };

    var DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        DataManager_extractSaveContents(contents);

        geoLog = contents.geoLog;
    };

    var Scene_Base_update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        if (intervalTimer.isWorking()) {
            intervalTimer.update();
        }

        Scene_Base_update.call(this);
    };

    // エクスポート用のアクセサ
    var Accessor = {};
    var geologger = new GeoLogger();
    Accessor.get = geologger.getCurrent;
    Accessor.start = geologger.start;
    Accessor.stop = geologger.stop;
    Accessor.clear = geologger.clear;
    Accessor.distance = geologger.getTotalDistance;

    // エクスポート
    Imported.GeoLogger = Accessor;    

})();

