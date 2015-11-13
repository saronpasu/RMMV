//=============================================================================
// GeoManager.js
//=============================================================================

/*:
 * @plugindesc GeoLocation Manager.
 * @author saronpasu
 *
 * @version 0.0.1
 *
 * @param Type
 * @desc Geodetic system Config
 * @default WGS84
 *
 * @help
 *
 * This plugin is inner module about geo location
 *
 * [Developers Note]
 * This plugin is doing the calculation by a simply formula.
 * Use the other plugin if you want a more exact calculation.
 *
 */

/*:ja
 * @plugindesc 位置情報を取得、距離計算をするモジュール
 * @author saronpasu
 *
 * @param Type
 * @desc 測地系の設定
 * @default WGS84
 *
 * @help
 *
 * このプラグインは位置情報を扱う内部モジュールです。
 *
 * [開発者向け]
 * このプラグインでは簡易式による計算を行っています。
 * より正確な計算結果を望む場合は、他のプラグインを使用することを推奨します。
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
Imported.GeoManager = {};

(function() {

    'use strict';

    var parameters = PluginManager.parameters('GeoManager');
    var Type = String(parameters['Type'] || 'WGS48');

    // 測地系、現在は WGS84 のみ対応
    var Types = {
        WGS84 : {
            semiMajorAxis: 6378137,
            semiMinorAxis: 6356752.3142,
            firstEccentricitySquared: 0.00669437999014
        }
    };

    // 単位変換レート
    var UnitRate = {
        m: 1,
        km: 0.001,
        ft: 3.28084,
        ml: 0.000621371
    };

    var GeoManager = function() {
        this.initialize.apply(this, arguments);
    };

    GeoManager.prototype.initialize = function(unit, opts, type) {
        this.setup(unit, type);
        this.setupOpts(opts);
    };

    GeoManager.prototype.setup = function(unit, type) {
        this._type = Types[type] || Types['WGS84'];
        this._unit = unit || 'm';
        this._rate = UnitRate[this._unit] || UnitRate['m'];
        this._watchId = null;
    };

    GeoManager.prototype.setupOpts = function(opts) {
        var defaultOpts = {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000
        };
        opts = opts || defaultOpts;
        this._opts = opts;
    };

    GeoManager.prototype.setUnit = function(unit) {
        this._unit = unit || this._unit;
        this._rate  = UnitRate[this._unit] || UnitRate['m'];
    }

    GeoManager.prototype.isSupport = function() {
        return !!(navigator.geolocation && !Utils.isNwjs());
    };

    GeoManager.prototype.successFunction = function(position) {
        var result = {
            latitude: position['coords']['latitude'],
            longitude: position['coords']['longitude'],
            altitude: position['coords']['altitude'],
            accuracy: position['coords']['accuracy'],
            altitudeAccuracy: position['coords']['altitudeAccuracy'],
            heading: position['coords']['heading'],
            speed: position['coords']['heading']
        };
        return result;
    };

    GeoManager.prototype.errorFunction = function(error) {
        switch(error.code) {
           case 0:
               console.error('GeoManager: unknown error.');
               break;
           case 1:
               console.error('GeoManager: permisson denied.');
               break;
           case 2:
               console.error('GeoManager: position unavailable.');
               break;
           case 3:
               console.error('GeoManager: timeout.');
               break;
           default:
               console.error('GeoManager: other error.');
               break;
        }
    };

    GeoManager.prototype.isValidFunc = function(func) {
        return typeof func === 'function';
    };

    GeoManager.prototype.isValidUnit = function(param) {
        return typeof param === 'string' && /^(m|km|ft|ml)$/.test(param);
    };

    GeoManager.prototype.isValidOpts = function(opts) {
        var result = [
            opts.enableHighAccuracy && typeof opts.enableHighAccuracy === 'boolean',
            opts.maximumAge && typeof opts.maximumAge === 'number',
            opts.timeout && typeof opts.timeout === 'number'
        ];
        return (result.filter(function(x){x;}).length === 0);
    };

    // navigator.geolocation.getCurrentPosition をラップしてるだけ。
    GeoManager.prototype.getCurrent = function(successFunc, errorFunc, opts) {
        successFunc = successFunc || this.successFunction;
        if (!this.isValidFunc(successFunc)) {
            console.error('invalid arguments');
            return false;
        }

        errorFunc = errorFunc || this.errorFunction;
        if (!this.isValidFunc(errorFunc)) {
            console.error('invalid arguments');
            return false;
        }
        opts = opts || this._opts;
        if (!this.isValidOpts(opts)) {
            console.error('invalid option');
            return false;
        }

        return navigator.geolocation.getCurrentPosition(successFunc, errorFunc, opts);
    };

    // navigator.geolocation.watchPosition をラップしてるだけ。
    GeoManager.prototype.startWatch = function(successFunc, errorFunc, opts) {
        successFunc = successFunc || this.successFunction;
        if (!this.isValidFunc(successFunc)) {
            console.error('invalid arguments');
            return false;
        }

        errorFunc = errorFunc || this.errorFunction;
        if (!this.isValidFunc(errorFunc)) {
            console.error('invalid arguments');
            return false;
        }
        opts = opts || this._opts;
        if (!this.isValidOpts(opts)) {
            console.error('invalid option');
            return false;
        }

        this._watchId = navigator.geolocation.watchPosition(successFunc, errorFunc, opts);
        return this._watchId;
    };

    // navigator.geolocation.clearWatch をラップしてるだけ。
    GeoManager.prototype.stopWatch = function(watchId) {
        watchId = watchId || this._watchId;
        if (!watchId) {
            console.error('not have watchId');
            return false;
        }

        navigator.geolocation.clearWatch(watchId);
    };


    // 地球上の２座標間の距離を測位して任意の単位で返す
    GeoManager.prototype.distance = function(lat1, lon1, lat2, lon2, unit) {
        unit = unit || this._unit;
        return this.convertUnit(this.calcHubenyFormula(lat1, lon1, lat2, lon2), unit);
    };

    /*
     * 地球上の２座標間の距離を算出するヒュベニの簡易式
     * 返り値の単位はメートル、より正確な測位を望む場合は別の方法で実装して下さい
     * 単位変換の必要がない場合や、まとめて単位変換する場合はこちらの関数を直接実行するのでもいいです
     *
     */
    GeoManager.prototype.calcHubenyFormula = function(lat1, lon1, lat2, lon2) {
        var Rx = this._type.semiMajorAxis;
        var Ry = this._type.semiMinorAxix;
        var E2 = this._type.firstEccentricitySquared;

        var Dy = (lat1 * Math.PI / 180) - (lat2 * Math.PI / 180);
        var Dx = (lon1 * Math.PI / 180) - (lon2 * Math.PI / 180);
        var P = ((lat1 * Math.PI / 180) + (lat2 * Math.PI / 180)) / 2;

        var W = Math.sqrt(1 - E2 * Math.pow(Math.sin(P), 2));
        var N = Rx / W;
        var M = Rx * (1 - E2) / Math.pow(W, 3);

        return Math.sqrt(Math.pow(Dy * M, 2) + Math.pow(Dx * N * Math.cos(P), 2));
    };

    // 単位変換
    GeoManager.prototype.convertUnit = function(value, unit) {
        unit = unit || this._unit;
        return Math.floor(value * UnitRate[unit]);
    };

    // エクスポート
    Imported.GeoManager = GeoManager;

})();
