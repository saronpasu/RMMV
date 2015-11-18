isTest = true;

should = require('chai').should();
sinon = require('sinon');

describe('EasterEgg', function() {
    // initialize
    before(function() {
        // define mock PluginManager
        PluginManager = {};
        PluginManager.parameters = sinon.stub()
        .withArgs('EasterEgg').returns({
            // PluginParam: 'default'
        });
        // define mock Game_Interpreter
        Game_Interpreter = function() {};
        Game_Interpreter.prototype.pluginCommand = sinon.stub();
        // define Input
        Input = {};
        // define DataManager
        DataManager = {};
        // define Scene_Base
        Scene_Base = function() {};
        Scene_Base.prototype.update = sinon.stub();
        // import Test functions.
        EasterEgg = require('../EasterEgg.js');
        Validator = EasterEgg.Validator;
        KeyStore = EasterEgg.KeyStore;
        Egg = EasterEgg.EasterEgg;
    });

    describe('Validator', function() {
        it('validKey', function() {
            Validator.isValidKey('down').should.be.true;
            Validator.isValidKey('Left').should.be.true;
            Validator.isValidKey('OK').should.be.true;
        });

        it('invalidkey', function() {
            Validator.isValidKey('enter').should.be.false;
        });

        it('validKeys', function() {
            Validator.isValidKeys(['up', 'up', 'down']).should.be.true;
        });

        it('invalidKeys', function() {
            Validator.isValidKeys('up').should.be.false;
            Validator.isValidKeys([]).should.be.false;
            Validator.isValidKeys(['1', 'up', 'down']).should.be.false;
        });
    });

    describe('KeyStore', function() {
        beforeEach(function() {
            keyStore = new KeyStore();
            keyStore.initialize();
        });

        it('get', function() {
            keyStore._keys[1] = ['up', 'down', 'down'];
            keyStore.get(1).should.be.include.members(['up', 'down', 'down']);
        });

        it('set', function() {
            keyStore.set(1, ['up', 'down', 'down']);
            keyStore._keys[1].should.be.include.members(['up', 'down', 'down']);
        });

        it('delete', function() {
            keyStore._keys[1] = ['up', 'down', 'down'];
            keyStore.delete(1);
            // TODO: should.be.undefined not working.
            if (keyStore._keys[1] !== undefined) {
                throw('not undefined');
            }
        });
    });

    describe('register', function() {
        beforeEach(function() {
            keyStore = new KeyStore();
            keyStore.initialize();
            easterEgg = new Egg();
            easterEgg.initialize();
        });

        it('setKeys', function() {
            easterEgg.setKeys(1, ['up', 'down', 'down']);
            keyStore.get(1).should.be.include.members(['up', 'down', 'down']);
            easterEgg.setKeys(1, ['left', 'left', 'up']).should.be.false;
        });

        it('updateKeys', function() {
            easterEgg.updateKeys(1, ['left', 'left', 'down']).should.be.false;
            keyStore.set(1, ['up', 'down', 'down']);
            easterEgg.updateKeys(1, ['left', 'left', 'down']);
            keyStore.get(1).should.be.include.members(['left', 'left', 'down']);
        });

        it('deleteKeys', function() {
            keyStore.set(1, ['up', 'down', 'down']);
            easterEgg.deleteKeys(1);
            // TODO: should.be.undefined not working.
            if (keyStore.get(1) !== undefined) {
                throw('not undefined');
            }
        });
    });

    describe('status check', function() {
        beforeEach(function() {
            easterEgg = new Egg();
            easterEgg.initialize();
        });

        describe('standby', function() {
            beforeEach(function() {
                easterEgg._status = 'standby';
            });

            it('isRunning', function() {
                easterEgg.isRunning().should.be.false;
            });

            it('isInput', function() {
                easterEgg.isInput().should.be.false;
            });

            it('isComplete', function() {
                easterEgg.isComplete().should.be.false;
            });
        });

        describe('active', function() {
            beforeEach(function() {
                easterEgg._status = 'active';
            });

            it('isRunning', function() {
                easterEgg.isRunning().should.be.true;
            });

            it('isInput', function() {
                easterEgg.isInput().should.be.false;
            });

            it('isComplete', function() {
                easterEgg.isComplete().should.be.false;
            });
        });

        describe('input', function() {
            beforeEach(function() {
                easterEgg._status = 'input';
            });

            it('isRunning', function() {
                easterEgg.isRunning().should.be.true;
            });

            it('isInput', function() {
                easterEgg.isInput().should.be.true;
            });

            it('isComplete', function() {
                easterEgg.isComplete().should.be.false;
            });
        });

        describe('complete', function() {
            beforeEach(function() {
                easterEgg._status = 'complete';
            });

            it('isRunning', function() {
                easterEgg.isRunning().should.be.false;
            });

            it('isInput', function() {
                easterEgg.isInput().should.be.false;
            });

            it('isComplete', function() {
                easterEgg.isComplete().should.be.true;
            });
        });
    });

    describe('status change', function() {
        beforeEach(function() {
            easterEgg = new Egg();
            easterEgg.initialize();
        });

        it('activate', function() {
            easterEgg._status = 'input';
            easterEgg.setStatus('active');
            easterEgg._status.should.be.equal('active');
        });

        it('deactivate', function() {
            easterEgg._status = 'input';
            easterEgg.setStatus('standby');
            easterEgg._status.should.be.equal('standby');
        });

        it('input', function() {
            easterEgg._status = 'standby';
            easterEgg.setStatus('input');
            easterEgg._status.should.be.equal('input');
        });

        it('complete', function() {
            easterEgg._status = 'input';
            easterEgg.setStatus('complete');
            easterEgg._status.should.be.equal('complete');
        });
    });

    describe('reset', function() {
        before(function() {
            easterEgg = new Egg();
            easterEgg.initialize();
        });

        it('always success', function() {
            easterEgg._status = 'input';
            easterEgg._index = 2;
            easterEgg.reset();
            easterEgg._status.should.be.equal('active');
            easterEgg._index.should.be.zero;
        });
    });

    describe('checkKey', function() {
        beforeEach(function() {
            easterEgg = new Egg();
            easterEgg.initialize();
        });

        it('true key', function() {
            easterEgg._currentKey = 'down';
            easterEgg.checkKey('down').should.be.true;
        });

        it('false key', function() {
            easterEgg._currentKey = 'down';
            easterEgg.checkKey('up').should.be.false;
        });
    });

    describe('getNextKey', function() {
        beforeEach(function() {
            easterEgg = new Egg();
            easterEgg.initialize();
        });

        it('has next key', function() {
            easterEgg._index = 0;
            easterEgg._keys = ['up', 'down'];
            easterEgg.getNextKey().should.be.equal('down');
        });

        it('not have next key', function() {
            easterEgg._index = 1;
            easterEgg._keys = ['up', 'down'];
            if (easterEgg.getNextKey() !== undefined) {
                throw('not undefined');
            }
        });
    });

    describe('update', function() {
        beforeEach(function() {
            easterEgg = new Egg();
            easterEgg.initialize();
        });

        describe('onSuccess', function() {
            it('has next key', function() {
                easterEgg._index = 0;
                easterEgg._currentKey = 'up';
                easterEgg._keys = ['up', 'down'];
                easterEgg.onSuccess();
                easterEgg._index.should.be.equal(1);
                easterEgg._currentKey.should.be.equal('down');
            });

            it('not have next key', function() {
                stub = sinon.stub(easterEgg, 'complete');
                easterEgg._status = 'input';
                easterEgg._keys = ['up', 'down'];
                easterEgg._index = 1;
                easterEgg.onSuccess();
                stub.called.should.be.true;
            });
        });

        describe('onMiss', function() {
            beforeEach(function() {
                easterEgg = new Egg();
                easterEgg.initialize();
            });

            it('retry count not limit', function() {
                stub = sinon.stub(easterEgg, 'reset');
                easterEgg._retryLimit = Infinity;
                easterEgg._retryCount = 0;
                easterEgg.onMiss();
                easterEgg._retryCount.should.be.equal(1);
                stub.called.should.be.true;
            });

            it('retry count on limit', function() {
                stub = sinon.stub(easterEgg, 'stop');
                easterEgg._retryLimit = 2;
                easterEgg._retryCount = 2;
                easterEgg.onMiss();
                stub.called.should.be.true;
            });
        });
    });

    describe('start', function() {
        beforeEach(function() {
            easterEgg = new Egg();
            easterEgg.initialize();
            keyStore = new KeyStore();
            keyStore.initialize();
            keyStore.set(1, ['up', 'down']);
        });

        it('standby', function() {
            stub = sinon.stub(easterEgg, 'activate');
            easterEgg._status = 'standby';
            easterEgg.start(1, 1);
            easterEgg._retryLimit.should.be.equal(Infinity);
            easterEgg._retryCount.should.be.zero;
            easterEgg._index.should.be.zero;
            stub.called.should.be.true;
        });

        it('already started', function() {
            stub = sinon.stub(easterEgg, 'activate');
            easterEgg._status = 'active';
            easterEgg.start(1, 1);
            stub.called.should.be.false;
        });
    });

    describe('stop', function() {
        beforeEach(function() {
            easterEgg = new Egg();
            easterEgg.initialize();
        });

        it('running', function() {
            stub = sinon.stub(easterEgg, 'deactivate');
            easterEgg._status = 'active';
            easterEgg._index = 1;
            easterEgg._retryCount = 1;
            easterEgg.stop();
            easterEgg._index.should.be.zero;
            easterEgg._retryCount.should.be.zero;
            stub.called.should.be.true;
        });

        it('not running', function() {
            stub = sinon.stub(easterEgg, 'deactivate');
            easterEgg._status = 'standby';
            easterEgg.stop();
            stub.called.should.be.false;
        });
    });

    describe('call from PluginCommand', function() {
        beforeEach(function() {
            gameInterpreter = new Game_Interpreter();
        });

        describe('command name match', function() {
            beforeEach(function() {
                easterEgg = new Egg();
                easterEgg.initialize();
                keyStore = new KeyStore();
                keyStore.initialize();
                Game_Switches = function() {};
                Game_Switches.prototype.setValue = sinon.stub();
                $gameSwitches = new Game_Switches();
                Game_Variables = function() {};
                Game_Variables.prototype.setValue = sinon.stub();
                $gameVariables = new Game_Variables();
            });

            it('valid argments', function() {
                startStub = sinon.stub(easterEgg, 'start');
                gameInterpreter.pluginCommand('EasterEgg', ['on', '1', '1']);
                startStub.called.should.be.true;
                stopStub = sinon.stub(easterEgg, 'stop');
                gameInterpreter.pluginCommand('EasterEgg', ['off']);
                stopStub.called.should.be.true;
                isRunningStub = sinon.stub(easterEgg, 'isRunning');
                gameInterpreter.pluginCommand('EasterEgg', ['isRunning', '1']);
                isRunningStub.called.should.be.true;
                isInputStub = sinon.stub(easterEgg, 'isInput');
                gameInterpreter.pluginCommand('EasterEgg', ['isInput', '1']);
                isInputStub.called.should.be.true;
                isCompleteStub = sinon.stub(easterEgg, 'isComplete');
                gameInterpreter.pluginCommand('EasterEgg', ['isComplete', '1']);
                isCompleteStub.called.should.be.true;
                statusStub = sinon.stub(easterEgg, 'status');
                gameInterpreter.pluginCommand('EasterEgg', ['status', '1']);
                statusStub.called.should.be.true;
                setKeysStub = sinon.stub(easterEgg, 'setKeys');
                gameInterpreter.pluginCommand('EasterEgg', ['create', '1', 'up', 'down', 'down']);
                setKeysStub.called.should.be.true;
                updateKeysStub = sinon.stub(easterEgg, 'updateKeys');
                gameInterpreter.pluginCommand('EasterEgg', ['update', '1', 'up', 'down', 'down']);
                updateKeysStub.called.should.be.true;
                deleteKeysStub = sinon.stub(easterEgg, 'deleteKeys');
                gameInterpreter.pluginCommand('EasterEgg', ['delete', '1']);
                deleteKeysStub.called.should.be.true;
                clearStub = sinon.stub(keyStore, 'clear');
                gameInterpreter.pluginCommand('EasterEgg', ['delete', 'all']);
                clearStub.called.should.be.true;
            });

            it('invalid argments', function() {
                gameInterpreter.pluginCommand('EasterEgg', ['invalidArgs']);
            });

        });

        it('command name not match', function() {
            gameInterpreter.pluginCommand('otherCommand', ['1', 'foo', 'bar']);
        });
    });

});
