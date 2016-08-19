isTest = true;

should = require('chai').should();
sinon = require('sinon');

describe('Sazanami', function() {
    // initialize
    before(function() {
        // define mock PluginManager
        PluginManager = {};
        PluginManager.parameters = sinon.stub()
        .withArgs('Sazanami').returns({
            // PluginParam: 'default'
            'frameLimit'    :   300,
            'reportType'    :   'level',
            'returnFlag'    :   'gameVariables',
            'returnGameValiablesNo' :   -1,
        });

        // Dummy Define
        // define DataManager
        DataManager = {};
        // define Scene_Base
        Scene_Base = function() {};
        Scene_Base.prototype.update = sinon.stub();
        // define AudioContext
        AudioContext = function() {};
        analyser = {};
        createAnalyser = function() {return analyser};
        analyser.fftSize = sinon.stub();
        AudioContext.prototype.createAnalyser = createAnalyser;
        navigator = function() {};
        navigator.getUserMedia = sinon.stub();

        // import Test functions.
        // define mock Game_Interpreter
        Game_Interpreter = function() {};
        Game_Interpreter.prototype.pluginCommand = sinon.stub();

        // import Test functions.
        Sazanami = require('../Sazanami.js');
        SoundChecker = Sazanami.SoundChecker;
    });

    describe('call from PluginCommand', function() {
        beforeEach(function() {
            gameInterpreter = new Game_Interpreter();
        });

        describe('command name match', function() {
            it('valid argments', function() {
                gameInterpreter.pluginCommand('CommandName', ['validArguments']);
            });

            it('invalid argments', function() {
                gameInterpreter.pluginCommand('CommandName', ['invalidArguments']);
            });

        });

        it('command name not match', function() {
            gameInterpreter.pluginCommand('otherCommand', ['1', 'foo', 'bar']);
        });
    });

    describe('status check', function() {
        beforeEach(function() {
            soundChecker = new SoundChecker();
        });

        describe('standby', function() {

            beforeEach(function() {
                soundChecker._status = 'standby';
            });

            it('isRunning', function() {
                soundChecker.isRunning().should.be.false;
            });

            it('status', function() {
                soundChecker.status().should.be.equal('standby')
            });

        });

        describe('running', function() {

            beforeEach(function() {
                soundChecker._status = 'running';
            });

            it('isRunning', function() {
                soundChecker.isRunning().should.be.true;
            });

            it('statsu', function() {
                soundChecker.status().should.be.equal('running');
            });

        });

        describe('resume', function() {

            beforeEach(function() {
                soundChecker._status = 'resume';
            });

            it('isRunning', function() {
                soundChecker.isRunning().should.be.false;
            });

            it('status', function() {
                soundChecker.status().should.be.equal('resume');
            })
        });

    });

    describe('changeSetting', function() {
        beforeEach(function() {
            soundChecker = new SoundChecker();
        });

        it('set frameLimit to 600', function() {
            soundChecker.changeSetting('frameLimit', 600);
            soundChecker._frameLimit.should.be.equal(600);
        });

        it('set reportType to Decibel', function() {
            soundChecker.changeSetting('reportType', 'Decibel');
            soundChecker._reportType.should.be.equal('Decibel');
        });

        it('set reportType to Level', function() {
            soundChecker.changeSetting('reportType', 'Level');
            soundChecker._reportType.should.be.equal('Level');
        });

        it('set returnFlag to none', function() {
            soundChecker.changeSetting('returnFlag', 'none');
            soundChecker._returnFlag.should.be.equal('none');
        });

        it('set returnFlag to gameVariables', function() {
            soundChecker.changeSetting('returnFlag', 'gameVariables');
            soundChecker._returnFlag.should.be.equal('gameVariables');
        });

        it('set returnGameValiablesNo to 3', function() {
            soundChecker.changeSetting('returnGameValiablesNo', 3);
            soundChecker._returnGameValiablesNo.should.be.equal(3);
        })

        describe('invalid params', function() {

            it('set frameLimit to aaa', function() {
                soundChecker.changeSetting('frameLimit', 'aaa');
                soundChecker._frameLimit.should.not.to.be.equal('aaa');
            });

            it('set reportType to aaa', function() {
                soundChecker.changeSetting('reportType', 'aaa');
                soundChecker._reportType.should.not.to.be.equal('aaa');
            });

            it('set returnFlag to aaa', function() {
                soundChecker.changeSetting('returnFlag', 'aaa');
                soundChecker._returnFlag.should.not.to.be.equal('aaa');
            });

            it('set returnGameValiablesNo to aaa', function() {
                soundChecker.changeSetting('returnGameValiablesNo', 'aaa');
                soundChecker._returnGameValiablesNo.should.not.to.be.equal('aaa');
            });
        });
    });

});
