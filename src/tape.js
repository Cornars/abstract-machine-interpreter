/// <reference path="../types/globals.d.ts" />

/**
 * 
 * @returns {Tape}
 */
export function create() {
    let pointerIndex = 0;
    const positiveArray = ["#"];

    function getTapeArray() {
        return positiveArray;
    }

    /**
     * 
     * @param {String} rewriteValue 
     * @param {boolean} isRewrite = false 
     * @returns {String}
     */
    function moveRight(isRewrite, rewriteValue = "#") {
        pointerIndex++;
        if (pointerIndex >= positiveArray.length) {
            positiveArray.push("#");
        }
        let readInput = positiveArray[pointerIndex]
        if (isRewrite){
            positiveArray[pointerIndex] = rewriteValue;
        }
        return readInput
    }

    function moveLeft(rewriteValue) {
        pointerIndex--;
        if (pointerIndex < 0) {
            positiveArray.unshift("#");
            pointerIndex = -1;
        }
        let readInput = positiveArray[pointerIndex]
        positiveArray[pointerIndex] = rewriteValue;
        return readInput
    }

    return {
        initializeTape(inputString) {
            console.log("INPUT:", inputString)
            positiveArray.push(...inputString.split(""));
            if (positiveArray.length === 0) {
                positiveArray.push("#");
            }
            pointerIndex = 0;
        },
        moveLeft,
        moveRight,
        printData() {
            console.log(getTapeArray().join(""));
        },
        getDataString() {
            return positiveArray.join("");
        },
        getPointerIndex() {
            return pointerIndex;
        }
    };
}
