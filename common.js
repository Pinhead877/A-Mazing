class Utils {
    static removeFromArrayByIndex(arr, index) {
        return arr.splice(index, 1)[0];
    }

    static removeFromArrayByValue(arr, value) {
        for (var i = 0; i < arr.length; i++) {
            if (value == arr[i]) {
                return arr.splice(i, 1)[0];
            }
        }
        return null;
    }

    static getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    static keyboardKeysToDirection(keyCode) {
        var direction = null;
        if (keyCode == KEYBOARD_KEYS.UP) {
            direction = DIRECTION.UP;
        }
        else if (keyCode == KEYBOARD_KEYS.RIGHT) {
            direction = DIRECTION.RIGHT;
        }
        else if (keyCode == KEYBOARD_KEYS.DOWN) {
            direction = DIRECTION.DOWN;
        }
        else if (keyCode == KEYBOARD_KEYS.LEFT) {
            direction = DIRECTION.LEFT;
        }
    
        return direction;
    }
}

class Point {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

