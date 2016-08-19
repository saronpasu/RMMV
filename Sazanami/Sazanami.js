//=============================================================================
// Sazanami.js
//=============================================================================

/*:
* @plugindesc Sazanami(漣) is Sound Noise Checker.
*      sound noise input from devices mic.
*      controll on plugin-command and plugin-params
*
*
* @version 0.0.1
*
* @author saronpasu
*
* @help
*
* @param frameLimit
* @desc Noise Check Frames
* @default 300
*
* @param reportType
* @desc output format.chice on Noise Level or Decibel. (Level||Decibel)
* @default Level
*
* @param returnFlag
* @desc return value setting. game variables or none. (gameVariables||none)
* @default gameVariables
*
* @param returnGameValiablesNo
* @desc return value input game variables number.
* @default 1
*
* Plugin Command:
*      Sazanami start                 # start Noise Check
*      Sazanami status                # Noise Check status
*      Sazanami stop                  # stop Noise Check
*      Sazanami abort                 # abort Noise Check
*      Sazanami resume                # resume Noise Check
*      Sazanami restart               # restart Noise Check
*      Sazanami isRunning             # Noise Check running is true.
*
*  騒音レベルとデシベル値の対応表
*       120 dB    9 lv  // ジェット機、飛行場
*       110 dB    8 lv  // 自動車のクラクション
*       100 dB    7 lv  // 電車のガード下
*        90 dB    6 lv  // わんこの鳴き声
*        80 dB    5 lv  // 地下鉄の車内
*        70 dB    4 lv  // 騒々しい街頭
*        60 dB    3 lv  // 普通の会話
*        50 dB    2 lv  // 静かな事務所
*        40 dB    1 lv  // 図書館
*        30 dB    0 lv  // ささやき声
*
*
 */

/*:ja
 * @plugindesc Sazanami(漣) は、騒音計プラグインです。
 *      マイクの音量を測定して、騒音レベルまたはデシベル値でゲーム変数へ返します。
 *      プラグインコマンド、プラグインパラメータで制御します。
 *      プラグイン外部からの直接操作可能なアクセサも提供しています。
 *
 * @version 0.0.1
 *
 * @author saronpasu
 *
 * @help
 *
 * @param frameLimit
 * @desc 計測するフレーム数
 * @default 300
 *
 * @param reportType
 * @desc 出力形式。騒音レベルかデシベルで指定。 (Level||Decibel)
 * @default Level
 *
 * @param returnFlag
 * @desc 返り値の求め方。ゲーム変数に返すか、返さないかで指定。 (gameVariables||none)
 * @default gameVariables
 *
 * @param returnGameValiablesNo
 * @desc 返り値を格納するゲーム変数の番号を指定。
 * @default 1
 *
 * Plugin Command:
 *      Sazanami start                 # 騒音チェックを開始
 *      Sazanami status                # 騒音チェックの動作を確認
 *      Sazanami stop                  # 騒音チェックを停止
 *      Sazanami abort                 # 騒音チェックを中止
 *      Sazanami resume                # 騒音チェックの停止を再開
 *      Sazanami restart               # 騒音チェックをやり直し
 *      Sazanami isRunning             # 騒音チェックが実行中か確認
 *
 *  騒音レベルとデシベル値の対応表
 *       120 dB    9 lv  // ジェット機、飛行場
 *       110 dB    8 lv  // 自動車のクラクション
 *       100 dB    7 lv  // 電車のガード下
 *        90 dB    6 lv  // わんこの鳴き声
 *        80 dB    5 lv  // 地下鉄の車内
 *        70 dB    4 lv  // 騒々しい街頭
 *        60 dB    3 lv  // 普通の会話
 *        50 dB    2 lv  // 静かな事務所
 *        40 dB    1 lv  // 図書館
 *        30 dB    0 lv  // ささやき声
 *
 *
 */

/*
 * Copyright (c) 2016 saronpasu
 *
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 *
 */

var Imported = Imported || {};
Imported.Sazanami = {};

(function() {

    'use strict';

    var soundChecker;
    // 内部用 タイマーさん
    var sazanamiTimer;

    var parameters = PluginManager.parameters('Sazanami');
    var PluginParam = String(parameters['frameLimit'] || 300);
    var PluginParam = String(parameters['reportType'] || 'level');
    var PluginParam = String(parameters['returnFlag'] || 'gameVariables');
    var PluginParam = String(parameters['returnGameValiablesNo'] || -1);

    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'Sazanami') {
            switch (args[0]) {
                case 'start':
                    soundChecker.start();
                    break;
                case 'stop':
                    soundChecker.stop();
                    break;
                case 'resume':
                    soundChecker.resume();
                    break;
                case 'abort':
                    soundChecker.abort();
                    break;
                case 'restart':
                    soundChecker.restart();
                    break;
                case 'report':
                    if (args[1] == 'Level') {

                    }else if (args[1] == 'Decibel') {

                    }
                    break;
                case 'status':
                    return soundChecker.status();
                    break;
                case 'isRunning':
                    return !!(soundChecker.status() == 'running')
                    break;
                // サポート対象外だけど実装だけしておく
                case 'setting':
                    switch (args[1]) {
                        case 'frameLimit':
                            if (/^[0-1]+$/.test(args[2])) {
                                soundChecker.changeSetting('frameLimit', args[2]);
                            }
                            break;
                        case 'reportType':
                            if (args[2] == 'gameVariablesNo') {
                                soundChecker.changeSetting('reportType', 'gameVariablesNo');
                            } else if (args[2] == 'none') {
                                soundChecker.changeSetting('reportType', 'none');
                            }
                            break;
                        case 'gameVariablesNo':
                            if (/^[0-1]+$/.test(args[2])) {
                                soundChecker.changeSetting('gameVariablesNo', args[2]);
                            }
                            break;
                        // コマンド不一致
                        default:

                    }
                    break;

                // コマンド不一致
                default:

            }
        }
    };

    var DecibelReportLevel = [
        [120 ,   9],  // ジェット機、飛行場
        [110 ,   8],  // 自動車のクラクション
        [100 ,   7],  // 電車のガード下
        [90  ,   6],  // わんこの鳴き声
        [80  ,   5],  // 地下鉄の車内
        [70  ,   4],  // 騒々しい街頭
        [60  ,   3],  // 普通の会話
        [50  ,   2],  // 静かな事務所
        [40  ,   1],  // 図書館
        [30  ,   0]   // ささやき声
    ];

    var SoundChecker = function() {
        this.initialize.apply(this, arguments);
    };

    SoundChecker.prototype.initialize = function() {
        this.setup();
    };

    SoundChecker.prototype.setup = function() {

        this._status = 'standby';
        this._frameLimit = parameters['frameLimit'] || 300;
        this._reportType = parameters['reportType'] || 'Level'; // or 'Decibel'
        this._recordDecibel = 0;
        this._returnFlag = parameters['returnFlag'] || 'gameVariables'; // or 'none'
        this._returnGameValiablesNo = parameters['returnGameValiablesNo'] || 1;

        // マイクデバイスの準備とかもろもろ
        // context を生成
        this._audioContext = new AudioContext()
        // analyser を生成
        this._analyser = this._audioContext.createAnalyser();
        // default値 2048 を設定
        this._analyser.fftSize = 2048;
        // しきい値(最大) 0 dB を設定
        this._analyser.maxDecibels = 0;
        // しきい値(最低) 120 dB を設定
        this._analyser.minDecibels = -120;
        this._frequency = new Uint8Array(this._analyser.frequencyBinCount);

        // 正規化
        navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;

        navigator.getUserMedia(
            {audio : true},
            function(stream){
                soundChecker._audioContext.createMediaStreamSource(stream).connect(soundChecker._analyser);
            },
            console.log
        );

        sazanamiTimer = new SazanamiTimer();

    };

    SoundChecker.prototype.status = function() {
        return this._status;
    };

    SoundChecker.prototype.isRunning = function() {
        return this._status == 'running';
    };

    SoundChecker.prototype.init = function() {
        this._frameLimit = parameters['frameLimit'] || 300;
        this._reportType = parameters['reportType'] || 'Level'; // or 'Decibel'
        this._recordDecibel = 0;
        this._returnFlag = parameters['returnFlag'] || 'gameVariables'; // or 'none'
        this._returnGameValiablesNo = parameters['returnGameValiablesNo'] || -1;
    };

    SoundChecker.prototype.start = function() {
        if (!soundChecker.status() == 'resume') {
            this.init();
        }
        this._status = 'running';
        sazanamiTimer.start(this._frameLimit);
    };

    SoundChecker.prototype.update = function() {

        // ここで値を取り出す。
        soundChecker._analyser.getByteFrequencyData(soundChecker._frequency);
        var decibel = Math.floor(soundChecker._frequency[0]*120/255);
        if(soundChecker._recordDecibel <= decibel) {
            soundChecker._recordDecibel = decibel
        }

    };

    SoundChecker.prototype.stop = function() {
        if(soundChecker.status() == 'running') {
            sazanamiTimer.stop();
            this._status = 'resume';
        }
    };

    SoundChecker.prototype.resume = function() {
        if(soundChecker.status() == 'resume') {
            sazanamiTimer.resume();
            this._status = 'running';
        }
    };

    SoundChecker.prototype.abort = function() {
        this.init();
        sazanamiTimer.abort();
    };

    SoundChecker.prototype.restart = function() {
        if(soundChecker.status() != 'standby') {
            this.init();
            sazanamiTimer.start(this._frameLimit);
        }
    };

    SoundChecker.prototype.output = function() {
        return this.report();
    };

    SoundChecker.prototype.report = function() {
        if(this._reportType == 'Level') {
            for(var i=0;i<DecibelReportLevel.length;i++) {
                if(soundChecker._recordDecibel >= DecibelReportLevel[i][0]) {
                    return DecibelReportLevel[i][1];
                }
            }
        }else if (this._reportType == 'Decibel') {
            return this._recordDecibel;
        }
    };

    SoundChecker.prototype.changeSetting = function(type, params) {
        switch (type) {
            case 'frameLimit':
                if (/^[0-9]+$/.test(params)) {
                    this._frameLimit = params;
                }
                break;
            case 'reportType':
                switch (params) {
                    case 'Level':
                        this._reportType = 'Level';
                        break;
                    case 'Decibel':
                        this._reportType = 'Decibel';
                        break;
                    default:

                }
                break;
            case 'returnFlag':
                switch (params) {
                    case 'gameVariables':
                        this._returnFlag = 'gameVariables';
                        break;
                    case 'none':
                        this._returnFlag = 'none';
                        break;
                    default:

                }
                break;
            case 'returnGameValiablesNo':
                if (/^[0-9]+$/.test(params)) {
                    this._returnGameValiablesNo = params;
                }
                break;
            default:

        }
    };

    // Define SazanamiTimer
    var SazanamiTimer = function () {
        this.initialize.apply(this, arguments);
    };

    SazanamiTimer.prototype.initialize = function() {
        this._frames = 0;
        this._working = false;
        this._queue = null;
    };

    SazanamiTimer.prototype.update = function() {
        if (this._working) {
            this._frames++;

            soundChecker.update();

            if (this._queue && this._frames >= this._queue) {
                this.onExpire();
            }
        }
    };

    SazanamiTimer.prototype.start = function(queue) {
        this._frames = 0;
        this._working = true;
        this._queue = queue;
    };

    SazanamiTimer.prototype.stop = function() {
        this._working = false;
    };

    SazanamiTimer.prototype.abort = function() {
        this._frames = 0;
        this._working = false;
        this._queue = null;
    };

    SazanamiTimer.prototype.resume = function() {
        this._working = true;
    };

    SazanamiTimer.prototype.restart = function(queue) {
        this._frames = 0;
        this._working = true;
        this._queue = queue;
    };

    SazanamiTimer.prototype.now = function() {
        return this._frames;
    };

    SazanamiTimer.prototype.setQueue = function(queue) {
        this._queue = queue;
    };

    SazanamiTimer.prototype.isWorking = function() {
        return this._working;
    };

    SazanamiTimer.prototype.onExpire = function() {
        this.abort();

        if(soundChecker._returnFlag == 'gameVariables') {
            $gameVariables.setValue(soundChecker._returnGameValiablesNo, soundChecker.report());
        }

        soundChecker._status = 'standby';
    };

    // Scene_Base を alias して上書き
    var _Scene_Base_update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        _Scene_Base_update.call(this);

        if (sazanamiTimer && sazanamiTimer.isWorking) {
            sazanamiTimer.update();
        }
    };

    // DataManager を alias して上書き
    var _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects();

        if (!soundChecker) {
            soundChecker = new SoundChecker();
        }

        // 外部へエクスポート
        var Accessor = {};
        Accessor.start = soundChecker.start.bind(soundChecker);
        Accessor.status = soundChecker.status.bind(soundChecker);
        Accessor.stop = soundChecker.stop.bind(soundChecker);
        Accessor.resume = soundChecker.resume.bind(soundChecker);
        Accessor.abort = soundChecker.abort.bind(soundChecker);
        Accessor.restart = soundChecker.restart.bind(soundChecker);
        Accessor.changeSetting = soundChecker.changeSetting.bind(soundChecker);
        Accessor.report = soundChecker.report.bind(soundChecker);
        Accessor.output = soundChecker.output.bind(soundChecker);

        Imported.Sazanami = Accessor;
    };


    /* クロージャの関数をテスト用にエクスポート
     * NOTE: NWjs で実行する際にエラーにならないように try catch 構文を使っています。
     * もっとスマートな実装方法がないかな。
     */
    try {
        if (isTest) {
            exports.SoundChecker = SoundChecker;
        }
    }
    catch(e) {
    }
})();
