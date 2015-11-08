//=============================================================================
// MoveAWSD.js
//=============================================================================

/*:
 * @plugindesc move on AWSD key press
 * @author saronpasu
 *
 * @version 0.0.2
 *
 * @help
 *
 */

/*:ja
 * @plugindesc AWSDキーで移動可能にするプラグインです。
 * @author saronpasu
 *
 * @help
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

Input.keyMapper[65] = 'left';
Input.keyMapper[68] = 'right';
Input.keyMapper[83] = 'down';
Input.keyMapper[87] = 'up';

})();

