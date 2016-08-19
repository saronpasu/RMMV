//=============================================================================
// InputRecorder.js
//=============================================================================

/*:
 * @plugindesc Input Recorder. this plugin is development version.
 * input record and play.
 * now version 'only one record' support. re-recording on re-write on save.
 *
 * @author saronpasu
 *
 * @version 0.2.0
 *
 * @param IR_HKey_StartRecord
 * @desc Start Record HotKey
 * @default E
 *
 * @param IR_HKey_PauseRecord
 * @desc Pause Record HotKey(on recording)
 * @default Q
 *
 * @param IR_HKey_ResumeRecord
 * @desc Resume Record HotKey(on recording)
 * @default Q
 *
 * @param IR_HKey_StopAndSaveRecord
 * @desc Stop and Save Record HotKey(on recording)
 * @default E
 *
 * @param IR_HKey_AbortRecord
 * @desc Abort Record HotKey(on recording)
 * @default T
 *
 * @param IR_HKey_DeleteRecord
 * @desc Delete Record HotKey(not worn on recording/play recording)
 * @default G
 *
 * @param IR_HKey_ExportRecord
 * @desc Export Record HotKey(not worn on recording/play recording)
 * @default N
 *
 * @param IR_HKey_ImportRecord
 * @desc Import Record HotKey(not worn on recording/play recording)
 * @default H
 *
 * @param IR_HKey_StartPlayRecord
 * @desc Start Play Record HotKey
 * @default V
 *
 * @param IR_HKey_PausePlayRecord
 * @desc Pause Play Record HotKey(on play record)
 * @default Q
 *
 * @param IR_HKey_ResumePlayRecord
 * @desc Resume Play Record HotKey(on play record)
 * @default Q
 *
 * @param IR_HKey_RpeatPlayControl
 * @desc Abort Switch Repeat　ON/OFF Control HotKey(on play record)
 * @default B
 *
 * @param IR_HKey_AbortPlayRecord
 * @desc Abort Play Record HotKey(on play record)
 * @default T
 *
 * @param IR_HKey_SwitchVisibleControl
 * @desc Switch Visible InputRecord's control
 * @default R
 *
 * @param IR_ControlVisible
 * @desc Visible InputRecord's control
 * @default true
 *
 * @param IR_PlayRecordVisible
 * @desc Visible InputRecord's Play Record
 * @default false
 *
 * @help
 *
 * --- control Keys(Default) ---
 * == Record shift ==
 *   Start  Record: shift + E
 *   Pause  Record: shift + Q (on recording)
 *   Resume Record: shift + Q (on recording)
 *   Stop   Record: shift + E (on recording)
 *   Abort  Record: shift + T (on recording)
 *   Delete Record: shift + G
 *   Export Record: shift + N
 *   Import Record: shift + H
 *
 * == Play Record control ==
 *   Start  Play Record: shift + V
 *   Pause  Play Record: shift + Q (on play record)
 *   Resume Play Record: shift + Q (on play record)
 *   Switch Repeat Play: shift + B (on play record)
 *   Abort  Play Record: shift + T (on play record)
 *
 * == Other control ==
 *   Switch Visible InputRecorder's control (only Hot Key)
 *     shift + R
 *
 *
 * --- control for App ---
 * This plugin 'on' always visible 'InputRecorder' control.
 *
 * == Record control ==
 *   Start  Record: touch 'Start Record'  button.
 *   Pause  Record: touch 'Pause'  button, on pause record.
 *   Resume Record: touch 'Resume' button, on resume record.
 *   Stop   Record: touch 'Stop Record'   button, on save and stop.
 *   Delete Record: touch 'Delete Record' button.
 *
 * == Play Record control ==
 *   Start  Play Record: touch 'Start Play Record'  button.
 *   Pause  Play Record: touch 'Pause'  button.
 *   Resume Play Record: touch 'Resume' button.
 *   Switch Repeat Play: touch 'Repeat ON/OFF'  button.
 *   Abort  Play Record: touch 'Abort'  button.
 *
 *
 * --- for Configuration ---
 * HotKey Setting support 'shift + [A-Z] key'.
 * default settiong is not use gameplay keys.
 *
 */

/*:ja
 * @plugindesc プラグイン名は「インプットレコーダー」。 このプラグインは開発中のものです。
 * 入力された内容を記録、再生する機能を追加します。
 * 現在のバージョンでは「記録はひとつ」しかサポートしていません。 追加で記録した際には上書きされます。
 *
 * @author saronpasu
 *
 * @version 0.2.0
 *
 * @param IR_HKey_StartRecord
 * @desc 記録開始を制御するホットキーです。
 * @default E
 *
 * @param IR_HKey_PauseRecord
 * @desc 記録停止を制御するホットキーです。(記録中のみ動作します)
 * @default Q
 *
 * @param IR_HKey_ResumeRecord
 * @desc 記録停止を再開するホットキーです。(記録中のみ動作します)
 * @default Q
 *
 * @param IR_HKey_StopAndSaveRecord
 * @desc 記録停止と同時に保存を制御するホットキーです。(記録中のみ動作します)
 * @default E
 *
 * @param IR_HKey_AbortRecord
 * @desc 記録中止を制御するホットキーです。(記録中のみ動作します)
 * @default T
 *
 * @param IR_HKey_DeleteRecord
 * @desc 記録の削除を制御するホットキーです。(記録中/再生中には動作しません)
 * @default G
 *
 * @param IR_HKey_ExportRecord
 * @desc 記録のエクスポートを制御するホットキーです。(記録中/再生中には動作しません)
 * @default N
 *
 * @param IR_HKey_ImportRecord
 * @desc 記録のインポートを制御するホットキーです。(記録中/再生中には動作しません)
 * @default H
 *
 * @param IR_HKey_StartPlayRecord
 * @desc 記録の再生を制御するホットキーです。
 * @default V
 *
 * @param IR_HKey_PausePlayRecord
 * @desc 記録の再生停止を制御するホットキーです。(記録の再生中のみ動作します)
 * @default Q
 *
 * @param IR_HKey_ResumePlayRecord
 * @desc 記録の再生停止を再開するホットキーです。(記録の再生中のみ動作します)
 * @default Q
 *
 * @param IR_HKey_RepeatPlayRecord
 * @desc 記録のリピート再生のオン／オフ切り替えするホットキーです。(記録の再生中のみ動作します)
 * @default B
 *
 * @param IR_HKey_AbortPlayRecord
 * @desc 記録の再生中止を制御するホットキーです。(記録の再生中のみ動作します)
 * @default T
 *
 * @param IR_HKey_SwitchVisibleControl
 * @desc 制御ボタンの表示を制御するホットキーです。
 * @default R
 *
 * @param IR_ControlVisible
 * @desc 制御ボタンの表示設定です。
 * @default true
 *
 * @param IR_ControlVisible
 * @desc レコード再生内容の表示設定です。
 * @default false
 *
 * @help
 *
 * --- ホットキー(デフォルトの場合) ---
 * == 記録のコントロール方法 ==
 *   記録を開始する: shift + E
 *   記録を停止する: shift + Q (記録中のみ有効)
 *   記録の停止を再開する: shift + Q (記録中のみ有効)
 *   記録を終了する: shift + E (記録中のみ有効)
 *   記録を中止する: shift + T (記録中のみ有効)
 *   記録を削除する: shift + G (記録中/再生中は動作しません)
 *   記録をエクスポートする: shift + N (記録中/再生中は動作しません)
 *   記録をインポートする: shift + H (記録中/再生中は動作しません)
 *
 * == 記録再生のコントロール方法 ==
 *   記録再生を開始する: shift + V
 *   記録再生を停止する: shift + Q (再生中のみ有効)
 *   記録再生の停止を再開する: shift + Q (再生中のみ有効)
 *   リピート再生のオン（オフ）: shift + B (再生中のみ有効)
 *   記録再生を中止する: shift + T (再生中のみ有効)
 *
 * == その他のコントール方法 ==
 *   制御ボタンの表示/非表示を切り替える: shift + R (ホットキーのみ有効です)
 *
 *
 * --- アプリ向け ---
 * このプラグインが「ON」の場合は、常にプラグインの制御ボタンが表示されます。
 *
 * == 記録のコントロール方法 ==
 *   記録を開始する: 「記録開始」ボタンをタッチして下さい。
 *   記録を停止する: 「一時停止」ボタンをタッチして下さい。
 *   記録の停止を再開する: 「再開」ボタンをタッチして下さい。
 *   記録を終了する: 「記録終了」ボタンをタッチして下さい。
 *   記録を削除する: 「記録削除」ボタンをタッチして下さい。
 *
 * == 記録再生のコントロール方法 ==
 *   記録再生を開始する: 「記録再生」ボタンをタッチして下さい。
 *   記録再生を停止する: 「一時停止」ボタンをタッチして下さい。
 *   記録再生の停止を再開する: ［再開」ボタンをタッチして下さい。
 *   リピート再生のオン（オフ）: 「リピートオン（オフ）」ボタンをタッチして下さい。
 *   記録再生を中止する: 「再生終了」ボタンをタッチして下さい。
 *
 *
 * --- 設定について ---
 * ホットキー設定でサポートしているのは「shift」キーを押しながら「A-Z」キーのいずれかのみです。
 * デフォルトには基本操作に影響しないキーを設定しています。
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

    var parameters = PluginManager.parameters('InputRecorder');

    var IR_HKey_StartRecord = String(parameters['IR HKey Start Record'] || 'E');
    var IR_HKey_PauseRecord = String(parameters['IR HKey Pause Record'] || 'Q');
    var IR_HKey_ResumeRecord = String(parameters['IR HKey Resume Record'] || 'Q');
    var IR_HKey_StopAndSaveRecord = String(parameters['IR HKey Stop and Save Record'] || 'E');
    var IR_HKey_AbortRecord = String(parameters['IR HKey Abort Record'] || 'T');
    var IR_HKey_DeleteRecord = String(parameters['IR HKey Delete Record'] || 'G');
    var IR_HKey_ExportRecord = String(parameters['IR HKey Export Record'] || 'N');
    var IR_HKey_ImportRecord = String(parameters['IR HKey Import Record'] || 'H');

    var IR_HKey_StartPlayRecord = String(parameters['IR HKey Start Play Record'] || 'V');
    var IR_HKey_PausePlayRecord = String(parameters['IR HKey Pause Play Record'] || 'Q');
    var IR_HKey_ResumePlayRecord = String(parameters['IR HKey Resume Play Record'] || 'Q');
    var IR_HKey_RepeatPlayRecord = String(parameters['IR HKey Repeat Play Record'] || 'B');
    var IR_HKey_AbortPlayRecord = String(parameters['IR HKey Abort Play Record'] || 'T');

    var IR_HKey_SwitchVisibleControl = String(parameters['IR HKey Switch Visible Control'] || 'R');

    var IR_ControlVisible = Boolean(parameters['IR Control Visible'] || true);
    var IR_PlayRecordVisible = Boolean(parameters['IR Play Record Visible'] || false);

    var inputRecorder;
    var inputRecord;
    var multiTimer;

    var Multi_Timer = function () {
        this.initialize.apply(this, arguments);
    };

    var VirtualEvent = {};

    VirtualEvent.createEvent = function(src) {
        var event = new Event(src.type);
        for(i in src) {
           event[i] = src[i];
        }
        event.initEvent(src.type, src.bubbles, src.cancelable);
        return event;
    };

    Multi_Timer.prototype.initialize = function() {
        this._frames = 0;
        this._working = false;
        this._queue = null;
    };

    Multi_Timer.prototype.update = function() {
        if (this._working) {
            this._frames++;
            if (this._queue && this._frames >= this._queue) {
                this.onExpire();
            }
        }
    };

    Multi_Timer.prototype.start = function(queue) {
        this._frames = 0;
        this._working = true;
        this._queue = queue;
    };

    Multi_Timer.prototype.stop = function() {
        this._working = false;
    };

    Multi_Timer.prototype.now = function() {
        return this._frames;
    };

    Multi_Timer.prototype.setQueue = function(queue) {
        this._queue = queue;
    };

    Multi_Timer.prototype.isWorking = function() {
        return this._working;
    };

    Multi_Timer.prototype.onExpire = function() {
        // console.log('Multi Timer on Expire');
        var currentRecord = inputRecord.getRecord();
        if (currentRecord) {
            if(inputRecord.nextQueue()) {
                this.setQueue(inputRecord.nextQueue());
            }
            var virtualEvent = VirtualEvent.createEvent(currentRecord.event);
            // console.log('VirtualEvent execute');
            document.dispatchEvent(virtualEvent);
        } else if (inputRecorder.isRepeatPlayRecord()) {
            console.log(' === InputRecorder Repeat Play Record === ');
            multiTimer = new Multi_Timer();
            inputRecord.clear();
            if (inputRecord._record.length === 0) {
                console.log(' non record. ');
                console.log(' === InputRecorder Abort Play Record === ');
                inputRecord.clear();
                inputRecorder._onPlayRecord = false;
                return false;
            }
            multiTimer.start(inputRecord.nextQueue());
            this._onPlayRecord = true;
        } else {
            console.log(' === InputRecorder End Play Record === ');
            inputRecord.clear();
            inputRecorder._onPlayRecord = false;
            this._working = false;
            this._frames = 0;
            this._queue = null;
        }
    };

    var InputRecord = function() {
        this.initialize.apply(this, arguments);
    };

    InputRecord.prototype.initialize = function() {
        this._record = [];
        this.clear();
    };

    InputRecord.prototype.clear = function() {
        this._tempRecord = this._record.slice();
    };

    InputRecord.prototype.applyData = function(data) {
        this._record = data;
    };

    InputRecord.prototype.addRecord = function(data) {
        this._tempRecord.push(data);
    };

    InputRecord.prototype.nextQueue = function() {
        if (this._tempRecord.length !== 0) {
            return this._tempRecord[0].frame;
        }
    };

    InputRecord.prototype.getRecord = function() {
        return this._tempRecord.shift();
    };

    InputRecord.prototype.save = function() {
        this._record = this._tempRecord.slice();
    };

    InputRecord.prototype.delete = function() {
        this._record = [];
    };

    InputRecord.prototype.makeExportData = function() {
        return JSON.stringify(this._record);
    };

    InputRecord.prototype.importData = function(data) {
        this._record = JSON.parse(data);
    };

    InputRecord.prototype.lastFrame = function() {
        var record = this._record.slice(-1)
        return record[0].frame;
    };

    InputRecord.prototype.nextRecord = function() {
        if (this._tempRecord.length !== 0) {
            return this._tempRecord[0];
        } else {
            return false;
        }
    };

    var InputRecorder = function() {
        this.initialize.apply(this, arguments);
    };

    InputRecorder.prototype.clear = function() {
        this._onRecord = false;
        this._onPauseRecord = false;
        this._onPlayRecord = false;
        this._onPausePlay = false;
        this._onRepeatPlay = false;

        this._currentKey = null;
        this._prevKey = null;
        this._pressedTime = 0;
    };

    InputRecorder.prototype.isRecord = function() {
        return this._onRecord;
    };

    InputRecorder.prototype.isPauseRecord = function() {
        return this._onPauseRecord;
    };

    InputRecorder.prototype.isPlayRecord = function() {
        return this._onPlayRecord;
    };

    InputRecorder.prototype.isPausePlayRecord = function() {
        return this._onPausePlayRecord;
    };

    InputRecorder.prototype.isRepeatPlayRecord = function() {
        return this._onRepeatPlayRecord;
    };

    InputRecorder.prototype.isControlVisible = function() {
        return this._controlVisible;
    };

    InputRecorder.prototype.isPlayRecordVisible = function() {
        return this._playRecordVisible;
    };

    InputRecorder.prototype.status = function() {
        var statusTerms_en = {
            recording: 'Recording',
            pause_record: 'Pause Record',
            repeat: 'Repeat ',
            play_record: 'Play Record',
            pause_play_record: 'Pause Play Record',
            standby: 'Standby'
        };
        var statusTerms_ja = {
            recording: '記録中',
            pause_record: '記録中/一時停止',
            repeat: 'リピート',
            play_record: '再生中',
            pause_play_record: '再生中/一時停止',
            standby: 'スタンバイ'
        };
        var statusTerms = statusTerms_en;
        try {
            if ($gameSystem.isJapanese()) {
                statusTerms = statusTerms_ja;
            }
        } catch (e) {
        }

        if (this.isRecord() && !this.isPauseRecord() && !this.isPlayRecord()) {
            return statusTerms['recording'];
        } else if (this.isRecord() && this.isPauseRecord() && !this.isPlayRecord()) {
            return statusTerms['pause_record'];
        } else if (this.isPlayRecord() && !this.isPausePlayRecord() && !this.isRecord()) {
            if (this.isRepeatPlayRecord()) {
                return statusTerms['repeat'] + statusTerms['play_record'];
            } else {
                return statusTerms['play_record'];
            }
        } else if (this.isPlayRecord() && this.isPausePlayRecord() && !this.isRecord()) {
            if (this.isRepeatPlayRecord()) {
                return statusTerms['repeat'] + statusTerms['pause_play_record'];
            } else {
                return statusTerms['pause_play_record'];
            }
        } else {
            return statusTerms['standby'];
        };
    };

    InputRecorder.prototype.recordControlText = function() {
        var recordControlTerms_en = {
            start_record: 'Start Record',
            stop_record: 'Stop Record'
        };
        var recordControlTerms_ja = {
            start_record: '記録開始',
            stop_record: '記録終了'
        };
        var recordControlTerms = recordControlTerms_en;
        try {
            if ($gameSystem.isJapanese()) {
                recordControlTerms = recordControlTerms_ja;
            }
        } catch (e) {
        }

        if (!this.isRecord() && !this.isPlayRecord()) {
            return recordControlTerms['start_record'];
        } else if (this.isRecord() && !this.isPlayRecord()) {
            return recordControlTerms['stop_record'];
        } else {
            return false;
        }
    };

    InputRecorder.prototype.playRecordControlText = function() {
        var playRecordControlTerms_en = {
            start_play_record: 'Start Play Record',
            stop_play_record: 'Stop Play Record'
        };
        var playRecordControlTerms_ja = {
            start_play_record: '再生開始',
            stop_play_record: '再生終了'
        };
        var playRecordControlTerms = playRecordControlTerms_en;
        try {
            if ($gameSystem.isJapanese()) {
                playRecordControlTerms = playRecordControlTerms_ja;
            }
        } catch (e) {
        }

        if (!this.isRecord() && !this.isPlayRecord() && this.hasRecord()) {
            return playRecordControlTerms['start_play_record'];
        } else if (this.isPlayRecord() && !this.isRecord()) {
            return playRecordControlTerms['stop_play_record'];
        } else {
            return false;
        }
    };

    InputRecorder.prototype.pauseControlText = function() {
        var pauseControlTerms_en = {
            pause: 'Pause',
            resume: 'Resume'
        };
        var pauseControlTerms_ja = {
            pause: '一時停止',
            resume: '再開'
        };
        var pauseControlTerms = pauseControlTerms_en;
        try {
            if ($gameSystem.isJapanese()) {
                pauseControlTerms = pauseControlTerms_ja;
            }
        } catch (e) {
        }

        if (!this.isRecord() && !this.isPlayRecord()) {
            return false;
        } else if ((this.isRecord() || this.isPlayRecord()) &&
            (this.isPauseRecord() || this.isPausePlayRecord())
        ) {
            return pauseControlTerms['resume'];
        } else {
            return pauseControlTerms['pause'];
        }
    };

    InputRecorder.prototype.abortControlText = function() {
        var abortControlTerms_en = {
            abort: 'Abort'
        };
        var abortControlTerms_ja = {
            abort: '中止'
        };
        var abortControlTerms = abortControlTerms_en;
        try {
            if ($gameSystem.isJapanese()) {
                abortControlTerms = abortControlTerms_ja;
            }
        } catch (e) {
        }

        if (this.isRecord() || this.isPlayRecord()) {
            return abortControlTerms['abort'];
        } else {
            return false;
        }
    };

    InputRecorder.prototype.repeatControlText = function() {
        var repeatControlTerms_en = {
            repeat_on: 'Repeat ON',
            repeat_off: 'Repeat OFF'
        };
        var repeatControlTerms_ja = {
            repeat_on: 'リピートオン',
            repeat_off: 'リピートオフ'
        };
        var repeatControlTerms = repeatControlTerms_en;
        try {
            if ($gameSystem.isJapanese()) {
                repeatControlTerms = repeatControlTerms_ja;
            }
        } catch (e) {
        }

        if (!this.isRepeatPlayRecord() && this.isPlayRecord()) {
            return repeatControlTerms['repeat_on'];
        } else if (this.isRepeatPlayRecord() && this.isPlayRecord()) {
            return repeatControlTerms['repeat_off'];
        } else {
            return false;
        }
    };

    InputRecorder.prototype.deleteRecordControlText = function() {
        var deleteRecordControlTerms_en = {
            delete_record: 'Delete Record'
        };
        var deleteRecordControlTerms_ja = {
            delete_record: '記録削除'
        };
        var deleteRecordControlTerms = deleteRecordControlTerms_en;
        try {
            if ($gameSystem.isJapanese()) {
                deleteRecordControlTerms = deleteRecordControlTerms_ja;
            }
        } catch (e) {
        }

        if (!this.isRecord() && !this.isPlayRecord() && this.hasRecord()) {
            return deleteRecordControlTerms['delete_record'];
        } else {
            return false;
        }
    };

    // TODO: TAS like display
    InputRecorder.prototype.frameCounter = function() {
        var frameCounterTerms_en = {
            header: '',
            sep: '/',
            footer: ' frames'
        };
        var frameCounterTerms_ja = {
            header: '',
            sep: '/',
            footer: ' frames'
        };
        var frameCounterTerms = frameCounterTerms_en;
        try {
            if ($gameSystem.isJapanese()) {
                frameCounterTerms = frameCounterTerms_ja;
            }
        } catch (e) {
        }

        if (this.isPlayRecordVisible() && this.isPlayRecord()) {
            return frameCounterTerms['header'] +
                multiTimer.now() +
                frameCounterTerms['sep'] +
                inputRecord.lastFrame() +
                frameCounterTerms['footer'];
        } else {
            return false;
        }
    };

    InputRecorder.prototype.recordView = function() {
        var recordViewTerms_en = {
            header: 'Next: ',
            sep: '/',
            frames: ' frames',
            label: 'label: ',
            keyCode: 'keyCode: ',
            altKey: '& Alt ',
            ctrlKey: '& Ctrl ',
            shiftKey: '& Shift ',
            metaKey: '& Meta ',
            pageX: 'pageX: ',
            pageY: 'pageY: ',
            wheelX: 'wheelX: ',
            wheelY: 'wheelY: ',
            deltaX: 'deltaX: ',
            deltaY: 'deltaY: ',
            button: 'button: '
        };
        var recordViewTerms_ja = {
            header: '',
            sep: '/',
            frames: ' frames',
            label: 'label: ',
            keyCode: 'keyCode: ',
            altKey: '& Alt ',
            ctrlKey: '& Ctrl ',
            shiftKey: '& Shift ',
            metaKey: '& Meta ',
            pageX: 'pageX: ',
            pageY: 'pageY: ',
            wheelX: 'wheelX: ',
            wheelY: 'wheelY: ',
            deltaX: 'deltaX: ',
            deltaY: 'deltaY: ',
            button: 'button: '
        };
        var recordViewTerms = recordViewTerms_en;
        try {
            if ($gameSystem.isJapanese()) {
                recordViewTerms = recordViewTerms_ja;
            }
        } catch (e) {
        }

        if (this.isPlayRecordVisible() && this.isPlayRecord() && inputRecord.nextRecord()) {
            var record = inputRecord.nextRecord();
            var event = record.event;
            var result = [recordViewTerms['header'] +
                record.frame +
                recordViewTerms['sep'] +
                inputRecord.lastFrame() +
                recordViewTerms['frames']];
            result.push(recordViewTerms['label'] + record.label);
            var temp = recordViewTerms['keyCode'];
            temp += event.which ? event.which : '---';
            temp += ' ';
            temp += event.shiftKey ? recordViewTerms['shiftKey'] : '';
            temp += event.ctrlKey ? recordViewTerms['ctrlKey'] : '';
            temp += event.altKey ? recordViewTerms['altKey'] : '';
            temp += event.metaKey ? recordViewTerms['metaKey'] : '';
            result.push(temp.slice());
            temp = recordViewTerms['button'];
            temp += event.button ? event.button : '---';
            result.push(temp.slice());
            temp = recordViewTerms['pageX'];
            temp += event.pageX ? event.pageX : '---';
            temp += ' ' + recordViewTerms['pageY'];
            temp += event.pageY ? event.pageY : '---';
            result.push(temp.slice());
            temp = ' ' + recordViewTerms['wheelX'];
            temp += event.wheelX ? event.wheelX : '---';
            temp += ' ' + recordViewTerms['wheelY'];
            temp += event.wheelY ? event.wheelY : '---';
            temp += ' ' + recordViewTerms['deltaX'];
            temp += event.deltaX ? event.deltaX : '---';
            temp += ' ' + recordViewTerms['deltaY'];
            temp += event.deltaY ? event.deltaY : '---';
            result.push(temp.slice());
            return result;
        } else {
            return false;
        }
    };

    InputRecorder.prototype.startRecord = function() {
        console.log('in Start Record');
        var date = new Date;
        var sec = date.getSeconds();
        if (this.isPlayRecord() && this.isRecord()) {
            return false;
        } else if (!this.isRecord() && !this.isPlayRecord() && this._stop_time != sec) {
            console.log(' === InputRecorder Start Record === ');
            multiTimer.start();
            $input_record = new InputRecord();
            this._onRecord = true;
        }
    };

    InputRecorder.prototype.pauseRecord = function() {
        console.log('in Pause Record');
        var date = new Date;
        var sec = date.getSeconds();
        if (!this.isRecord() || this.isPauseRecord() || this.isPlayRecord()) {
            return false;
        } else if (this.isRecord() && !this.isPauseRecord() && this._resume_time != sec) {
            console.log(' === InputRecorder Pause Record === ');
            multiTimer._working = false;
            this._onPauseRecord = true;
        }
    };

    InputRecorder.prototype.resumeRecord = function() {
        console.log('in Resume Record');
        if (!this.isRecord() || !this.isPauseRecord() || this.isPlayRecord()) {
            return false;
        } else if (this.isRecord() && this.isPauseRecord()) {
            console.log(' === InputRecorder Resume Record === ');
            multiTimer._working = true;
            this._onPauseRecord = false;
            var date = new Date;
            var sec = date.getSeconds();
            this._resume_time = sec;
        }
    };

    InputRecorder.prototype.stopAndSaveRecord = function() {
        console.log('in Stop and Save Record');
        if (!this.isRecord() || this.isPlayRecord()) {
            return false;
        } else if (this.isRecord() && !this.isPlayRecord()) {
            console.log(' === InputRecorder Stop And Save Record === ');
            multiTimer = new Multi_Timer();
            inputRecord.save();
            inputRecord.clear();
            this._onRecord = false;
            this._onPauseRecord = false;
            var date = new Date;
            var sec = date.getSeconds();
            this._stop_time = sec;
        }
    };

    InputRecorder.prototype.abortRecord = function() {
        console.log('in Abort Record');
        if (!this.isRecord() || this.isPlayRecord()) {
            return false;
        } else if (this.isRecord() && !this.isPlayRecord()) {
            console.log(' === InputRecorder Abort Record === ');
            multiTimer = new Multi_Timer();
            inputRecord.clear();
            this._onRecord = false;
            this._onPauseRecord = false;
        }
    };

    InputRecorder.prototype.hasRecord = function() {
        return inputRecord._record.length !== 0;
    };

    InputRecorder.prototype.deleteRecord = function() {
        console.log('in Delete Record');
        if (this.isRecord() || this.isPlayRecord() || !this.hasRecord()) {
            return false;
        } else if (!this.isRecord() && !this.isPlayRecord() && this.hasRecord()) {
            console.log(' === InputRecorder Delete Record === ');
            inputRecord = new InputRecord();
            inputRecord.delete();
        }
    };

    InputRecorder.prototype.fileChooce = function(event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function() {
                inputRecord.importData(reader.result);
            };
        }
    };

    InputRecorder.prototype.importRecord = function() {
        console.log('in Import Record');
        if (this.isRecord() || this.isPlayRecord()) {
            return false;
        } else if (!this.isRecord() && !this.isPlayRecord()) {
            console.log(' === InputRecorder Import Record === ');
            if (Utils.isNwjs()) {
                var dirPath = StorageManager.localFileDirectoryPath()+'../InputRecorder/';
                var fileName = 'record.json';
                var fs = require('fs');
                if (!fs.existsSync(dirPath+fileName)) {
                    return;
                }
                var data = fs.readFileSync(dirPath+fileName, 'utf-8');
                inputRecord.importData(data);
            } else {
                var fileInput = document.getElementById('InputRecorder_FileInput');
                fileInput.addEventListener('change', this.fileChooce, false);
                fileInput.click();
            }
        }
    };

    InputRecorder.prototype.exportRecord = function() {
        if (this.isRecord() || this.isPlayRecord() || !this.hasRecord()) {
            return false;
        } else if (!this.isRecord() && !this.isPlayRecord() && this.hasRecord()) {
            console.log(' === InputRecorder Export Record === ');
            var data = inputRecord.makeExportData();
            if (Utils.isNwjs()) {
                // TODO: coding now
                var dirPath = StorageManager.localFileDirectoryPath()+'../InputRecorder/';
                var fileName = 'record.json';
                var fs = require('fs');
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath);
                }
                fs.writeFileSync(dirPath+fileName, data);
            } else {
                var a = document.createElement('a');
                a.download = 'record.json';
                a.href = URL.createObjectURL(new Blob([data], {type: 'application/json'}));
                a.click();
            }
        }
    };

    InputRecorder.prototype.startPlayRecord = function() {
        console.log('in Start Play Record');
        if (this.isRecord() || !this.hasRecord() || this.isPlayRecord()) {
            return false;
        } else if (!this.isRecord() && !this.isPlayRecord() && this.hasRecord()) {
            console.log(' === InputRecorder Start Play Record === ');
            inputRecord.clear();
            multiTimer = new Multi_Timer();
            if (inputRecord._record.length === 0) {
                console.log(' non record. ');
                console.log(' === InputRecorder Abort Play Record === ');
                return false;
            }
            multiTimer.start(inputRecord.nextQueue());
            this._onPlayRecord = true;
            this._onRepeatPlayRecord = false;
        }
    };

    InputRecorder.prototype.pausePlayRecord = function() {
        console.log('in Pause Play Record');
        var date = new Date;
        var sec = date.getSeconds();
        if (!this.isPlayRecord() || this.isPausePlayRecord()) {
            return false;
        } else if (this.isPlayRecord() && !this.isPausePlayRecord() && !this.isRecord() && this._resume_time != sec) {
            console.log(' === InputRecorder Pause Play Record === ');
            multiTimer._working = false;
            this._onPausePlayRecord = true;
        }
    };

    InputRecorder.prototype.resumePlayRecord = function() {
        console.log('in Resume Play Record');
        if (!this.isPlayRecord() || !this.isPausePlayRecord()) {
            return false;
        } else if (this.isPlayRecord() && this.isPausePlayRecord() && !this.isRecord()) {
            console.log(' === InputRecorder Resume Play Record === ');
            multiTimer._working = true;
            this._onPausePlayRecord = false;
            var date = new Date;
            var sec = date.getSeconds();
            this._resume_time = sec;
        }
    };

    InputRecorder.prototype.switchRepeatPlayRecord = function() {
        console.log('in Repeat Play Record');
        if (!this.isPlayRecord() || this.isRecord()) {
            return false;
        } else if (this.isPlayRecord() && !this.isRecord()) {
            console.log(' === InputRecorder Switch Repeat Play Record === ');
            this._onRepeatPlayRecord = !this._onRepeatPlayRecord;
        }
    };

    InputRecorder.prototype.abortPlayRecord = function() {
        console.log('in Abort Play Record');
        if (!this.isPlayRecord() || this.isRecord()) {
            return false;
        } else if (this.isPlayRecord() && !this.isRecord()) {
            console.log(' === InputRecorder Abort Play Record === ');
            inputRecord.clear();
            multiTimer = new Multi_Timer();
            this._onPlayRecord = false;
            this._onPausePlayRecord = false;
            this._onRepeatPlayRecord = false;
        }
    };

    InputRecorder.prototype.switchVisibleControl = function() {
        console.log('in Switch Visible Control');
        if (!this.isPlayRecord || Utils.isMobileDevice()) {
            return false;
        } else {
            console.log(' === InputRecorder Switch Visible Control === ');
            this._controlVisible = !this._controlVisible;
        }
    };

    InputRecorder.prototype.isValidHKey = function(param) {
          var validations = [
              // check type.
              function(target) {
                  if (typeof target === 'string') {
                       return true;
                  } else {
                       console.log('invalid type');
                       return false;
                  }
              },
              // check length.
              function(target) {
                  if (target.length === 1) {
                       return true;
                  } else {
                       console.log('invalid length');
                       return false;
                  }
              },
              // check format.
              function(target) {
                  if (/[A-Z]/.test(target)) {
                       return true;
                  } else {
                       console.log('invalid format');
                       return false;
                  }
              },
          ];
          var validator = function(query) {
              return query(param);
          };
          var result = validations.filter(validator);
          return result.length === 0
    };

    InputRecorder.prototype.isValidControlVisible = function(param) {
          if (typeof param === 'boolean') {
              return true;
          } else {
              console.log('VisibleControl invalid type');
              return false;
          }
    };

    InputRecorder.prototype.checkPluginParameters = function() {
         var HKeyParams = [
             IR_HKey_StartRecord,
             IR_HKey_PauseRecord,
             IR_HKey_ResumeRecord,
             IR_HKey_StopAndSaveRecord,
             IR_HKey_AbortRecord,
             IR_HKey_DeleteRecord,
             IR_HKey_ExportRecord,
             IR_HKey_ImportRecord,

             IR_HKey_StartPlayRecord,
             IR_HKey_PausePlayRecord,
             IR_HKey_ResumePlayRecord,
             IR_HKey_RepeatPlayRecord,
             IR_HKey_AbortPlayRecord,

             IR_HKey_SwitchVisibleControl
         ];
         var result = [];
         result.concat(HKeyParams.filter(this.isValidHKey));
         result.concat(this.isValidControlVisible(IR_ControlVisible));
         result.concat(this.isValidControlVisible(IR_PlayRecordVisible));
         return result.length === 0;
    };

    InputRecorder.keyMapper = {
        'A': 65, 'B': 66, 'C': 67, 'D': 68,
        'E': 69, 'F': 70, 'G': 71, 'H': 72,
        'I': 73, 'J': 74, 'K': 75, 'L': 76,
        'M': 77, 'N': 78, 'O': 79, 'P': 80,
        'Q': 81, 'R': 82, 'S': 83, 'T': 84,
        'U': 85, 'V': 86, 'W': 87, 'X': 88,
        'Y': 89, 'Z': 90
    };

    InputRecorder.prototype.setHotKeys = function() {
        var HotKeys = {};
        var MultiKeys = {};

/* for debug
        console.log(' === IR HotKeys === ');
        console.log(
            'IR HotKey Start Record: Key[ ' +
            IR_HKey_StartRecord + ' ] ' +
            'KeyCode [ ' +
            InputRecorder.keyMapper[IR_HKey_StartRecord].toString() + ' ] '
        );
        console.log(
            'IR HotKey Pause Record: Key[ ' +
            IR_HKey_PauseRecord + ' ] ' +
            'KeyCode [ ' +
            InputRecorder.keyMapper[IR_HKey_PauseRecord].toString() + ' ] '
        );
        console.log(
            'IR HotKey Resume Record: Key[ ' +
            IR_HKey_ResumeRecord + ' ] ' +
            'KeyCode [ ' +
            InputRecorder.keyMapper[IR_HKey_ResumeRecord].toString() + ' ] '
        );
        console.log(
            'IR HotKey Stop and Save Record: Key[ ' +
            IR_HKey_StopAndSaveRecord + ' ] ' +
            'KeyCode [ ' +
            InputRecorder.keyMapper[IR_HKey_StopAndSaveRecord].toString() + ' ] '
        );
        console.log(
            'IR HotKey Abort Record: Key[ ' +
            IR_HKey_AbortRecord + ' ] ' +
            'KeyCode [ ' +
            InputRecorder.keyMapper[IR_HKey_AbortRecord].toString() + ' ] '
        );
        console.log(
            'IR HotKey Delete Record: Key[ ' +
            IR_HKey_DeleteRecord + ' ] ' +
            'KeyCode [ ' +
            InputRecorder.keyMapper[IR_HKey_DeleteRecord].toString() + ' ] '
        );
        console.log(
            'IR HotKey Export Record: Key[ ' +
            IR_HKey_ExportRecord + ' ] ' +
            'KeyCode [ ' +
            InputRecorder.keyMapper[IR_HKey_ExportRecord].toString() + ' ] '
        );
        console.log(
            'IR HotKey Import Record: Key[ ' +
            IR_HKey_ImportRecord + ' ] ' +
            'KeyCode [ ' +
            InputRecorder.keyMapper[IR_HKey_ImportRecord].toString() + ' ] '
        );
        console.log(
            'IR HotKey Start Play Record: Key[ ' +
            IR_HKey_StartPlayRecord + ' ] ' +
            'KeyCode [ ' +
            InputRecorder.keyMapper[IR_HKey_StartPlayRecord].toString() + ' ] '
        );
        console.log(
            'IR HotKey Pause Play Record: Key[ ' +
            IR_HKey_PausePlayRecord + ' ] ' +
            'KeyCode [ ' +
            InputRecorder.keyMapper[IR_HKey_PausePlayRecord].toString() + ' ] '
        );
        console.log(
            'IR HotKey Resume Play Record: Key[ ' +
            IR_HKey_ResumePlayRecord + ' ] ' +
            'KeyCode [ ' +
            InputRecorder.keyMapper[IR_HKey_ResumePlayRecord].toString() + ' ] '
        );
        console.log(
            'IR HotKey Repeat Play Record: Key[ ' +
            IR_HKey_RepeatPlayRecord + ' ] ' +
            'KeyCode [ ' +
            InputRecorder.keyMapper[IR_HKey_RepeatPlayRecord].toString() + ' ] '
        );
        console.log(
            'IR HotKey Abort Play Record: Key[ ' +
            IR_HKey_AbortPlayRecord + ' ] ' +
            'KeyCode [ ' +
            InputRecorder.keyMapper[IR_HKey_AbortPlayRecord].toString() + ' ] '
        );
        console.log(
            'IR HotKey Switch Visible Control: Key[ ' +
            IR_HKey_SwitchVisibleControl + ' ] ' +
            'KeyCode [ ' +
            InputRecorder.keyMapper[IR_HKey_SwitchVisibleControl].toString() + ' ] '
        );

*/

        var setKey = function(keyCode, command) {
            if (HotKeys[keyCode] === undefined) {
               HotKeys[keyCode] = [command];
            } else {
               HotKeys[keyCode].push(command);
            }
        };

        setKey(InputRecorder.keyMapper[IR_HKey_StopAndSaveRecord], this.stopAndSaveRecord.bind(this));
        setKey(InputRecorder.keyMapper[IR_HKey_ResumeRecord], this.resumeRecord.bind(this));
        setKey(InputRecorder.keyMapper[IR_HKey_PauseRecord], this.pauseRecord.bind(this));
        setKey(InputRecorder.keyMapper[IR_HKey_StartRecord], this.startRecord.bind(this));
        setKey(InputRecorder.keyMapper[IR_HKey_AbortRecord], this.abortRecord.bind(this));
        setKey(InputRecorder.keyMapper[IR_HKey_DeleteRecord], this.deleteRecord.bind(this));
        setKey(InputRecorder.keyMapper[IR_HKey_ExportRecord], this.exportRecord.bind(this));
        setKey(InputRecorder.keyMapper[IR_HKey_ImportRecord], this.importRecord.bind(this));

        setKey(InputRecorder.keyMapper[IR_HKey_StartPlayRecord], this.startPlayRecord.bind(this));
        setKey(InputRecorder.keyMapper[IR_HKey_ResumePlayRecord], this.resumePlayRecord.bind(this));
        setKey(InputRecorder.keyMapper[IR_HKey_PausePlayRecord], this.pausePlayRecord.bind(this));
        setKey(InputRecorder.keyMapper[IR_HKey_RepeatPlayRecord], this.switchRepeatPlayRecord.bind(this));
        setKey(InputRecorder.keyMapper[IR_HKey_AbortPlayRecord], this.abortPlayRecord.bind(this));

        setKey(InputRecorder.keyMapper[IR_HKey_SwitchVisibleControl], this.switchVisibleControl.bind(this));

        this.hotKeys = HotKeys;

    };

    InputRecorder.prototype.setup = function() {
        this.clear();
        if (!this.checkPluginParameters()) {
            return false;
        };
        this.setHotKeys();

        if (Utils.isMobileDevice()) {
            this._controlVisible = true;
        } else {
            this._controlVisible = IR_ControlVisible;
        }
        this._playRecordVisible = IR_PlayRecordVisible;

        inputRecord = new InputRecord();
        multiTimer = new Multi_Timer();

        this._resume_time = 0;
        this._stop_time = 0;
    };

    InputRecorder.prototype._wrapNwjsAlert = function() {
        if (Utils.isNwjs()) {
            var _alert = window.alert;
            window.alert = function() {
                var gui = require('nw.gui');
                var win = gui.Window.get();
                _alert.apply(this, arguments);
                win.focus();
                Input.clear();
            };
        }
    };

    InputRecorder.prototype.setupEventHandlers = function() {
        document.addEventListener('keydown', this._onKeyDown.bind(this));
        document.addEventListener('keyup', this._onKeyUp.bind(this));
    };

    InputRecorder.prototype.setupFileInput = function() {
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'application/json';
        fileInput.style.display = 'none';
        fileInput.id = 'InputRecorder_FileInput';
        document.body.appendChild(fileInput);
    };

    InputRecorder.prototype.initialize = function() {
        this.setup();

        this._wrapNwjsAlert();
    };

    InputRecorder.prototype._shouldPreventDefault = function(which) {
        return false;
    };

    InputRecorder.prototype._onKeyDown = function(event) {
        if (this._shouldPreventDefault(event.which)) {
            event.preventDefault();
        }
        if (event.which === 144) {    // Numlock
            this.clear();
            return;
        }
        if (event.shiftKey && event.which != 16) {
            var buttons = this.hotKeys[event.which];
        }

        if (buttons) {
            this._currentKey = event.which;
            if (this._prevKey === this._currentKey) {
                this._pressedTime++;
            } else {
                for(i=0;i<buttons.length;i++) {
                    buttons[i]();
                }
            }
            this._prevKey = this._prevKey || event.which;
        }

        if (!buttons && this.isRecord() && !this.isPauseRecord() &&
            !this.isPlayRecord() && !this.isPausePlayRecord()) {

            var eventSource = {};
            eventSource.type = 'keydown';
            eventSource.keyCode = event.keyCode;
            eventSource.altKey = event.altKey;
            eventSource.ctrlKey = event.ctrlKey;
            eventSource.shiftKey = event.shiftKey;
            eventSource.metaKey = event.metaKey;
            eventSource.which = event.which;
            eventSource.bubbles = event.bubbles;
            eventSource.cancelable = event.cancelable;

            inputRecord.addRecord({
                label: 'KeybordEvent keydown',
                frame: multiTimer.now(),
                event: eventSource
            });

        }
    };

    InputRecorder.prototype._onKeyUp = function(event) {
        if (event.shiftKey && event.which != 16) {
            var buttonName = this.hotKeys[event.which];
        }
        if (event.which === 0) {  // For QtWebEngine on OS X
            this.clear();
            return;
        }

        if (event.shiftKey && event.which != 16) {
            var buttons = this.hotKeys[event.which];
        }

        if (buttons) {
            this._currentKey = null;
            this._prevKey = null;
            this._pressedTime = 0;
        }

        if (!buttonName && this.isRecord() && !this.isPauseRecord() &&
            !this.isPlayRecord() && !this.isPausePlayRecord()) {

            var eventSource = {};
            eventSource.type = 'keyup';
            eventSource.keyCode = event.keyCode;
            eventSource.altKey = event.altKey;
            eventSource.ctrlKey = event.ctrlKey;
            eventSource.shiftKey = event.shiftKey;
            eventSource.metaKey = event.metaKey;
            eventSource.which = event.which;
            eventSource.bubbles = event.bubbles;
            eventSource.cancelable = event.cancelable;

            inputRecord.addRecord({
                label: 'KeybordEvent keyup',
                frame: multiTimer.now(),
                event: eventSource
            });

        }
    };

    TouchInputRecorder = function() {
    };

    TouchInputRecorder.initialize = function() {
    };

    TouchInputRecorder.setupEventHandlers = function() {
        document.addEventListener('mousedown', this._onMouseDown.bind(this));
        document.addEventListener('mousemove', this._onMouseMove.bind(this));
        document.addEventListener('mouseup', this._onMouseUp.bind(this));
        document.addEventListener('wheel', this._onWheel.bind(this));
        document.addEventListener('touchstart', this._onTouchStart.bind(this));
        document.addEventListener('touchmove', this._onTouchMove.bind(this));
        document.addEventListener('touchend', this._onTouchEnd.bind(this));
        document.addEventListener('touchcancel', this._onTouchCancel.bind(this));
        document.addEventListener('pointerdown', this._onPointerDown.bind(this));
    };

    TouchInputRecorder._onMouseDown = function(event) {

        if (inputRecorder.isRecord() && !inputRecorder.isPauseRecord() &&
            !inputRecorder.isPlayRecord() && !inputRecorder.isPausePlayRecord()) {

            var eventSource = {};
            eventSource.type = 'mousedown';
            eventSource.button = event.button;
            eventSource.pageX = event.pageX;
            eventSource.pageY = event.pageY;
            eventSource.bubbles = event.bubbles;
            eventSource.cancelable = event.cancelable;

            inputRecord.addRecord({
                label: 'MouseEvent mousedown',
                frame: multiTimer.now(),
                event: eventSource
            });

        }

    };

    TouchInputRecorder._onMouseMove = function(event) {

        if (inputRecorder.isRecord() && !inputRecorder.isPauseRecord() &&
            !inputRecorder.isPlayRecord() && !inputRecorder.isPausePlayRecord()) {

            var eventSource = {};
            eventSource.type = 'mousemove';
            eventSource.button = event.button;
            eventSource.pageX = event.pageX;
            eventSource.pageY = event.pageY;
            eventSource.bubbles = event.bubbles;
            eventSource.cancelable = event.cancelable;

            inputRecord.addRecord({
                label: 'MouseEvent mousemove',
                frame: multiTimer.now(),
                event: eventSource
            });
        }
    };

    TouchInputRecorder._onMouseUp = function(event) {

        if (inputRecorder.isRecord() && !inputRecorder.isPauseRecord() &&
            !inputRecorder.isPlayRecord() && !inputRecorder.isPausePlayRecord()) {

            var eventSource = {};
            eventSource.type = 'mouseup';
            eventSource.button = event.button;
            eventSource.pageX = event.pageX;
            eventSource.pageY = event.pageY;
            eventSource.bubbles = event.bubbles;
            eventSource.cancelable = event.cancelable;

            inputRecord.addRecord({
                label: 'MouseEvent mouseup',
                frame: multiTimer.now(),
                event: eventSource
            });
        }
    };

    TouchInputRecorder._onWheel = function(event) {

        if (inputRecorder.isRecord() && !inputRecorder.isPauseRecord() &&
            !inputRecorder.isPlayRecord() && !inputRecorder.isPausePlayRecord()) {

            var eventSource = {};
            eventSource.type = 'wheel';
            eventSource.wheelX = event.wheelX;
            eventSource.wheelY = event.wheelY;
            eventSource.deltaX = event.deltaX;
            eventSource.deltaY = event.deltaY;
            eventSource.bubbles = event.bubbles;
            eventSource.cancelable = event.cancelable;

            inputRecord.addRecord({
                label: 'MouseEvent wheel',
                frame: multiTimer.now(),
                event: eventSource
            });
        }
    };

    TouchInputRecorder._onTouchStart = function(event) {

        if (inputRecorder.isRecord() && !inputRecorder.isPauseRecord() &&
            !inputRecorder.isPlayRecord() && !inputRecorder.isPausePlayRecord()) {

            var eventSource = {};
            eventSource.type = 'touchstart';
            eventSource.bubbles = event.bubbles;
            eventSource.cancelable = event.cancelable;
            var changedTouches = [];
            for(i=0;i<event.changedTouches.length;i++) {
                changedTouches.push({
                    pageX: event.changedTouches[i].pageX,
                    pageY: event.changedTouches[i].pageY
                });
            }
            eventSource.changedTouches = changedTouches;
            var targetTouches = [];
            for(i=0;i<event.targetTouches.length;i++) {
                changedTouches.push({
                    pageX: event.targetTouches[i].pageX,
                    pageY: event.targetTouches[i].pageY
                });
            }
            eventSource.targetTouches = targetTouches;
            var touches = [];
            for(i=0;i<event.touches.length;i++) {
                changedTouches.push({
                    pageX: event.touches[i].pageX,
                    pageY: event.touches[i].pageY
                });
            }
            eventSource.touches = touches;

            inputRecord.addRecord({
                label: 'TouchEvent tohchstart',
                frame: multiTimer.now(),
                event: eventSource
            });
        }
    };

    TouchInputRecorder._onTouchMove = function(event) {

        if (inputRecorder.isRecord() && !inputRecorder.isPauseRecord() &&
            !inputRecorder.isPlayRecord() && !inputRecorder.isPausePlayRecord()) {

            var eventSource = {};
            eventSource.type = 'touchmove';
            eventSource.bubbles = event.bubbles;
            eventSource.cancelable = event.cancelable;
            var changedTouches = [];
            for(i=0;i<event.changedTouches.length;i++) {
                changedTouches.push({
                    pageX: event.changedTouches[i].pageX,
                    pageY: event.changedTouches[i].pageY
                });
            }
            eventSource.changedTouches = changedTouches;
            var targetTouches = [];
            for(i=0;i<event.targetTouches.length;i++) {
                changedTouches.push({
                    pageX: event.targetTouches[i].pageX,
                    pageY: event.targetTouches[i].pageY
                });
            }
            eventSource.targetTouches = targetTouches;
            var touches = [];
            for(i=0;i<event.touches.length;i++) {
                changedTouches.push({
                    pageX: event.touches[i].pageX,
                    pageY: event.touches[i].pageY
                });
            }
            eventSource.touches = touches;

            inputRecord.addRecord({
                label: 'TouchEvent tohchmove',
                frame: multiTimer.now(),
                event: eventSource
            });
        }
    };

    TouchInputRecorder._onTouchEnd = function(event) {

        if (inputRecorder.isRecord() && !inputRecorder.isPauseRecord() &&
            !inputRecorder.isPlayRecord() && !inputRecorder.isPausePlayRecord()) {

            var virtualEvent = new Event('touchend');
            var eventSource = {};
            eventSource.type = 'touchend';
            eventSource.bubbles = event.bubbles;
            eventSource.cancelable = event.cancelable;
            var changedTouches = [];
            for(i=0;i<event.changedTouches.length;i++) {
                changedTouches.push({
                    pageX: event.changedTouches[i].pageX,
                    pageY: event.changedTouches[i].pageY
                });
            }
            eventSource.changedTouches = changedTouches;
            var targetTouches = [];
            for(i=0;i<event.targetTouches.length;i++) {
                changedTouches.push({
                    pageX: event.targetTouches[i].pageX,
                    pageY: event.targetTouches[i].pageY
                });
            }
            eventSource.targetTouches = targetTouches;
            var touches = [];
            for(i=0;i<event.touches.length;i++) {
                changedTouches.push({
                    pageX: event.touches[i].pageX,
                    pageY: event.touches[i].pageY
                });
            }
            eventSource.touches = touches;

            inputRecord.addRecord({
                label: 'TouchEvent tohchend',
                frame: multiTimer.now(),
                event: virtualEvent
            });
        }
    };

    TouchInputRecorder._onTouchCancel = function(event) {

        if (inputRecorder.isRecord() && !inputRecorder.isPauseRecord() &&
            !inputRecorder.isPlayRecord() && !inputRecorder.isPausePlayRecord()) {

            var eventSource = {};
            eventSource.type = 'touchcancel';
            eventSource.bubbles = event.bubbles;
            eventSource.cancelable = event.cancelable;
            var changedTouches = [];
            for(i=0;i<event.changedTouches.length;i++) {
                changedTouches.push({
                    pageX: event.changedTouches[i].pageX,
                    pageY: event.changedTouches[i].pageY
                });
            }
            eventSource.changedTouches = changedTouches;
            var targetTouches = [];
            for(i=0;i<event.targetTouches.length;i++) {
                changedTouches.push({
                    pageX: event.targetTouches[i].pageX,
                    pageY: event.targetTouches[i].pageY
                });
            }
            eventSource.targetTouches = targetTouches;
            var touches = [];
            for(i=0;i<event.touches.length;i++) {
                changedTouches.push({
                    pageX: event.touches[i].pageX,
                    pageY: event.touches[i].pageY
                });
            }
            eventSource.touches = touches;

            inputRecord.addRecord({
                label: 'TouchEvent tohchcancel',
                frame: multiTimer.now(),
                event: eventSource
            });
        }
    };

    TouchInputRecorder._onPointerDown = function(event) {

        if (inputRecorder.isRecord() && !inputRecorder.isPauseRecord() &&
            !inputRecorder.isPlayRecord() && !inputRecorder.isPausePlayRecord()) {

            if (event.pointerType === 'touch' && !event.isPrimary) {
                var virtualEvent = new Event(event.type);
                var eventSource = {};
                eventSource.type = event.type;
                eventSource.pageX = event.pageX;
                eventSource.pageY = event.pageY;
                eventSource.bubbles = event.bubbles;
                evnetSource.cancelable = event.cancelable;

                inputRecord.addRecord({
                    label: 'VirtualEvent '+event.type,
                    frame: multiTimer.now(),
                    event: eventSource
                });
            }
        }
    };

    var _SceneManager_initInput = SceneManager.initInput;
    SceneManager.initInput = function() {
        _SceneManager_initInput();

        inputRecorder = new InputRecorder();
        inputRecord = new InputRecord();

        // Accessor for Export.
        var Accessor = {};
        // TODO: write it.
        // Export.
        // Imported.InputRecorder = Accessor;

        inputRecorder.setupEventHandlers();
        inputRecorder.setupFileInput();
        TouchInputRecorder.setupEventHandlers();
    };

    var _Scene_Base_update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        _Scene_Base_update.call(this);

        if (multiTimer && multiTimer.isWorking) {
            multiTimer.update();
        }
    };

    var _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        var contents = _DataManager_makeSaveContents();

        contents.inputRecord = inputRecord;
        return contents;
    };

    var _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents(contents);

        inputRecord = contents.inputRecord;
    };

    var Sprite_InputRecorderStatus = function() {
        this.initialize.apply(this, arguments);
    };

    Sprite_InputRecorderStatus.prototype = Object.create(Sprite.prototype);
    Sprite_InputRecorderStatus.prototype.constructor = Sprite_InputRecorderStatus;

    Sprite_InputRecorderStatus.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this.createBitmap();
        this.update();
    };

    Sprite_InputRecorderStatus.prototype.createBitmap = function() {
        this.bitmap = new Bitmap(420, 32);
        this.bitmap.fontSize = 24;
    };

    Sprite_InputRecorderStatus.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updateBitmap();
        this.updatePosition();
        this.updateVisibility();
    };

    Sprite_InputRecorderStatus.prototype.updateBitmap = function() {
        this.redraw();
    };

    Sprite_InputRecorderStatus.prototype.redraw = function() {
        var statusText = this.statusText();
        var width = this.bitmap.width;
        var height = this.bitmap.height;
        this.bitmap.clear();
        this.bitmap.drawText(statusText, 0, 0, width, height, 'right');
    };

    Sprite_InputRecorderStatus.prototype.statusText = function() {
        return inputRecorder.status();
    };

    Sprite_InputRecorderStatus.prototype.updatePosition = function() {
        this.x = Graphics.width - this.bitmap.width;
        this.y = 32;
    };

    Sprite_InputRecorderStatus.prototype.updateVisibility = function() {
        this.visible = inputRecorder.isControlVisible();
    };

    var Sprite_InputRecorderRecordControlButton = function() {
        this.initialize.apply(this, arguments);
    };

    Sprite_InputRecorderRecordControlButton.prototype = Object.create(Sprite_Button.prototype);
    Sprite_InputRecorderRecordControlButton.prototype.constructor = Sprite_InputRecorderRecordControlButton;

    Sprite_InputRecorderRecordControlButton.prototype.initialize = function() {
        Sprite_Button.prototype.initialize.call(this);
        this.createBitmap();
        this.update();
    };

    Sprite_InputRecorderRecordControlButton.prototype.createBitmap = function() {
        this.bitmap = new Bitmap(150, 32);
        this.bitmap.fontSize = 24;
    };

    Sprite_InputRecorderRecordControlButton.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updateBitmap();
        this.updatePosition();
        this.updateVisibility();
    };

    Sprite_InputRecorderRecordControlButton.prototype.updateBitmap = function() {
        this.redraw();
    };

    Sprite_InputRecorderRecordControlButton.prototype.redraw = function() {
        var recordControlText = this.recordControlText();
        var width = this.bitmap.width;
        var height = this.bitmap.height;
        this.bitmap.clear();
        this.bitmap.drawText(recordControlText, 0, 0, width, height, 'right');

        if (this.isActive() && TouchInput.isTriggered() && this.isButtonTouched()) {

            if (inputRecorder.isRecord()) {
                inputRecorder.stopAndSaveRecord();
            } else {
                inputRecorder.startRecord();
            }

        }
    };

    Sprite_InputRecorderRecordControlButton.prototype.recordControlText = function() {
        return inputRecorder.recordControlText();
    };

    Sprite_InputRecorderRecordControlButton.prototype.updatePosition = function() {
        this.x = Graphics.width - this.bitmap.width;
        this.y = 64;
    };

    Sprite_InputRecorderRecordControlButton.prototype.updateVisibility = function() {
        if (inputRecorder.isControlVisible() && !!this.recordControlText()) {
            this.visible = true;
        } else {
            this.visible = false;
        }
    };

    var Sprite_InputRecorderPlayRecordControlButton = function() {
        this.initialize.apply(this, arguments);
    };

    Sprite_InputRecorderPlayRecordControlButton.prototype = Object.create(Sprite_Button.prototype);
    Sprite_InputRecorderPlayRecordControlButton.prototype.constructor = Sprite_InputRecorderPlayRecordControlButton;

    Sprite_InputRecorderPlayRecordControlButton.prototype.initialize = function() {
        Sprite_Button.prototype.initialize.call(this);
        this.createBitmap();
        this.update();
    };

    Sprite_InputRecorderPlayRecordControlButton.prototype.createBitmap = function() {
        this.bitmap = new Bitmap(150, 32);
        this.bitmap.fontSize = 24;
    };

    Sprite_InputRecorderPlayRecordControlButton.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updateBitmap();
        this.updatePosition();
        this.updateVisibility();
    };

    Sprite_InputRecorderPlayRecordControlButton.prototype.updateBitmap = function() {
        this.redraw();
    };

    Sprite_InputRecorderPlayRecordControlButton.prototype.redraw = function() {
        var playRecordControlText = this.playRecordControlText();
        var width = this.bitmap.width;
        var height = this.bitmap.height;
        this.bitmap.clear();
        this.bitmap.drawText(playRecordControlText, 0, 0, width, height, 'right');

        if (this.isActive() && TouchInput.isTriggered() && this.isButtonTouched()) {

            if (inputRecorder.isPlayRecord()) {
                inputRecorder.abortPlayRecord();
            } else {
                inputRecorder.startPlayRecord();
            }

        }
    };

    Sprite_InputRecorderPlayRecordControlButton.prototype.playRecordControlText = function() {
        return inputRecorder.playRecordControlText();
    };

    Sprite_InputRecorderPlayRecordControlButton.prototype.updatePosition = function() {
        this.x = Graphics.width - this.bitmap.width;
        this.y = 96;
    };

    Sprite_InputRecorderPlayRecordControlButton.prototype.updateVisibility = function() {
        if (inputRecorder.isControlVisible() && !!this.playRecordControlText()) {
            this.visible = true;
        } else {
            this.visible = false;
        }
    };

    var Sprite_InputRecorderPauseControlButton = function() {
        this.initialize.apply(this, arguments);
    };

    Sprite_InputRecorderPauseControlButton.prototype = Object.create(Sprite_Button.prototype);
    Sprite_InputRecorderPauseControlButton.prototype.constructor = Sprite_InputRecorderPauseControlButton;

    Sprite_InputRecorderPauseControlButton.prototype.initialize = function() {
        Sprite_Button.prototype.initialize.call(this);
        this.createBitmap();
        this.update();
    };

    Sprite_InputRecorderPauseControlButton.prototype.createBitmap = function() {
        this.bitmap = new Bitmap(150, 32);
        this.bitmap.fontSize = 24;
    };

    Sprite_InputRecorderPauseControlButton.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updateBitmap();
        this.updatePosition();
        this.updateVisibility();
    };

    Sprite_InputRecorderPauseControlButton.prototype.updateBitmap = function() {
        this.redraw();
    };

    Sprite_InputRecorderPauseControlButton.prototype.redraw = function() {
        var pauseControlText = this.pauseControlText();
        var width = this.bitmap.width;
        var height = this.bitmap.height;
        this.bitmap.clear();
        this.bitmap.drawText(pauseControlText, 0, 0, width, height, 'right');

        if (this.isActive() && TouchInput.isTriggered() && this.isButtonTouched()) {

            if (inputRecorder.isRecord() && !inputRecorder.isPauseRecord()) {
                inputRecorder.pauseRecord();
            } else if (inputRecorder.isRecord() && inputRecorder.isPauseRecord()) {
                inputRecorder.resumeRecord();
            } else if (inputRecorder.isPlayRecord() && !inputRecorder.isPausePlayRecord()) {
                inputRecorder.pausePlayRecord();
            } else if (inputRecorder.isPlayRecord() && inputRecorder.isPausePlayRecord()) {
                inputRecorder.resumePlayRecord();
            }

        }
    };

    Sprite_InputRecorderPauseControlButton.prototype.pauseControlText = function() {
        return inputRecorder.pauseControlText();
    };

    Sprite_InputRecorderPauseControlButton.prototype.updatePosition = function() {
        this.x = Graphics.width - this.bitmap.width;
        this.y = 128;
    };

    Sprite_InputRecorderPauseControlButton.prototype.updateVisibility = function() {
        if (inputRecorder.isControlVisible() && !!this.pauseControlText()) {
            this.visible = true;
        } else {
            this.visible = false;
        }
    };

    var Sprite_InputRecorderAbortControlButton = function() {
        this.initialize.apply(this, arguments);
    };

    Sprite_InputRecorderAbortControlButton.prototype = Object.create(Sprite_Button.prototype);
    Sprite_InputRecorderAbortControlButton.prototype.constructor = Sprite_InputRecorderAbortControlButton;

    Sprite_InputRecorderAbortControlButton.prototype.initialize = function() {
        Sprite_Button.prototype.initialize.call(this);
        this.createBitmap();
        this.update();
    };

    Sprite_InputRecorderAbortControlButton.prototype.createBitmap = function() {
        this.bitmap = new Bitmap(150, 32);
        this.bitmap.fontSize = 24;
    };

    Sprite_InputRecorderAbortControlButton.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updateBitmap();
        this.updatePosition();
        this.updateVisibility();
    };

    Sprite_InputRecorderAbortControlButton.prototype.updateBitmap = function() {
        this.redraw();
    };

    Sprite_InputRecorderAbortControlButton.prototype.redraw = function() {
        var abortControlText = this.abortControlText();
        var width = this.bitmap.width;
        var height = this.bitmap.height;
        this.bitmap.clear();
        this.bitmap.drawText(abortControlText, 0, 0, width, height, 'right');

        if (this.isActive() && TouchInput.isTriggered() && this.isButtonTouched()) {

            if (inputRecorder.isRecord()) {
                inputRecorder.abortRecord();
            } else if (inputRecorder.isPlayRecord()) {
                inputRecorder.abortPlayRecord();
            }

        }
    };

    Sprite_InputRecorderAbortControlButton.prototype.abortControlText = function() {
        return inputRecorder.abortControlText();
    };

    Sprite_InputRecorderAbortControlButton.prototype.updatePosition = function() {
        this.x = Graphics.width - this.bitmap.width;
        this.y = 160;
    };

    Sprite_InputRecorderAbortControlButton.prototype.updateVisibility = function() {
        if (inputRecorder.isControlVisible() && !!this.abortControlText()) {
            this.visible = true;
        } else {
            this.visible = false;
        }
    };

    var Sprite_InputRecorderRepeatControlButton = function() {
        this.initialize.apply(this, arguments);
    };

    Sprite_InputRecorderRepeatControlButton.prototype = Object.create(Sprite_Button.prototype);
    Sprite_InputRecorderRepeatControlButton.prototype.constructor = Sprite_InputRecorderRepeatControlButton;

    Sprite_InputRecorderRepeatControlButton.prototype.initialize = function() {
        Sprite_Button.prototype.initialize.call(this);
        this.createBitmap();
        this.update();
    };

    Sprite_InputRecorderRepeatControlButton.prototype.createBitmap = function() {
        this.bitmap = new Bitmap(150, 32);
        this.bitmap.fontSize = 24;
    };

    Sprite_InputRecorderRepeatControlButton.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updateBitmap();
        this.updatePosition();
        this.updateVisibility();
    };

    Sprite_InputRecorderRepeatControlButton.prototype.updateBitmap = function() {
        this.redraw();
    };

    Sprite_InputRecorderRepeatControlButton.prototype.redraw = function() {
        var repeatControlText = this.repeatControlText();
        var width = this.bitmap.width;
        var height = this.bitmap.height;
        this.bitmap.clear();
        this.bitmap.drawText(repeatControlText, 0, 0, width, height, 'right');

        if (this.isActive() && TouchInput.isTriggered() && this.isButtonTouched()) {

            if (inputRecorder.isPlayRecord()) {
                inputRecorder.switchRepeatPlayRecord();
            }

        }
    };

    Sprite_InputRecorderRepeatControlButton.prototype.repeatControlText = function() {
        return inputRecorder.repeatControlText();
    };

    Sprite_InputRecorderRepeatControlButton.prototype.updatePosition = function() {
        this.x = Graphics.width - this.bitmap.width;
        this.y = 192;
    };

    Sprite_InputRecorderRepeatControlButton.prototype.updateVisibility = function() {
        if (inputRecorder.isControlVisible() && !!this.repeatControlText()) {
            this.visible = true;
        } else {
            this.visible = false;
        }
    };

    var Sprite_InputRecorderDeleteRecordControlButton = function() {
        this.initialize.apply(this, arguments);
    };

    Sprite_InputRecorderDeleteRecordControlButton.prototype = Object.create(Sprite_Button.prototype);
    Sprite_InputRecorderDeleteRecordControlButton.prototype.constructor = Sprite_InputRecorderDeleteRecordControlButton;

    Sprite_InputRecorderDeleteRecordControlButton.prototype.initialize = function() {
        Sprite_Button.prototype.initialize.call(this);
        this.createBitmap();
        this.update();
    };

    Sprite_InputRecorderDeleteRecordControlButton.prototype.createBitmap = function() {
        this.bitmap = new Bitmap(150, 32);
        this.bitmap.fontSize = 24;
    };

    Sprite_InputRecorderDeleteRecordControlButton.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updateBitmap();
        this.updatePosition();
        this.updateVisibility();
    };

    Sprite_InputRecorderDeleteRecordControlButton.prototype.updateBitmap = function() {
        this.redraw();
    };

    Sprite_InputRecorderDeleteRecordControlButton.prototype.redraw = function() {
        var deleteRecordControlText = this.deleteRecordControlText();
        var width = this.bitmap.width;
        var height = this.bitmap.height;
        this.bitmap.clear();
        this.bitmap.drawText(deleteRecordControlText, 0, 0, width, height, 'right');

        if (this.isActive() && TouchInput.isTriggered() && this.isButtonTouched()) {

            if (inputRecorder.hasRecord() && !inputRecorder.isRecord() && !inputRecorder.isPlayRecord()) {
                inputRecorder.deleteRecord();
            }

        }
    };

    Sprite_InputRecorderDeleteRecordControlButton.prototype.deleteRecordControlText = function() {
        return inputRecorder.deleteRecordControlText();
    };

    Sprite_InputRecorderDeleteRecordControlButton.prototype.updatePosition = function() {
        this.x = Graphics.width - this.bitmap.width;
        this.y = 128;
    };

    Sprite_InputRecorderDeleteRecordControlButton.prototype.updateVisibility = function() {
        if (inputRecorder.isControlVisible() && !!this.deleteRecordControlText()) {
            this.visible = true;
        } else {
            this.visible = false;
        }
    };

    Spriteset_Base.prototype.createInputRecorderStatus = function() {
        this._inputRecorderSpriteStatus = new Sprite_InputRecorderStatus();
        this.addChild(this._inputRecorderSpriteStatus);
    };

    Spriteset_Base.prototype.createInputRecorderRecordControlButton = function() {
        this._inputRecorderSpriteRecordControlButton = new Sprite_InputRecorderRecordControlButton();
        this.addChild(this._inputRecorderSpriteRecordControlButton);
    };

    Spriteset_Base.prototype.createInputRecorderPlayRecordControlButton = function() {
        this._inputRecorderSpritePlayRecordControlButton = new Sprite_InputRecorderPlayRecordControlButton();
        this.addChild(this._inputRecorderSpritePlayRecordControlButton);
    };

    Spriteset_Base.prototype.createInputRecorderPauseControlButton = function() {
        this._inputRecorderSpritePauseControlButton = new Sprite_InputRecorderPauseControlButton();
        this.addChild(this._inputRecorderSpritePauseControlButton);
    };

    Spriteset_Base.prototype.createInputRecorderRepeatControlButton = function() {
        this._inputRecorderSpriteRepeatControlButton = new Sprite_InputRecorderRepeatControlButton();
        this.addChild(this._inputRecorderSpriteRepeatControlButton);
    };

    Spriteset_Base.prototype.createInputRecorderAbortControlButton = function() {
        this._inputRecorderSpriteAbortControlButton = new Sprite_InputRecorderAbortControlButton();
        this.addChild(this._inputRecorderSpriteAbortControlButton);
    };

    Spriteset_Base.prototype.createInputRecorderDeleteRecordControlButton = function() {
        this._inputRecorderSpriteDeleteRecordControlButton = new Sprite_InputRecorderDeleteRecordControlButton();
        this.addChild(this._inputRecorderSpriteDeleteRecordControlButton);
    };

    // TODO: TAS like display
    var Sprite_InputRecorderFrameCounter = function() {
        this.initialize.apply(this, arguments);
    };

    Sprite_InputRecorderFrameCounter.prototype = Object.create(Sprite.prototype);
    Sprite_InputRecorderFrameCounter.prototype.constructor = Sprite_InputRecorderFrameCounter;

    Sprite_InputRecorderFrameCounter.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this.createBitmap();
        this.update();
    };

    Sprite_InputRecorderFrameCounter.prototype.createBitmap = function() {
        this.bitmap = new Bitmap(420, 32);
        this.bitmap.fontSize = 24;
    };

    Sprite_InputRecorderFrameCounter.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updateBitmap();
        this.updatePosition();
        this.updateVisibility();
    };

    Sprite_InputRecorderFrameCounter.prototype.updateBitmap = function() {
        this.redraw();
    };

    Sprite_InputRecorderFrameCounter.prototype.redraw = function() {
        var frameCounter = this.frameCounter();
        var width = this.bitmap.width;
        var height = this.bitmap.height;
        this.bitmap.clear();
        this.bitmap.drawText(frameCounter, 0, 0, width, height, 'right');
    };

    Sprite_InputRecorderFrameCounter.prototype.frameCounter = function() {
        return inputRecorder.frameCounter();
    };

    Sprite_InputRecorderFrameCounter.prototype.updatePosition = function() {
        this.x = Graphics.width - this.bitmap.width;
        this.y = 224;
    };

    Sprite_InputRecorderFrameCounter.prototype.updateVisibility = function() {
        if (inputRecorder.isControlVisible() && !!this.frameCounter()) {
            this.visible = true;
        } else {
            this.visible = false;
        }
    };

    var Sprite_InputRecorderRecordView = function() {
        this.initialize.apply(this, arguments);
    };

    Sprite_InputRecorderRecordView.prototype = Object.create(Sprite.prototype);
    Sprite_InputRecorderRecordView.prototype.constructor = Sprite_InputRecorderRecordView;

    Sprite_InputRecorderRecordView.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this.createBitmap();
        this.update();
    };

    Sprite_InputRecorderRecordView.prototype.createBitmap = function() {
        this.bitmap = new Bitmap(420, 192);
        this.bitmap.fontSize = 24;
    };

    Sprite_InputRecorderRecordView.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updateBitmap();
        this.updatePosition();
        this.updateVisibility();
    };

    Sprite_InputRecorderRecordView.prototype.updateBitmap = function() {
        this.redraw();
    };

    Sprite_InputRecorderRecordView.prototype.redraw = function() {
        var recordView = this.recordView();
        var width = this.bitmap.width;
        var height = this.bitmap.height;
        this.bitmap.clear();
        for(i=0;i<recordView.length;i++) {
            this.bitmap.drawText(recordView[i], 0, 32 * i, width, 32, 'right');
        }
    };

    Sprite_InputRecorderRecordView.prototype.recordView = function() {
        return inputRecorder.recordView();
    };

    Sprite_InputRecorderRecordView.prototype.updatePosition = function() {
        this.x = Graphics.width - this.bitmap.width;
        this.y = 256;
    };

    Sprite_InputRecorderRecordView.prototype.updateVisibility = function() {
        if (inputRecorder.isControlVisible() && !!this.recordView()) {
            this.visible = true;
        } else {
            this.visible = false;
        }
    };


    Spriteset_Base.prototype.createInputRecorderFrameCounter = function() {
        this._inputRecorderSpriteFrameCounter = new Sprite_InputRecorderFrameCounter();
        this.addChild(this._inputRecorderSpriteFrameCounter);
    };

    Spriteset_Base.prototype.createInputRecorderRecordView = function() {
        this._inputRecorderSpriteRecordView = new Sprite_InputRecorderRecordView();
        this.addChild(this._inputRecorderSpriteRecordView);
    };

    var _Spriteset_Base_createUpperLayer = Spriteset_Base.prototype.createUpperLayer;
    Spriteset_Base.prototype.createUpperLayer = function() {
        _Spriteset_Base_createUpperLayer.call(this);

        this.createInputRecorderStatus();
        this.createInputRecorderRecordControlButton();
        this.createInputRecorderPlayRecordControlButton();
        this.createInputRecorderPauseControlButton();
        this.createInputRecorderAbortControlButton();
        this.createInputRecorderRepeatControlButton();
        this.createInputRecorderDeleteRecordControlButton();

        this.createInputRecorderFrameCounter();
        this.createInputRecorderRecordView();
    };


})();
