//=============================================================================
// Majinai.js
//=============================================================================

/*:
 * @plugindesc Description
 *
 * @author saronpasu
 *
 * @version 0.0.1
 *
 * @help
 *
 * @param PluginParam
 * @desc Description
 * @default
 *
 * Plugin Command:
 *   Command argment      # description
 *
 * Help message write here.
 *
 */

/*:ja
 * @plugindesc 説明とか。
 *
 * @author saronpasu
 *
 * @help
 *
 * @param PluginParam
 * @desc 説明とか
 * @default
 *
 * Plugin Command:
 *   Command argments      # 説明とか
 *
 * ヘルプメッセージを書くとこ。
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
Imported.Majinai = {};

(function() {

    'use strict';

    // 免疫
    var AntiCurse;
    var $dataAntiCurses;

    // 呪い
    var Curse;
    var $dataCurses;

    // 症状
    var Progress;
    var $dataProgress;

    // トリガー
    var Trigger;
    var $dataTriggers;

    // 単語
    var Terms;

    // 呪いと症状の管理機能
    var CurseProgressManager;

    var parameters = PluginManager.parameters('Majinai');
    var Language = String(parameters['Language'] || 'ja');

    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'Majinai') {
        }
    };

    /*
        Curce Data Block
            Note: Infection(感染), Incubation(潜伏), Progress(症状の進行), Expire(発症)
            訳語が適当かもだけど気にするな！
    */

    AntiCurse = function() {
        this.initialize.apply(this, arguments);
    };

    AntiCurse.prototype.initialize = function() {
        this.setup();
    };

    AntiCurse.prototype.setup = function(antiCurseId) {
        this.id = antiCurseId;
        this.data = $dataAnticurses[this.id];

        this.name = this.data.name;
        this.description = this.data.description;
        this.curseId = this.data.curseId;
        this.rate = this.data.rate;
        this.visibility = this.data.visibility;
    };

    AntiCurse.prototype.isVisible = function() {
        return this.visibility;
    };

    AntiCurse.prototype.getName = function() {
        if(this.isNameVisible) {
            return this.nane;
        }else {
            return Terms[Language]['words']['unkonw'];
        }
    };

    AntiCurse.prototype.getDescription = function() {
        if(this.isNameVisible) {
            return this.description;
        }else {
            return Terms[Language]['words']['unkonw'];
        }
    };

    AntiCurse.prototype.antiCurseRate = function() {
        if(this.isNameVisible) {
            return this.rate;
        }else {
            return false;
        }
    };

    AntiCurse.prototype.curseId = function() {
        return this.curseId;
    };

    Curse = function() {
        this.initialize.apply(this, arguments);
    };

    Curse.prototype.initialize = function() {
        this.setup();
    };

    Curse.prototype.setup = function(curseId) {
        this.id = curseId;
        this.data = $dataCurses[this.id];

        this.name = $data.name;
        this.description = $data.description;
        this.visibility = $data.visibility;
        this.infectionTriggers = $data.infectiontriggers().map(function(elem) {
            var trigger = new Trigger();
            trigger.setup(elem);
            return trigger;
        });
        this.incubation = $data.incubation;
        this.natureAntiCurseRate = $data.natureAntiCurseRate;
        this.progressId = this.data.progressId;
        this.progress = new Progress();
        this.progress.setup($data.progressId);
    };

    Curse.prototype.triggers = function() {
        return this.infectionTriggers;
    };

    Curse.prototype.progress = function() {
        return this.progress;
    };

    Curse.prototype.isNameVisible = function() {
        return !this.visibility.nameHidden;
    };

    Curse.prototype.isInfectionVisible = function() {
        return !this.visibility.infectionHidden;
    };

    Curse.prototype.isProgressVisible = function() {
        return !this.visibility.beforeExpireHidden;
    };

    Curse.prototype.hasHpDamageTrigger = function() {
        var triggers = this.triggers().filter(function(elem) {
            return elem.isHpDamage();
        });
        return (triggers().length != 0);
    };

    Curse.prototype.hasMpDamageTrigger = function() {
        var triggers = this.triggers().filter(function(elem) {
            return elem.isMpDamage();
        });
        return (triggers().length != 0);
    };

    Curse.prototype.hasTpDamageTrigger = function() {
        var triggers = this.triggers().filter(function(elem) {
            return elem.isTpDamage();
        });
        return (triggers().length != 0);
    };

    Curse.prototype.getName = function() {
        if(this.isNameVisible) {
            return this.nane;
        }else {
            return Terms[Language]['words']['unkonw'];
        }
    };

    Curse.prototype.getDescription = function() {
        if(this.isNameVisible) {
            return this.description;
        }else {
            return Terms[Language]['words']['unkonw'];
        }
    };

    Curse.prototype.getProgress = function() {
        if(this.isProgressVisible) {
            return this.progress;
        }else {
            return false;
        }
    };

    Progress = function() {
        this.initialize.apply(this, arguments);
    };

    Progress.prototype.initialize = function() {
        this.setup();
    };

    Progress.prototype.setup = function(progressId) {
        this.id = progressId;
        this.data = $dataProgress[this.id];

        this.name = $data.name;
        this.description = $data.description;
        this.count = 0;
        this.limit = this.data.limit;
        this.level = 0;
        this.maxLevel = this.data.maxLevel;
        this.progressTriggers = $data.progresstriggers().map(function(elem) {
            var trigger = new Trigger();
            trigger.setup(elem);
            return trigger;
        });
        this.rate = this.data.rate;
        this.curseId = this.data.curseId;
        this.curse = new Curse();
        this.curse.setup(this.data.curseId);
        this.effects = this.data.effects.map(function(elem) {
            if (elem.effect) {
                return {
                    'effect':   $dataStatus[elem.effect],
                    'expireLevel':  elem.expireLevel
                };
            } else {
                elem
            }
        });
    };

    Progress.prototype.isVisible = function() {
        return (this.curse.isProgressVisible || this.isExpire)
    };

    Progress.prototype.getName = function() {
        if(this.isVisible) {
            return this.name;
        }else {
            return false;
        }
    };

    Progress.prototype.getDescription = function() {
        if(this.isVisible) {
            return this.description;
        }else {
            return false;
        }
    };

    Progress.prototype.isExpire = function() {
        return (this.curse.incubationLevel < this.level)
    };

    Progress.prototype.getCount = function() {
        return this.count;
    };

    Progress.prototype.getLimit = function() {
        return this.limit;
    };

    Progress.prototype.getLevel = function() {
        return this.level
    };

    Progress.prototype.getLevelText = function() {
        switch (this.level) {
            case 0:
                return Terms[Language]['words']['progressLevel0'];
                break;
            case 1:
                return Terms[Language]['words']['progressLevel1'];
                break;
            case 2:
                return Terms[Language]['words']['progressLevel2'];
                break;
            case 3:
                return Terms[Language]['words']['progressLevel3'];
                break;
            case 4:
                return Terms[Language]['words']['progressLevel4'];
                break;
            default:

        }
    };

    Progress.prototype.getMaxLevel = function() {
        return this.maxLevel;
    };

    Progress.prototype.isLevelUp = function() {
        return (this.count >= this.limit);
    };

    Progress.prototype.resetCount = function() {
        this.count = 0;
    };

    Progress.prototype.levelUp = function() {
        if(this.level == this.maxLevel) {
            this.resetCount;
            return;
        }else {
            this.resetCount;
            this.level += 1;
        }
    };

    Progress.prototype.getAllEffects = function() {
        return this.effects;
    };

    Progress.prototype.getActiveEffects = function() {
        var activeEffects;
        activeEffects = this.effects.filter(function(elem) {
            return (elem.expireLevel >= this.level)
        });
        return activeEffects;
    };

    Progress.prototype.triggers = function() {
        return this.progressTriggers;
    };

    Progress.prototype.getTrigger = function() {
        return this.trigger();
    };

    Progress.prototype.hasHpDamageTrigger = function() {
        var triggers = this.triggers().filter(function(elem) {
            return elem.isHpDamage();
        });
        return (triggers().length != 0);
    };

    Progress.prototype.hasMpDamageTrigger = function() {
        var triggers = this.triggers().filter(function(elem) {
            return elem.isMpDamage();
        });
        return (triggers().length != 0);
    };

    Progress.prototype.hasTpDamageTrigger = function() {
        var triggers = this.triggers().filter(function(elem) {
            return elem.isTpDamage();
        });
        return (triggers().length != 0);
    };

    Progress.prototype.hasHpCostTrigger = function() {
        var triggers = this.triggers().filter(function(elem) {
            return elem.isHpCost();
        });
        return (triggers().length != 0);
    };

    Progress.prototype.hasMpCostTrigger = function() {
        var triggers = this.triggers().filter(function(elem) {
            return elem.isMpCost();
        });
        return (triggers().length != 0);
    };

    Progress.prototype.hasTpCostTrigger = function() {
        var triggers = this.triggers().filter(function(elem) {
            return elem.isTpCost();
        });
        return (triggers().length != 0);
    };

    Progress.prototype.countUp = function(value) {
        this.count += value;
    }

    Progress.prototype.autoEffect = function(target) {
        // activeEffects を for でぶん回す
        // ステートを付与する
        var effects = this.getActiveEffects();
        if (effects.length == 0) {
            return;
        }
        for(i=0;i<effects.length;i++) {
            target.addState(effects[i].effect);
        }
    };

    Trigger = function() {
        this.initialize.apply(this, arguments);
    }

    Trigger.prototype.initialize() = {
        this.setup();
    };

    Trigger.prototype.setup = function(triggerId) {
        this.id = triggerId;
        this.data = $dataTriggers[this.id];

        this.type = $data.type;
        this.limit = $data.limit;
    };

    Trigger.prototype.isHpDamage = function() {
        return (this.type == 'HP_damage');
    };

    Trigger.prototype.isMpDamage = function() {
        return (this.type == 'MP_damage');
    };

    Trigger.prototype.isTpDamage = function() {
        return (this.type == 'TP_damage');
    };

    Trigger.prototype.isHpCost = function() {
        return (this.type == 'HP_cost');
    };

    Trigger.prototype.isMpCost = function() {
        return (this.type == 'MP_cost');
    };

    Trigger.prototype.isTpCost = function() {
        return (this.type == 'TP_cost');
    };

    Terms = {
        'ja': {
            'words': {
                'AntiCurse' :   '免疫',
                'Curse' :   '呪い',
                'Unknown'   :   '不明',
                'Infection' :   '感染',
                'InfectionTrigger'  :   '感染トリガー',
                'Incubation'    :   '潜伏期間',
                'Progress'  :   '進行',
                'ProgressTrigger'   :   '症状進行トリガー',
                'ProgressLevel' :   '症状進行レベル',
                'ProgressLevel0'    :   '未発症',
                'ProgressLevel1'    :   '軽度',
                'ProgressLevel2'    :   '中度',
                'ProgressLevel3'    :   '重度',
                'ProgressLevel4'    :   '末期',
                'Effects'   :   '効果',
                'Expire'    :   '発症'
            },
            'messages': {
                'infection' :   '%1は%2に%3した。',
                'progressLevelUp'   :   '%1の%2[%3]は%2[%4]に%5した。',
                'curseExpire'   :   '%1は$2を%3した。',
                'cureCurse' :   '%1の%2[%3]は回復した。',
                'makeAntiCurse' :   '%1は%2への%3を得た。',
                'infomation'    :   '%1は%2[%3]に%4している。',
            }
        },
        'en': {
            'words': {
                'AntiCurse' :   '',
                'Curse' :   '',
                'Unknown'   :   '',
                'Infection' :   '',
                'InfectionTrigger'  :   '',
                'Incubation'    :   '',
                'Progress'  :   '',
                'ProgressTrigger'   :   '',
                'ProgressLevel' :   '',
                'Effects'   :   '',
                'Expire'    :   ''
            },
            'messages': {

            }
        }
    };

    /*
        RPGMV customize Block
    */

    var _Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers
    Game_BattlerBase.prototype.initMembers = function() {
        _Game_BattlerBase_initMembers();
        this.crearCurse();
        this.crearAntiCurse();
    };

    Game_BattlerBase.prototype.crearCurse = function() {
        // 呪いの初期化
        this._curses = [];
        this._progresses = [];
    };

    Game_BattlerBase.prototype.crearAntiCurse = function() {
        // 免疫の初期化
        this._antiCurses = [];
    };

    Game_BattlerBase.prototype.curses = function() {
        // すべての呪いを取得する
        return this._curses.map(function(id) {
            return $dataCurses[id];
        });
    };

    Game_BattlerBase.prototype.antiCurses = function() {
        // すべての免疫を取得する
        return this._antiCurses.map(function(id) {
            return $dataAntiCurses[id];
        });
    };

    Game_BattlerBase.prototype.progresses = function() {
        // すべての症状を取得する
        return this._progresses.map(function(id) {
            return $dataProgress[id];
        });
    };

    Game_BattlerBase.prototype.hasCurses = function() {
        // 感染しているかどうか
        return this._curses.length != 0;
    };

    Game_BattlerBase.prototype.addNewProgress = function(progressId) {
        var progress = new Progress();
        progress.setup(progressId);
        this._progresses.push(progress);
    };

    Game_BattlerBase.prototype.addNewCurse = function(curseId) {
        // 呪いと症状を付与する
        if (this.hasCurse(curseId)) {
            return;
        }
        this._curses.push(curseId);
        var curse = new Curse();
        curse.setup(curseId);
        this._curses.push(curse);
        this.addNewProgress(curse.progressId);
    };

    Game_BattlerBase.prototype.addCurse = function(curseId) {
        // 症状を付与する(強制)
        this.addNewCurse(curseId);
        this._result.pushAddedCurse(curseId);
    };

    Game_BattlerBase.prototype.receiveInfection = function(curseId, triggerId) {
        // 感染を受ける判定 感染率(能動) -> 免疫(受動) -> 成否 の流れ
        // 既に感染しているか
        if(this.hasCurse(curseId)) {
            return;
        }
        // 感染成功テスト
        var curse = $dataCurses[curseId];
        var trigger = $dataTriggers[triggerId];
        var curseRate = trigger.rate;
        if(trigger.rate <= 0) {
            return;
        }else if (trigger.rate > 100) {
            curseRate = 100;
        }
        var infectionResult = (Math.randomInt(100) >= curseRate);
        if(!infectionResult) {
            return;
        }
        // 免疫を得ているか
        if(this.hasAntiCurse(curseId)) {
            antiCurse = this.findAntiCurse(curseId);
            if (antiCurse) {
                // 免疫による防護成功テスト
                var antiCurseRate = antiCurse.rate;
                if(antiCurseRate <= 0) {
                    return;
                }else if (antiCurseRate > 100) {
                    antiCurseRate = 100;
                }
                infectionResult = (Math.randomInt(100) >= antiCurseRate);
            }
        }
        if (infectionResult) {
            return;
        }
        // 感染成功時の処理
        this.addCurse(curseId);
    };

    Game_BattlerBase.prototype.removeCurse = function(curseId) {
        // 症状を除去する(強制)
        var index = this._curses.indexOf(curseId);
        if (index >= 0) {
            this._curses.splice(index, 1);
        }
    };

    Game_BattlerBase.prototype.removeAllCurse = function() {
        // 症状をすべて除去する(強制)
        this._curses = [];
    };

    Game_BattlerBase.prototype.cureCurse = function(action, curseId) {
        // 症状を治療する判定 治療成功率(能動) -> 成否 の流れ
        // 感染しているか
        if(this.hasCurse(curseId)) {
            return;
        }
        // 対応した治療方法か
        var source = action.item.note;
        var targetCursePattern = new RegExp('cureCurseId:(\d+)', 'g');
        var cureCurseRatePattern = new RegExp('cureCurseRate:(\d+)', 'g');
        var targetCurseId;
        if (targetCursePattern.test(source)) {
            targetCurseId = Number(targetCursePattern.exec(source)[1]);
        }
        var cureCurseRate;
        if (cureCurseRatePattern.test(source)) {
            cureCurseRate = Number(cureCurseRatePattern.exec(source)[1]);
        }
        if(curseId != targetCurseId) {
            return;
        }
        if(curseCureRate <= 0) {
            return;
        }else if (curseCureRate > 100) {
            curseCureRate = 100;
        }
        // 治療判定
        var cureResult = (Math.randomInt(100) >= curseCureRate);
        if(!cureResult) {
            return;
        }
        // 回復処理
        this.removeCurse(curseId);
        this.makeAntiCurse(curseId);
    };

    Game_BattlerBase.prototype.addNewAntiCurse = funtion(antiCurseId) {
        var antiCurse = new AntiCurse();
        antiCurse.setup(antiCurseId);
        this._antiCurses.push(antiCurse);
    };

    Game_BattlerBase.prototype.addAntiCurse = function(antiCurseId) {
        // 免疫を得る(強制)
        this.addNewAntiCurse(antiCurseId);
        this._result.pushMakedAntiCurse(antiCurseId);
    };

    Game_BattlerBase.prototype.makeAntiCurse = function(curseId) {
        // 免疫を得る判定 免疫獲得率 -> 成否 の流れ
        var curse = new Curse();
        curse.setup(curseId);
        var natureAntiCurseRate = curse.natureAntiCurseRate;
        if(natureAntiCurseRate <= 0) {
            return;
        }else if (natureAntiCurseRate > 100) {
            natureAntiCurseRate = 100;
        }
        var makeAntiCurseResult = (Math.randomInt(100) >= curse.natureAntiCurseRate);
        var antiCurse;
        if(makeAntiCurseResult) {
            antiCurse = $dataAntiCurses.find(function(elem) {
                return (elem.targetId == curseId);
            })
        }
        if(this.hasAntiCurse(antiCurse.id)) {
            return;
        }
        if(antiCurse) {
            this.addAntiCurse(antiCurse.id);
        }
    };

    Game_BattlerBase.prototype.progressLevelUp = function(curseId) {
        // 症状を進行させる(強制), expire フラグを result に付与する
        if(!this.hasCurse(curseId)) {
            return false;
        }
        var progress = this.progress.find(function(curse) {return curse.curseId == curseId});
        this.result.pushProgressLevelUp(curseId);
        var beforeExpire = progress.isExpire();
        progress.levelUp();
        var afterExpire = progress.isExpire();
        if (!beforeExpire && afterExpire) {
            this.result.pushExpireCurse(curseId);
        }
    };

    Game_BattlerBase.prototype.progressGrowUp = function(triggerId, curseId) {
        // 症状を進行させる
        // 感染しているかどうか
        if(!this.hasCurse(curseId)) {
            return;
        }
        // 対応するトリガーかどうか
        var curse = new Curse();
        curse.setup(curseId);
        var progressId = curse.progressId;
        var trigger = curse.triggers().find(function(elem) {
            return elem.id == triggerId;
        });
        if (!trigger) {
            return;
        }
        // トリガーの値を取得
        var rate = trigger.rate;
        // 症状のカウンタにトリガーの値を加算
        var progress = this.progresses.find(function(elem) {
            return elem.id = progressId;
        })
        progress.count += rate;
        // 症状のレベルアップ処理
        if(progress.count >= progress.limit) {
            this.progressLevelUp();
        }
    };

    Game_BattlerBase.prototype.hasInfection = function() {
        // 感染させるかどうか
        if(!this.hasCurses()) {
            return false;
        }
        return (this.curses().filter(function(curse) {
            return (curse.infectiontriggers().length != 0);
        }).length != 0);
    };

    Game_BattlerBase.prototype.hasCurse = function(curseId) {
        // 既に感染しているかどうか
        if(!this.hasCurses()) {
            return false;
        }
        return !!this.curses.find(function(curse) {return curse.id == curseId});
    };

    Game_BattlerBase.prototype.hasAntiCurse = function(curseId) {
        // 免疫を持っているかどうか
        if(this.antiCurses().length == 0) {
            return false;
        }
        if(this.antiCurses().find(function(antiCurse) {
            return (antiCurse.targetId == 'All');
        })) {
            return true;
        };
        return (this.antiCurses().filter(function(antiCurse) {
            return (antiCurse.targetId == curseId);
        }).length != 0)
    };

    Game_BattlerBase.prototype.hasHpDamageInfectionTrigger = function() {
        var toriggers = this.curse.toriggers();
        toriggers.filter(function(elem) {
            return elem.isHpDamage();
        });
        return (toriggers.lentgh != 0);
    };

    Game_BattlerBase.prototype.hasMpDamageInfectionTrigger = function() {
        var toriggers = this.curse.toriggers();
        toriggers.filter(function(elem) {
            return elem.isMpDamage();
        });
        return (toriggers.lentgh != 0);
    };

    Game_BattlerBase.prototype.hasTpDamageInfectionTrigger = function() {
        var toriggers = this.curse.toriggers();
        toriggers.filter(function(elem) {
            return elem.isTpDamage();
        });
        return (toriggers.lentgh != 0);
    };

    Game_BattlerBase.prototype.hasHpDamageProgressTrigger = function() {
        var toriggers = this.progreses.toriggers();
        toriggers.filter(function(elem) {
            return elem.isHpDamage();
        });
        return (toriggers.lentgh != 0);
    };

    Game_BattlerBase.prototype.hasMpDamageProgressTrigger = function() {
        var toriggers = this.progreses.toriggers();
        toriggers.filter(function(elem) {
            return elem.isMpDamage();
        });
        return (toriggers.lentgh != 0);
    };

    Game_BattlerBase.prototype.hasTpDamageProgressTrigger = function() {
        var toriggers = this.progreses.toriggers();
        toriggers.filter(function(elem) {
            return elem.isTpDamage();
        });
        return (toriggers.lentgh != 0);
    };

    Game_BattlerBase.prototype.hasHpCostProgressTrigger = function() {
        var toriggers = this.progreses.toriggers();
        toriggers.filter(function(elem) {
            return elem.isHpCost();
        });
        return (toriggers.lentgh != 0);
    };

    Game_BattlerBase.prototype.hasMpCostProgressTrigger = function() {
        var toriggers = this.progreses.toriggers();
        toriggers.filter(function(elem) {
            return elem.isMpCost();
        });
        return (toriggers.lentgh != 0);
    };

    Game_BattlerBase.prototype.hasTpCostProgressTrigger = function() {
        var toriggers = this.progreses.toriggers();
        toriggers.filter(function(elem) {
            return elem.isTpCost();
        });
        return (toriggers.lentgh != 0);
    };

    Game_BattlerBase.prototype.findAntiCurse = function(curseId) {
        var allAntiCurse = this.antiCurses().find(function(antiCurse) {
            return (antiCurse.targetId == 'All');
        });
        if (allAntiCurse) {
            return allAntiCurse;
        }
        var hitAntiCurse = this.antiCurses().find(function(antiCurse) {
            return (antiCurse.targetId == curseId);
        });
        if (hitAntiCurse) {
            return hitAntiCurse;
        }
        return false;
    };

    Game_BattlerBase.prototype.hasHpDamageTrigger = function() {
        // HPダメージトリガーがあるか
        if(this.hasInfection() != true) {
            return false;
        }
        return (triggers = this.curses().filter(
            function(curse) {
                return curse.infectiontriggers().filter(function(trigger) {
                    return (trigger.isHpDamage());
                });
            }
        ).length != 0);
    };

    Game_BattlerBase.prototype.hasTpDamageTrigger = function() {
        // TPダメージトリガーがあるか
        if(this.hasInfection() != true) {
            return false;
        }
        return (triggers = this.curses().filter(
            function(curse) {
                return curse.infectiontriggers().filter(function(trigger) {
                    return (trigger.isTpDamage());
                });
            }
        ).length != 0);
    };

    Game_BattlerBase.prototype.hasMpDamageTrigger = function() {
        // MPダメージトリガーがあるか
        if(this.hasInfection() != true) {
            return false;
        }
        return (triggers = this.curses().filter(
            function(curse) {
                return curse.infectiontriggers().filter(function(trigger) {
                    return (trigger.isMpDamage());
                });
            }
        ).length != 0);
    };

    Game_BattlerBase.prototype.hasHpCostTrigger = function() {
        // HPコストトリガーがあるか
        if(this.hasInfection() != true) {
            return false;
        }
        return (triggers = this.curses().filter(
            function(curse) {
                return curse.infectiontriggers().filter(function(trigger) {
                    return (trigger.isHpCost());
                });
            }
        ).length != 0);
    };

    Game_BattlerBase.prototype.hasMpCostTrigger = function() {
        // MPコストトリガーがあるか
        if(this.hasInfection() != true) {
            return false;
        }
        return (triggers = this.curses().filter(
            function(curse) {
                return curse.infectiontriggers().filter(function(trigger) {
                    return (trigger.isMpCost());
                });
            }
        ).length != 0);
    };

    Game_BattlerBase.prototype.hasTpCostTrigger = function() {
        // TPコストトリガーがあるか
        if(this.hasInfection() != true) {
            return false;
        }
        return (triggers = this.curses().filter(
            function(curse) {
                return curse.infectiontriggers().filter(function(trigger) {
                    return (trigger.isTpCost());
                });
            }
        ).length != 0);
    };

    var _Game_Enemy_setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _Game_Enemy_setup(enemyId, x, y);
        // メモ解析
        var source = this.note;
        // antiCurse
        var antiCurseId;
        var antiCursePattern = new RegExp('antiCurseId:(\d+)', 'g');
        if (antiCursePattern.test(source)) {
            antiCurseId = Number(antiCUrsePattern.exec(source)[1]);
            this.addNewAntiCurse(antiCurseId);
        }
        // curse
        var curseId;
        var cursePattern = new RegExp('curseId:(\d+)', 'g');
        if (cursePattern.test(source)) {
            curseId = Number(cursePattern.exec(source)[1]);
            this.addNewCurse(courseId);
        }
        // progressLevel
        var progressLevel;
        var progress;
        var progressLevelPattern = new RegExp('progressLevel:(\d+)', 'g');
        if (progressLevelPattern.test(source)) {
            progressLevel = progressLevelPattern.exec(source)[1];
            progress = this.progresses.find(function(elem) {
                return (elem.curseId == curseId);
            });
            if (progress) {
                progress.level = progressLevel;
            }
        }
    }

    Object.defineProperties(TextManager, {
        // Words
        antiCurse:              Terms[Language]['words']['AntiCurse'],
        curse:                  Terms[Language]['words']['Curse'],
        unkonw:                 Terms[Language]['words']['Unknown'],
        infection:              Terms[Language]['words']['Infection'],
        infectionTrigger:       Terms[Language]['words']['InfectionTrigger'],
        progress:               Terms[Language]['words']['Progress'],
        progressTrigger:        Terms[Language]['words']['ProgressTrigger'],
        progressLevel:          Terms[Language]['words']['ProgressLevel'],
        progressLevel0:         Terms[Language]['words']['ProgressLevel0'],
        progressLevel1:         Terms[Language]['words']['ProgressLevel1'],
        progressLevel2:         Terms[Language]['words']['ProgressLevel2'],
        progressLevel3:         Terms[Language]['words']['ProgressLevel3'],
        progressLevel4:         Terms[Language]['words']['ProgressLevel4'],
        effects:                Terms[Language]['words']['Effects'],
        expire:                 Terms[Language]['words']['Expire'],

        // Messages
        infectionMsg:           Terms[Language]['messages']['infection'],
        progressLevelUpMsg:     Terms[Language]['messages']['progressLevelUp'],
        curseExpireMsg:         Terms[Language]['messages']['curseExpire'],
        cureCurseMsg:           Terms[Language]['messages']['cureCurse'],
        makeAntiCurseMsg:       Terms[Language]['messages']['makeAntiCurse'],
        infomationMsg:          Terms[Language]['messages']['infomation'],
    }

    Window_BattleLog.prototype.makeInfectionText = function(target) {
        target.result().addedCurseObjects().forEach(function(curseObj) {
            var curse = new Curse();
            curse.setup(curseObj.id);
            if(!curse.isInfectionVisible()) {
                return false;
            }
            var curseName = curse.getName();
            var fmt;
            fmt = TextManager.infectionMsg;
            curseMsg = fmt.format(target.name(), curseName, TextManager.infection)
            this.push('popBaseLine');
            this.push('pushBaseLine');
            this.push('addText', curseMsg);
            this.push('waitForEffect');
        });
    };

    Window_BattleLog.prototype.makeProgressLevelUpText = function(target) {
        target.result().progressLevelUpObjects().forEach(function(progObj) {
            var progress = new Progress();
            progress.setup(progObj.id);
            var curse = new Curse();
            curse.setup(curseId);
            var progressVisible = curse.isProgressVisible();
            var expire = progress.isExpire();
            if (!expire && !progressVisible) {
                return false;
            }
            var curseName = curse.getName;
            var progressName = curse.progress.getName();
            var progressLevel = curse.progress.Level;
            var progressLevelWord;
            var beforeProgressLevelWord
            switch (progrellLevel) {
                case 1:
                    beforeProgressLevelWord = TextManager.progressLevel0;
                    progressLevelWord = TextManager.progressLevel1;
                    break;
                case 2:
                    beforeProgressLevelWord = TextManager.progressLevel1;
                    progressLevelWord = TextManager.progressLevel2;
                    break;
                case 3:
                    beforeProgressLevelWord = TextManager.progressLevel2;
                    progressLevelWord = TextManager.progressLevel3;
                    break;
                case 4:
                    beforeProgressLevelWord = TextManager.progressLevel3;
                    progressLevelWord = TextManager.progressLevel4;
                    break;
                default:

            }
            var fmt;
            fmt = TextManager.progressLevelUpMsg;
            progressLevelUpMsg = fmt.format(
                target.name(),
                TextManager.progressName,
                beforeProgressLevelWord,
                TextManager.ProgressName,
                progressLevelWord,
                TextManager.progress)
            this.push('popBaseLine');
            this.push('pushBaseLine');
            this.push('addText', progressLevelUpMsg);
            this.push('waitForEffect');
        });
    };

    Window_BattleLog.prototype.makeCurseExpireText = function(target) {
        target.result().expireCurseObjects().forEach(function(curseObj) {
            var curse = new Curse();
            curse.setup(curseObj.id);
            var curseName = curse.getName();
            var fmt;
            fmt = TextManager.curseExpireMsg;
            curseExpireMsg = fmt.format(target.name(), curseName, TextManager.infection, TextManager.expire)
            this.push('popBaseLine');
            this.push('pushBaseLine');
            this.push('addText', curseExpireMsg);
            this.push('waitForEffect');
        });
    };

    Window_BattleLog.prototype.makeCureCurseText = function(target) {
        target.result().removedCurseObjects().forEach(function(curseObj) {
            var curse = new Curse();
            curse.setup(curseObj.id);
            var curseName = curse.getName();
            var progressName = curse.progress.getName();
            var progressLevel = curse.progress.progressLevel;
            var progressLevelWord;
            switch (progrellLevel) {
                case 0:
                    progressLevelWord = TextManager.progressLevel0;
                    break;
                case 1:
                    progressLevelWord = TextManager.progressLevel1;
                    break;
                case 2:
                    progressLevelWord = TextManager.progressLevel2;
                    break;
                case 3:
                    progressLevelWord = TextManager.progressLevel3;
                    break;
                case 4:
                    progressLevelWord = TextManager.progressLevel4;
                    break;
                default:

            }
            var fmt;
            fmt = TextManager.cureCurseMsg;
            cureCurseMsg fmt.format(target.name(), progressName, progressLevelWord)
            this.push('popBaseLine');
            this.push('pushBaseLine');
            this.push('addText', cureCurseMsg);
            this.push('waitForEffect');
        });
    };

    Window_BattleLog.prototype.makeMakeAntiCurseText = function(target) {
        target.result().makedAntiCurseObjects().forEach(function(antiCurseObj) {
            var antiCurse = new AntiCurse();
            antiCurse.setup(antiCurseObj.id);
            if(!antiCurse.isVisible()) {
                return false;
            }
            var curseName = curse.getName();
            var fmt;
            fmt = TextManager.makeAntiCurseMsg;
            makeAntiCurseMsg fmt.format(target.name(), curseName, TextManager.antiCurse)
            this.push('popBaseLine');
            this.push('pushBaseLine');
            this.push('addText', makeAntiCurseMsg);
            this.push('waitForEffect');
        });
    };

    Window_BattleLog.prototype.displayChangedCurses = function(target) {
        this.displayAddedCurses(target);
        this.displayRemovedCurses(target);
        this.displayMakedAntiCurses(target);
        this.displayProgressLevelUp(target);
        this.displayCurseExpire(target);
    };

    Window_BattleLog.prototype.displayAddedCurses = function(target) {
        if(target.result.curseVisibility) {
            this.push('addText', this.makeInfectionText(target));
        }
    };

    Window_BattleLog.prototype.displayRemovedCurses = function(target) {
        target.result().removedCurseObjects().forEach(function(curse) {
            if(target.resutl.curseVisibility) {
                this.push('addText', this.makeCureCurseText(target));
            }
        }, this);
    };

    Window_BattleLog.prototype.displayMakedAntiCurses = function(target) {
        target.result().makedAntiCurseObjects().forEach(function(antiCurse) {
            if(target.result.antiCurseVisibility) {
                this.push('addText', this.makeAntiCurseText(target));
            }
        }, this);
    };

    Window_BattleLog.prototype.displayProgressLevelUp = function(target) {
        target.result().progressLevelUpObjects().forEach(function(progress) {
            if(target.result.progressVisibility) {
                this.push('addText', this.makeProgressLevelUpText(target));
            }
        }
    };

    Window_BattleLog.prototype.displayCurseExpire = function(target) {
        if(target.result.expireVisibility) {
            this.push('addText', this.makeCurseExpireText(target));
        }
    };

    Window_BattleLog.prototype.displayAffectedCurses = function(target) {
        if (target.result().isCursesAffected()) {
            this.push('pushBaseLine');
            this.displayChangedCurses(target);
            this.push('waitForNewLine');
            this.push('popBaseLine');
        }
    };

    Window_BattleLog.prototype.displayAutoAffectedCurses = function(target) {
        if (target.result().isCursesAffected()) {
            this.displayAffectedCurses(target, null);
            this.push('clear');
        }
    };

    var _Window_BattleLog_displayActionResults = Window_BattleLog.prototype.displayActionResults;
    Window_BattleLog.prototype.displayActionResults = function(subject, target) {
        _Window_BattleLog_displayActionResults(subject, target) {
            if (target.result().used) {
                this.push('pushBaseLine');
                this.displayCritical(target);
                this.push('popupDamage', target);
                this.push('popupDamage', subject);
                this.displayDamage(target);
                this.displayAffectedCurses(target);
                this.displayAffectedStatus(target);
                this.displayFailure(target);
                this.push('waitForNewLine');
                this.push('popBaseLine');
            }
        }
    };

    var _BattleManager_processTurn = BattleManager.processTurn;
    BattleManager.processTurn = function() {
        _BattleManager_processTurn() {
            var subject = this._subject;
            var action = subject.currentAction();
            if (action) {
                action.prepare();
                if (action.isValid()) {
                    this.startAction();
                }
                subject.removeCurrentAction();
            } else {
                subject.onAllActionsEnd();
                this.refreshStatus();
                this._logWindow.displayAutoAffectedCurses(subject);
                this._logWindow.displayAutoAffectedStatus(subject);
                this._logWindow.displayCurrentState(subject);
                this._logWindow.displayRegeneration(subject);
                this._subject = this.getNextSubject();
            }
        }
    };

    var _BattleManager_endTurn = BattleManager.endTurn;
    BattleManager.endTurn = function() {
        _BattleManager_endTurn() {
            this._phase = 'turnEnd';
            this._preemptive = false;
            this._surprise = false;
            this.allBattleMembers().forEach(function(battler) {
                battler.onTurnEnd();
                this.refreshStatus();
                this._logWindow.displayAutoAffectedCurses(battler);
                this._logWindow.displayAutoAffectedStatus(battler);
                this._logWindow.displayRegeneration(battler);
            }, this);
        }
    };

    var _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
    Game_ActionResult.prototype.clear = function() {
        _Game_ActionResult_clear();
        this.addedCurses = [];
        this.makedAntiCurses = [];
        this.removedCurses = [];
        this.progressLevelUp = [];
        this.expireCurse = [];
    };

    Game_ActionResult.prototype.addedCurseObjects = function() {
        return this.addedCurses.map(function(id) {
            return $dataCurses[id];
        });
    };

    Game_ActionResult.prototype.makedAntiCurseObjects = function() {
        return this.makedAntiCurses.map(function(id) {
            return $dataAntiCurses[id];
        });
    };

    Game_ActionResult.prototype.removedCurseObjects = function() {
        return this.removedCurses.map(function(id) {
            return $dataCurses[id];
        });
    };

    Game_ActionResult.prototype.progressLevelUpObjects = function() {
        return this.progressLevelUp.map(function(id) {
            return $dataProgress[id];
        });
    };

    Game_ActionResult.prototype.expireCurseObjects = function() {
        return this.expireCurse.map(function(id) {
            return $dataProgress[id];
        });
    };

    Game_ActionResult.prototype.isCursesAffected = function() {
        return (this.addedCurses.length > 0 || this.removedCurses.length > 0 ||
                this.addedBuffs.length > 0 || this.addedDebuffs.length > 0 ||
                this.removedBuffs.length > 0);
    };

    Game_ActionResult.prototype.isCurseAdded = function(curseId) {
        return this.addedCurses.contains(curseId);
    };

    Game_ActionResult.prototype.pushAddedCurse = function(curseId) {
        curse = $dataCurses[curseId];
        curse.setup(curseId);
        if (!this.isCurseAdded(curseId)) {
            this.addedCurses.push(curseId);
        }
    };

    Game_ActionResult.prototype.pushMakedAntiCurse = function(antiCurseId) {
        antiCurse = $dataAntiCurses[antiCurseId];
        antiCurse.setup(antiCurseId);
        if (!this.isCurseMake(antiCurseId)) {
            this.makedAntiCurses.push(antiCurseId);
        }
    };

    Game_ActionResult.prototype.isCurseRemoved = function(curseId) {
        return this.removedCurses.contains(curseId);
    };

    Game_ActionResult.prototype.pushRemovedCurse = function(curseId) {
        curse = $dataCurses[curseId];
        curse.setupu(curseId);
        if (!this.isCurseRemoved(curseId)) {
            this.removedCurses.push(curseId);
        }
    };

    Game_ActionResult.prototype.isProgressLevelUp = function(curseId) {
        return this.progressLevelUp.contains(curseId);
    };

    Game_ActionResult.prototype.pushProgressLevelUp = function(curseId) {
        if (!this.isProgressLevelUp(curseId)) {
            this.progressLevelUp.push(curseId);
        }
    };

    Game_ActionResult.prototype.isExpireCurse = function(curseId) {
        return this.expireCurse.contains(curseId);
    };

    Game_ActionResult.prototype.pushExpireCurse = function(curseId) {
        if (!this.isExpireCurse(curseId)) {
            this.expireCurse.push(curseId);
        }
    };

    Game_ActionResult.prototype.isCurseVisibility = function(curseId) {
        return this.curseVisibility.contains(curseId);
    };

    Game_ActionResult.prototype.pushCurseVisibility = function(curseId) {
        if (!this.isCurseVisibility(curseId)) {
            this.curseVisibility.push(curseId);
        }
    };

    Game_Action.prototype.isInfection = function() {
        return this.subject.hasInfection();
    };

    Game_Action.prototype.isHpDamageInfectionTrigger = function() {
        return this.subject.hasHpDamageTrigger();
    };

    Game_Action.prototype.isMpDamageInfectionTrigger = function() {
        return this.subject.hasMpDamageTrigger();
    };

    Game_Action.prototype.isTpDamageInfectionTrigger = function() {
        return this.subject.hasTpDamageTrigger();
    };

    var _Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
    Game_Action.prototype.executeHpDamage = function(target, value) {
        _Game_Action_executeHpDamage(target, value);

        if(target.hasCurses() && target.hasHpDamageProgressTrigger()) {
            var curses;
            curses = target.curses.filter(function(elem) {
                return elem.hasHpDamageTrigger();
            });
            var triggerId;
            var curseId;
            for(i=0;i<curses.length;i++) {
                curseId = curses[i].id;
                triggerId = curses[i].triggers().find(function(elem) {
                    return elem.isHpDamage();
                }).id;
                if(curseId && triggerId) {
                    target.progressGrowUp(triggerId, curseId);
                }
            }
        }

        if(this.isInfection() && this.isHpDamageInfectionTrigger()) {
            var curses;
            curses = this.subject.curses.filter(function(elem) {
                return elem.hasHpDamageTrigger();
            });
            var curseId;
            var triggerId;
            for(i=0;i<curses.length;i++) {
                curseId = curses[i].id;
                triggerId = curses[i].triggers().find(function(elem) {
                    return elem.isHpDamage();
                }).id;
                if(curseId && triggerId) {
                    target.receiveInfection(curseId, triggerId);
                }
            }
        }
    };

    var _Game_Action_executeMpDamage = Game_Action.prototype.executeMpDamage;
    Game_Action.prototype.executeMpDamage = function(target, value) {
        _Game_Action_executeMpDamage(target, value);

        if(target.hasCurses() && target.hasMpDamageProgressTrigger()) {
            var curses;
            curses = target.curses.filter(function(elem) {
                return elem.hasMpDamageTrigger();
            });
            var triggerId;
            var curseId;
            for(i=0;i<curses.length;i++) {
                curseId = curses[i].id;
                triggerId = curses[i].triggers().find(function(elem) {
                    return elem.isMpDamage();
                }).id;
                if(curseId && triggerId) {
                    target.progressGrowUp(triggerId, curseId);
                }
            }
        }

        if(this.isInfection() && this.isMpDamageInfectionTrigger()) {
            var curses;
            curses = this.subject.curses.filter(function(elem) {
                return elem.hasMpDamageTrigger();
            });
            var curseId;
            var triggerId;
            for(i=0;i<curses.length;i++) {
                curseId = curses[i].id;
                triggerId = curses[i].triggers().find(function(elem) {
                    return elem.isMpDamage();
                }).id;
                if(curseId && triggerId) {
                    target.receiveInfection(curseId, triggerId);
                }
            }
        }
    };

    DataManager._databaseFiles.push(
        {name:  '$dataAntiCurses',  src:    'AntiCurse.json'}
    )
    DataManager._databaseFiles.push(
        {name:  '$dataCurses',  src:    'Curses.json'}
    )
    DataManager._databaseFiles.push(
        {name:  '$dataProgress',  src:    'Progress.json'}
    )
    DataManager._databaseFiles.push(
        {name:  '$dataTriggers',  src:    'triggers().json'}
    )


    // 外部へエクスポート
    var Accessor = {};
    // Accessor.start = Majinai.addCurse.bind(Majinai);

    Imported.Majinai = Accessor;


    /* クロージャの関数をテスト用にエクスポート
     * NOTE: NWjs で実行する際にエラーにならないように try catch 構文を使っています。
     * もっとスマートな実装方法がないかな。
     */
    try {
        if (isTest) {
            exports.AntiCurse = AntiCurse;
            exports.Curse = Curse;
            exports.Progress = Progress;
            exports.Trigger = Trigger;
            exports.Terms = Terms;

        }
    }
    catch(e) {
    }
})();
