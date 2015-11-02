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
 * @version 0.0.1
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
 *
 * == Play Record shift ==
 *   Start  Play Record: shift + V
 *   Pause  Play Record: shift + Q (on play record)
 *   Resume Play Record: shift + Q (on play record)
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
 * == Record shift ==
 *   Start  Record: touch 'Start Record'  button.
 *   Pause  Record: touch 'Pause'  button, on pause record.
 *   Resume Record: touch 'Resume' button, on resume record.
 *   Stop   Record: touch 'Stop Record'   button, on save and stop.
 *   Delete Record: touch 'Delete Record' button.
 *
 * == Play Record shift ==
 *   Start  Play Record: touch 'Start Play Record'  button.
 *   Pause  Play Record: touch 'Pause'  button.
 *   Resume Play Record: touch 'Resume' button.
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
 * @version 0.0.1
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
 *
 * == 記録再生のコントロール方法 ==
 *   記録再生を開始する: shift + V
 *   記録再生を停止する: shift + Q (再生中のみ有効)
 *   記録再生の停止を再開する: shift + Q (再生中のみ有効)
 *   記録再生を中止する: shift + T (再生中のみ有効)
 *
 * == Other shift ==
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
 *   記録再生を中止する: 「再生終了」ボタンをタッチして下さい。
 *
 *
 * --- 設定について ---
 * ホットキー設定でサポートしているのは「shift」キーを押しながら「A-Z」キーのいずれかのみです。
 * デフォルトには基本操作に影響しないキーを設定しています。
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

    var IR_HKey_StartPlayRecord = String(parameters['IR HKey Start Play Record'] || 'V');
    var IR_HKey_PausePlayRecord = String(parameters['IR HKey Pause Play Record'] || 'Q');
    var IR_HKey_ResumePlayRecord = String(parameters['IR HKey Resume Play Record'] || 'Q');
    var IR_HKey_AbortPlayRecord = String(parameters['IR HKey Abort Play Record'] || 'T');

    var IR_HKey_SwitchVisibleControl = String(parameters['IR HKey Switch Visible Control'] || 'R');

    var IR_ControlVisible = Boolean(parameters['IR Control Visible'] || true);

    var Multi_Timer = function () {
        this.initialize.apply(this, arguments);
    };

    var VirtualEvent = function() {
    };

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
        var currentRecord = $input_record.getRecord();
        if (currentRecord) {
            if($input_record.nextQueue()) {
                this.setQueue($input_record.nextQueue());
            }
            var virtualEvent = VirtualEvent.createEvent(currentRecord.event);
            // console.log('VirtualEvent execute');
            document.dispatchEvent(virtualEvent);
        } else {
            console.log(' === InputRecorder End Play Record === ');
            InputRecorder._onPlayRecord = false;
            this._working = false;
            this._frames = 0;
            this._queue = null;
        }
    };

    var InputRecord = function() {
        this._record = [];
    };

    InputRecord.prototype.applyData = function(data) {
        this._record = data;
    };

    InputRecord.prototype.addRecord = function(data) {
        this._record.push(data);
    };

    InputRecord.prototype.nextQueue = function() {
        if (this._record.length != 0) {
            return this._record[0].frame;
        }
    };

    InputRecord.prototype.getRecord = function() {
        return this._record.shift();
    };

    InputRecord.prototype.delete = function() {
        StorageManager.remove(-2);
        this._record = [];
    };

    InputRecord.prototype.load = function() {
        var json;
        var config = {};
        try {
            json = StorageManager.load(-2);
        } catch (e) {
            console.error(e);
        }
        if (json) {
            data = JSON.parse(json);
        }
        this.applyData(data);
    };

    InputRecord.prototype.makeData = function() {
        return this._record;
    };

    InputRecord.prototype.save = function() {
        StorageManager.save(-2, JSON.stringify(this.makeData()));
    };

    InputRecordPlayer = function() {
    };

    InputRecorder = function() {
         this._onRecord = false;
         this._onPauseRecord = false;
         this._onPlay = false;
         this._onPausePlay = false;
         this.F = true;
         this._tempRecord = new InputRecord();
    };

    InputRecorder.isRecord = function() {
        return this._onRecord;
    };

    InputRecorder.isPauseRecord = function() {
        return this._onPauseRecord;
    };

    InputRecorder.isPlayRecord = function() {
        return this._onPlayRecord;
    };

    InputRecorder.isPausePlayRecord = function() {
        return this._onPausePlayRecord;
    };

    InputRecorder.isControlVisible = function() {
        return this._controlVisible;
    };

    InputRecorder.status = function() {
        var statusTerms_en = {
            recording: 'Recording',
            pause_record: 'Pause Record',
            play_record: 'Play Record',
            pause_play_record: 'Pause Play Record',
            standby: 'Standby'
        };
        var statusTerms_ja = {
            recording: '記録中',
            pause_record: '記録中/一時停止',
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

        if (InputRecorder.isRecord() && !InputRecorder.isPauseRecord() && !InputRecorder.isPlayRecord()) {
            return statusTerms['recording'];
        } else if (InputRecorder.isRecord() && InputRecorder.isPauseRecord() && !InputRecorder.isPlayRecord()) {
            return statusTerms['pause_record'];
        } else if (InputRecorder.isPlayRecord() && !InputRecorder.isPausePlayRecord() && !InputRecorder.isRecord()) {
            return statusTerms['play_record'];
        } else if (InputRecorder.isPlayRecord() && InputRecorder.isPausePlayRecord() && !InputRecorder.isRecord()) {
            return statusTerms['pause_play_record'];
        } else {
            return statusTerms['standby'];
        };
    };

    InputRecorder.recordControlText = function() {
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

        if (!InputRecorder.isRecord() && !InputRecorder.isPlayRecord()) {
            return recordControlTerms['start_record'];
        } else if (InputRecorder.isRecord() && !InputRecorder.isPlayRecord()) {
            return recordControlTerms['stop_record'];
        } else {
            return false;
        }
    };

    InputRecorder.playRecordControlText = function() {
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

        if (!InputRecorder.isRecord() && !InputRecorder.isPlayRecord() && InputRecorder.hasRecord()) {
            return playRecordControlTerms['start_play_record'];
        } else if (InputRecorder.isPlayRecord() && !InputRecorder.isRecord()) {
            return playRecordControlTerms['stop_play_record'];
        } else {
            return false;
        }
    };

    InputRecorder.pauseControlText = function() {
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

        if (!InputRecorder.isRecord() && !InputRecorder.isPlayRecord()) {
            return false;
        } else if ((InputRecorder.isRecord() || InputRecorder.isPlayRecord()) &&
            (InputRecorder.isPauseRecord() || InputRecorder.isPausePlayRecord())
        ) {
            return pauseControlTerms['resume'];
        } else {
            return pauseControlTerms['pause'];
        }
    };

    InputRecorder.abortControlText = function() {
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

        if (InputRecorder.isRecord() || InputRecorder.isPlayRecord()) {
            return abortControlTerms['abort'];
        } else {
            return false;
        }
    };

    InputRecorder.deleteRecordControlText = function() {
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

        if (!InputRecorder.isRecord() && !InputRecorder.isPlayRecord() && InputRecorder.hasRecord()) {
            return deleteRecordControlTerms['delete_record'];
        } else {
            return false;
        }
    };

    InputRecorder.startRecord = function() {
        console.log('in Start Record');
        var date = new Date;
        var sec = date.getSeconds();
        if (InputRecorder.isPlayRecord() && InputRecorder.isRecord()) {
            return false;
        } else if (!InputRecorder.isRecord() && !InputRecorder.isPlayRecord() && this._stop_time != sec) {
            console.log(' === InputRecorder Start Record === ');
            $multi_timer.start();
            $input_record = new InputRecord();
            this._onRecord = true;
        }
    };

    InputRecorder.pauseRecord = function() {
        console.log('in Pause Record');
        var date = new Date;
        var sec = date.getSeconds();
        if (!InputRecorder.isRecord() || InputRecorder.isPauseRecord() || InputRecorder.isPlayRecord()) {
            return false;
        } else if (InputRecorder.isRecord() && !InputRecorder.isPauseRecord() && this._resume_time != sec) {
            console.log(' === InputRecorder Pause Record === ');
            $multi_timer._working = false;
            this._onPauseRecord = true;
        }
    };

    InputRecorder.resumeRecord = function() {
        console.log('in Resume Record');
        if (!InputRecorder.isRecord() || !InputRecorder.isPauseRecord() || InputRecorder.isPlayRecord()) {
            return false;
        } else if (InputRecorder.isRecord() && InputRecorder.isPauseRecord()) {
            console.log(' === InputRecorder Resume Record === ');
            $multi_timer._working = true;
            this._onPauseRecord = false;
            var date = new Date;
            var sec = date.getSeconds();
            this._resume_time = sec;
        }
    };

    InputRecorder.stopAndSaveRecord = function() {
        console.log('in Stop and Save Record');
        if (!InputRecorder.isRecord() || InputRecorder.isPlayRecord()) {
            return false;
        } else if (InputRecorder.isRecord() && !InputRecorder.isPlayRecord()) {
            console.log(' === InputRecorder Stop And Save Record === ');
            $input_record.save();
            $multi_timer = new Multi_Timer();
            $input_record = new InputRecord();
            this._onRecord = false;
            this._onPauseRecord = false;
            var date = new Date;
            var sec = date.getSeconds();
            this._stop_time = sec;
        }
    };

    InputRecorder.abortRecord = function() {
        console.log('in Abort Record');
        if (!InputRecorder.isRecord() || InputRecorder.isPlayRecord()) {
            return false;
        } else if (InputRecorder.isRecord() && !InputRecorder.isPlayRecord()) {
            console.log(' === InputRecorder Abort Record === ');
            $multi_timer = new Multi_Timer();
            $input_record = new InputRecord();
            this._onRecord = false;
            this._onPauseRecord = false;
        }
    };

    InputRecorder.hasRecord = function() {
        return StorageManager.exists(-2);
    };

    InputRecorder.deleteRecord = function() {
        console.log('in Delete Record');
        if (InputRecorder.isRecord() || InputRecorder.isPlayRecord() || !InputRecorder.hasRecord()) {
            return false;
        } else if (!InputRecorder.isRecord() && !InputRecorder.isPlayRecord() && InputRecorder.hasRecord()) {
            console.log(' === InputRecorder Delete Record === ');
            $input_record = new InputRecord();
            $input_record.delete();
        }
    };


    InputRecorder.startPlayRecord = function() {
        console.log('in Start Play Record');
        if (InputRecorder.isRecord() || !InputRecorder.hasRecord() || InputRecorder.isPlayRecord()) {
            return false;
        } else if (!InputRecorder.isRecord() && !InputRecorder.isPlayRecord() && InputRecorder.hasRecord()) {
            console.log(' === InputRecorder Start Play Record === ');
            $multi_timer = new Multi_Timer();
            $input_record = new InputRecord();
            $input_record.load();
            if ($input_record._record.length === 0) {
                console.log(' non record. ');
                console.log(' === InputRecorder Abort Play Record === ');
                return false;
            }
            $multi_timer.start($input_record.nextQueue());
            this._onPlayRecord = true;
        }
    };

    InputRecorder.pausePlayRecord = function() {
        console.log('in Pause Play Record');
        var date = new Date;
        var sec = date.getSeconds();
        if (!InputRecorder.isPlayRecord() || InputRecorder.isPausePlayRecord()) {
            return false;
        } else if (InputRecorder.isPlayRecord() && !InputRecorder.isPausePlayRecord() && !InputRecorder.isRecord() && this._resume_time != sec) {
            console.log(' === InputRecorder Pause Play Record === ');
            $multi_timer._working = false;
            this._onPausePlayRecord = true;
        }
    };

    InputRecorder.resumePlayRecord = function() {
        console.log('in Resume Play Record');
        if (!InputRecorder.isPlayRecord() || !InputRecorder.isPausePlayRecord()) {
            return false;
        } else if (InputRecorder.isPlayRecord() && InputRecorder.isPausePlayRecord() && !InputRecorder.isRecord()) {
            console.log(' === InputRecorder Resume Play Record === ');
            $multi_timer._working = true;
            this._onPausePlayRecord = false;
            var date = new Date;
            var sec = date.getSeconds();
            this._resume_time = sec;
        }
    };

    InputRecorder.abortPlayRecord = function() {
        console.log('in Abort Play Record');
        if (!InputRecorder.isPlayRecord() || InputRecorder.isRecord()) {
            return false;
        } else if (InputRecorder.isPlayRecord() && !InputRecorder.isRecord()) {
            console.log(' === InputRecorder Abort Play Record === ');
            $multi_timer = new Multi_Timer();
            $input_record = new InputRecord();
            this._onPlayRecord = false;
            this._onPausePlayRecord = false;
        }
    };

    InputRecorder.switchVisibleControl = function() {
        console.log('in Switch Visible Control');
        if (!InputRecorder.isPlayRecord || Utils.isMobileDevice()) {
            return false;
        } else {
            console.log(' === InputRecorder Switch Visible Control === ');
            this._controlVisible = !this._controlVisible;
        }
    };

    InputRecorder.isValidHKey = function(param) {
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

    InputRecorder.isValidControlVisible = function(param) {
          if (typeof param === 'boolean') {
              return true;
          } else {
              console.log('VisibleControl invalid type');
              return false;
          }
    };

    InputRecorder.checkPluginParameters = function() {
         var HKeyParams = [
             IR_HKey_StartRecord,
             IR_HKey_PauseRecord,
             IR_HKey_ResumeRecord,
             IR_HKey_StopAndSaveRecord,
             IR_HKey_AbortRecord,
             IR_HKey_DeleteRecord,

             IR_HKey_StartPlayRecord,
             IR_HKey_PausePlayRecord,
             IR_HKey_ResumePlayRecord,
             IR_HKey_AbortPlayRecord,

             IR_HKey_SwitchVisibleControl
         ];
         var result = [];
         result.concat(HKeyParams.filter(InputRecorder.isValidHKey));
         result.concat(InputRecorder.isValidControlVisible(IR_ControlVisible));
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

    InputRecorder.setHotKeys = function() {
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

        setKey(InputRecorder.keyMapper[IR_HKey_StopAndSaveRecord], function() {InputRecorder.stopAndSaveRecord()});
        setKey(InputRecorder.keyMapper[IR_HKey_ResumeRecord], function() {InputRecorder.resumeRecord()});
        setKey(InputRecorder.keyMapper[IR_HKey_PauseRecord], function() {InputRecorder.pauseRecord()});
        setKey(InputRecorder.keyMapper[IR_HKey_StartRecord], function() {InputRecorder.startRecord()});
        setKey(InputRecorder.keyMapper[IR_HKey_AbortRecord], function() {InputRecorder.abortRecord()});
        setKey(InputRecorder.keyMapper[IR_HKey_DeleteRecord], function() {InputRecorder.deleteRecord()});

        setKey(InputRecorder.keyMapper[IR_HKey_StartPlayRecord], function() {InputRecorder.startPlayRecord()});
        setKey(InputRecorder.keyMapper[IR_HKey_ResumePlayRecord], function() {InputRecorder.resumePlayRecord()});
        setKey(InputRecorder.keyMapper[IR_HKey_PausePlayRecord], function() {InputRecorder.pausePlayRecord()});
        setKey(InputRecorder.keyMapper[IR_HKey_AbortPlayRecord], function() {InputRecorder.abortPlayRecord()});

        setKey(InputRecorder.keyMapper[IR_HKey_SwitchVisibleControl], function() {InputRecorder.switchVisibleControl()});

        this.hotKeys = HotKeys;

    };

    InputRecorder.setup = function() {
         if (!InputRecorder.checkPluginParameters()) {
             return false;
         };
         InputRecorder.setHotKeys();

         if (Utils.isMobileDevice()) {
             InputRecorder._controlVisible = true;
         } else {
             InputRecorder._controlVisible = IR_ControlVisible;
         }
         
         $input_record = new InputRecord();
         $multi_timer = new Multi_Timer();
         
         this._resume_time = 0;
         this._stop_time = 0;
    };

    InputRecorder._wrapNwjsAlert = function() {
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

    InputRecorder._setupEventHandlers = function() {
        document.addEventListener('keydown', this._onKeyDown.bind(this));
        document.addEventListener('keyup', this._onKeyUp.bind(this));
    };

    InputRecorder.initialize = function() {
        this.setup();

        this._wrapNwjsAlert();
        this._setupEventHandlers();
    };

    InputRecorder._shouldPreventDefault = function(which) {
        return false;
    };

    InputRecorder._onKeyDown = function(event) {
        if (this._shouldPreventDefault(event.which)) {
            event.preventDefault();
        }
        if (event.which === 144) {    // Numlock
            this.clear();
            return;
        }
        if (event.shiftKey && event.which != 16) {
            var buttonName = this.hotKeys[event.which];
        }

        if (buttonName) {
           for(i=0;i<buttonName.length;i++) {
               buttonName[i]();
           }
        }
        


        if (!buttonName && InputRecorder.isRecord() && !InputRecorder.isPauseRecord() &&
            !InputRecorder.isPlayRecord() && !InputRecorder.isPausePlayRecord()) {

            var eventSource = {};
            eventSource.type = 'keydown';
            eventSource.keyCode = event.keyCode;
            eventSource.altKey = event.altKey;
            eventSource.ctrlKey = event.ctrlKey;
            eventSource.metaKey = event.metaKey;
            eventSource.which = event.which;
            eventSource.bubbles = event.bubbles;
            eventSource.cancelable = event.cancelable;

            $input_record.addRecord({
                label: 'KeybordEvent keydown',
                frame: $multi_timer.now(),
                event: eventSource
            });

        }
    };

    InputRecorder._onKeyUp = function(event) {
        if (event.shiftKey && event.which != 16) {
            var buttonName = this.hotKeys[event.which];
        }
        if (event.which === 0) {  // For QtWebEngine on OS X
            this.clear();
            return;
        }

        if (!buttonName && InputRecorder.isRecord() && !InputRecorder.isPauseRecord() &&
            !InputRecorder.isPlayRecord() && !InputRecorder.isPausePlayRecord()) {

            var eventSource = {};
            eventSource.type = 'keyup';
            eventSource.keyCode = event.keyCode;
            eventSource.altKey = event.altKey;
            eventSource.ctrlKey = event.ctrlKey;
            eventSource.metaKey = event.metaKey;
            eventSource.which = event.which;
            eventSource.bubbles = event.bubbles;
            eventSource.cancelable = event.cancelable;

            $input_record.addRecord({
                label: 'KeybordEvent keyup',
                frame: $multi_timer.now(),
                event: eventSource
            });

        }
    };

    TouchInputRecorder = function() {
    };

    TouchInputRecorder.initialize = function() {
        this._setupEventHandlers();
    };

    TouchInputRecorder._setupEventHandlers = function() {
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

        if (InputRecorder.isRecord() && !InputRecorder.isPauseRecord() &&
            !InputRecorder.isPlayRecord() && !InputRecorder.isPausePlayRecord()) {

            var eventSource = {};
            eventSource.type = 'mousedown';
            eventSource.button = event.button;
            eventSource.pageX = event.pageX;
            eventSource.pageY = event.pageY;
            eventSource.bubbles = event.bubbles;
            eventSource.cancelable = event.cancelable;

            $input_record.addRecord({
                label: 'MouseEvent mousedown',
                frame: $multi_timer.now(),
                event: eventSource
            });

        }

    };

    TouchInputRecorder._onMouseMove = function(event) {

        if (InputRecorder.isRecord() && !InputRecorder.isPauseRecord() &&
            !InputRecorder.isPlayRecord() && !InputRecorder.isPausePlayRecord()) {

            var eventSource = {};
            eventSource.type = 'mousemove';
            eventSource.button = event.button;
            eventSource.pageX = event.pageX;
            eventSource.pageY = event.pageY;
            eventSource.bubbles = event.bubbles;
            eventSource.cancelable = event.cancelable;

            $input_record.addRecord({
                label: 'MouseEvent mousemove',
                frame: $multi_timer.now(),
                event: eventSource
            });

        }

    };

    TouchInputRecorder._onMouseUp = function(event) {

        if (InputRecorder.isRecord() && !InputRecorder.isPauseRecord() &&
            !InputRecorder.isPlayRecord() && !InputRecorder.isPausePlayRecord()) {

            var eventSource = {};
            eventSource.type = 'mouseup';
            eventSource.button = event.button;
            eventSource.pageX = event.pageX;
            eventSource.pageY = event.pageY;
            eventSource.bubbles = event.bubbles;
            eventSource.cancelable = event.cancelable;

            $input_record.addRecord({
                label: 'MouseEvent mouseup',
                frame: $multi_timer.now(),
                event: eventSource
            });

        }

    };
    
    TouchInputRecorder._onWheel = function(event) {

        if (InputRecorder.isRecord() && !InputRecorder.isPauseRecord() &&
            !InputRecorder.isPlayRecord() && !InputRecorder.isPausePlayRecord()) {

            var eventSource = {};
            eventSource.type = 'wheel';
            eventSource.wheelX = event.wheelX;
            eventSource.wheelY = event.wheelY;
            eventSource.deltaX = event.deltaX;
            eventSource.deltaY = event.deltaY;
            eventSource.bubbles = event.bubbles;
            eventSource.cancelable = event.cancelable;

            $input_record.addRecord({
                label: 'MouseEvent wheel',
                frame: $multi_timer.now(),
                event: eventSource
            });

        }

    };

    TouchInputRecorder._onTouchStart = function(event) {

        if (InputRecorder.isRecord() && !InputRecorder.isPauseRecord() &&
            !InputRecorder.isPlayRecord() && !InputRecorder.isPausePlayRecord()) {

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

            $input_record.addRecord({
                label: 'TouchEvent tohchstart',
                frame: $multi_timer.now(),
                event: eventSource
            });

        }

    };

    TouchInputRecorder._onTouchMove = function(event) {

        if (InputRecorder.isRecord() && !InputRecorder.isPauseRecord() &&
            !InputRecorder.isPlayRecord() && !InputRecorder.isPausePlayRecord()) {

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

            $input_record.addRecord({
                label: 'TouchEvent tohchmove',
                frame: $multi_timer.now(),
                event: eventSource
            });

        }

    };

    TouchInputRecorder._onTouchEnd = function(event) {

        if (InputRecorder.isRecord() && !InputRecorder.isPauseRecord() &&
            !InputRecorder.isPlayRecord() && !InputRecorder.isPausePlayRecord()) {

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

            $input_record.addRecord({
                label: 'TouchEvent tohchend',
                frame: $multi_timer.now(),
                event: virtualEvent
            });

        }

    };

    TouchInputRecorder._onTouchCancel = function(event) {

        if (InputRecorder.isRecord() && !InputRecorder.isPauseRecord() &&
            !InputRecorder.isPlayRecord() && !InputRecorder.isPausePlayRecord()) {

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

            $input_record.addRecord({
                label: 'TouchEvent tohchcancel',
                frame: $multi_timer.now(),
                event: eventSource
            });

        }

    };

    TouchInputRecorder._onPointerDown = function(event) {

        if (InputRecorder.isRecord() && !InputRecorder.isPauseRecord() &&
            !InputRecorder.isPlayRecord() && !InputRecorder.isPausePlayRecord()) {

            if (event.pointerType === 'touch' && !event.isPrimary) {
                var virtualEvent = new Event(event.type);
                var eventSource = {};
                eventSource.type = event.type;
                eventSource.pageX = event.pageX;
                eventSource.pageY = event.pageY;
                eventSource.bubbles = event.bubbles;
                evnetSource.cancelable = event.cancelable;

                $input_record.addRecord({
                    label: 'VirtualEvent '+event.type,
                    frame: $multi_timer.now(),
                    event: eventSource
                });
            }

        }

    };

//-----------------------------------------------------------------------------
// SceneManager
//
// OverRide from rpg_scenes.js SceneManager class.

    SceneManager.initInput = function() {
        Input.initialize();
        TouchInput.initialize();

        InputRecorder.initialize();
        TouchInputRecorder.initialize();
    };

//-----------------------------------------------------------------------------
// Scene_Base
//
// OverRide from rpg_sprites.js Scene_Base class.

    Scene_Base.prototype.update = function() {
        this.updateFade();
        this.updateChildren();
        AudioManager.checkErrors();

        if ($multi_timer && $multi_timer.isWorking) {
            $multi_timer.update();
        }
    };

//-----------------------------------------------------------------------------
// StorageManager
//
// OverRide from rpg_managers.js StorageManager class.

    StorageManager.localFilePath = function(savefileId) {
        var name;
        if (savefileId < 0 && savefileId === -1) {
            name = 'config.rpgsave';
        } else if (savefileId < 0 && savefileId === -2) {
            name = 'inputrecord.rpgsave';
        } else if (savefileId === 0) {
            name = 'global.rpgsave';
        } else {
            name = 'file%1.rpgsave'.format(savefileId);
        }
        return this.localFileDirectoryPath() + name;
    };

    StorageManager.webStorageKey = function(savefileId) {
        if (savefileId < 0 && savefileId === -1) {
            return 'RPG Config';
        } else if (savefileId < 0 && savefileId === -2) {
            return 'RPG Input Record';
        } else if (savefileId === 0) {
            return 'RPG Global';
        } else {
            return 'RPG File%1'.format(savefileId);
        }
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
        this.bitmap = new Bitmap(150, 32);
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
        return InputRecorder.status();
    };

    Sprite_InputRecorderStatus.prototype.updatePosition = function() {
        this.x = Graphics.width - this.bitmap.width;
        this.y = 32;
    };

    Sprite_InputRecorderStatus.prototype.updateVisibility = function() {
        this.visible = InputRecorder.isControlVisible();
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

            if (InputRecorder.isRecord()) {
                InputRecorder.stopAndSaveRecord();
            } else {
                InputRecorder.startRecord();
            }

        }
    };

    Sprite_InputRecorderRecordControlButton.prototype.recordControlText = function() {
        return InputRecorder.recordControlText();
    };

    Sprite_InputRecorderRecordControlButton.prototype.updatePosition = function() {
        this.x = Graphics.width - this.bitmap.width;
        this.y = 64;
    };

    Sprite_InputRecorderRecordControlButton.prototype.updateVisibility = function() {
        if (InputRecorder.isControlVisible() && !!this.recordControlText()) {
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

            if (InputRecorder.isPlayRecord()) {
                InputRecorder.abortPlayRecord();
            } else {
                InputRecorder.startPlayRecord();
            }

        }
    };

    Sprite_InputRecorderPlayRecordControlButton.prototype.playRecordControlText = function() {
        return InputRecorder.playRecordControlText();
    };

    Sprite_InputRecorderPlayRecordControlButton.prototype.updatePosition = function() {
        this.x = Graphics.width - this.bitmap.width;
        this.y = 96;
    };

    Sprite_InputRecorderPlayRecordControlButton.prototype.updateVisibility = function() {
        if (InputRecorder.isControlVisible() && !!this.playRecordControlText()) {
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

            if (InputRecorder.isRecord() && !InputRecorder.isPauseRecord()) {
                InputRecorder.pauseRecord();
            } else if (InputRecorder.isRecord() && InputRecorder.isPauseRecord()) {
                InputRecorder.resumeRecord();
            } else if (InputRecorder.isPlayRecord() && !InputRecorder.isPausePlayRecord()) {
                InputRecorder.pausePlayRecord();
            } else if (InputRecorder.isPlayRecord() && InputRecorder.isPausePlayRecord()) {
                InputRecorder.resumePlayRecord();
            }

        }
    };

    Sprite_InputRecorderPauseControlButton.prototype.pauseControlText = function() {
        return InputRecorder.pauseControlText();
    };

    Sprite_InputRecorderPauseControlButton.prototype.updatePosition = function() {
        this.x = Graphics.width - this.bitmap.width;
        this.y = 128;
    };

    Sprite_InputRecorderPauseControlButton.prototype.updateVisibility = function() {
        if (InputRecorder.isControlVisible() && !!this.pauseControlText()) {
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

            if (InputRecorder.isRecord()) {
                InputRecorder.abortRecord();
            } else if (InputRecorder.isPlayRecord()) {
                InputRecorder.abortPlayRecord();
            }

        }
    };

    Sprite_InputRecorderAbortControlButton.prototype.abortControlText = function() {
        return InputRecorder.abortControlText();
    };

    Sprite_InputRecorderAbortControlButton.prototype.updatePosition = function() {
        this.x = Graphics.width - this.bitmap.width;
        this.y = 160;
    };

    Sprite_InputRecorderAbortControlButton.prototype.updateVisibility = function() {
        if (InputRecorder.isControlVisible() && !!this.abortControlText()) {
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

            if (InputRecorder.hasRecord() && !InputRecorder.isRecord() && !InputRecorder.isPlayRecord()) {
                InputRecorder.deleteRecord();
            }

        }
    };

    Sprite_InputRecorderDeleteRecordControlButton.prototype.deleteRecordControlText = function() {
        return InputRecorder.deleteRecordControlText();
    };

    Sprite_InputRecorderDeleteRecordControlButton.prototype.updatePosition = function() {
        this.x = Graphics.width - this.bitmap.width;
        this.y = 128;
    };

    Sprite_InputRecorderDeleteRecordControlButton.prototype.updateVisibility = function() {
        if (InputRecorder.isControlVisible() && !!this.deleteRecordControlText()) {
            this.visible = true;
        } else {
            this.visible = false;
        }
    };

//-----------------------------------------------------------------------------
// Spriteset_Base
//
// OverRide from rpg_sprites.js Spriteset_Base class.

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

    Spriteset_Base.prototype.createInputRecorderAbortControlButton = function() {
        this._inputRecorderSpriteAbortControlButton = new Sprite_InputRecorderAbortControlButton();
        this.addChild(this._inputRecorderSpriteAbortControlButton);
    };

    Spriteset_Base.prototype.createInputRecorderDeleteRecordControlButton = function() {
        this._inputRecorderSpriteDeleteRecordControlButton = new Sprite_InputRecorderDeleteRecordControlButton();
        this.addChild(this._inputRecorderSpriteDeleteRecordControlButton);
    };

    Spriteset_Base.prototype.createUpperLayer = function() {
        this.createPictures();
        this.createTimer();
        this.createScreenSprites();

        this.createInputRecorderStatus();
        this.createInputRecorderRecordControlButton();
        this.createInputRecorderPlayRecordControlButton();
        this.createInputRecorderPauseControlButton();
        this.createInputRecorderAbortControlButton();
        this.createInputRecorderDeleteRecordControlButton();
    };


})();
