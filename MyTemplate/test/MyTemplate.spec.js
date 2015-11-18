isTest = true;

should = require('chai').should();
sinon = require('sinon');

describe('MyTemplate', function() {
    // initialize
    before(function() {
        // define mock PluginManager
        PluginManager = {};
        PluginManager.parameters = sinon.stub()
        .withArgs('MyTemplate').returns({
            // PluginParam: 'default'
        });
        // define mock Game_Interpreter
        Game_Interpreter = function() {};
        Game_Interpreter.prototype.pluginCommand = sinon.stub();

        // import Test functions.
        MyTemplate = require('../MyTemplate.js');
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

});
