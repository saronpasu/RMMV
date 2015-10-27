//=============================================================================
// MoveAWSD.js
//=============================================================================

/*:
 * @plugindesc move on AWSD key press
 * @author saronpasu
 *
 * @version 0.0.1
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

(function() {

Input.keyMapper[65] = 'A'
Input.keyMapper[68] = 'D'
Input.keyMapper[83] = 'S'
Input.keyMapper[87] = 'W'

Input._signX = function() {
    var x = 0;

    if (this.isPressed('left')) {
        x--;
    } else if (this.isPressed('A')) {
        x--;
    }
    if (this.isPressed('right')) {
        x++;
    } else if (this.isPressed('D')) {
        x++;
    }
    return x;
};

Input._signY = function() {
    var y = 0;

    if (this.isPressed('up')) {
        y--;
    } else if (this.isPressed('W')) {
        y--;
    }
    if (this.isPressed('down')) {
        y++;
    } else if (this.isPressed('S')) {
        y++;
    }
    return y;
};

})();

