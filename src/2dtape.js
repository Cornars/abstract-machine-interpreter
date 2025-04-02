export function create() {
    let pointerX = 0;
    let pointerY = 0;
    let tapeRows = [["#"]]; // Start with one row containing one cell

    /**
     * Ensures all rows have the same length by padding with '#' on BOTH sides as needed
     * @param {boolean} padLeft - Whether we need to pad on the left side
     */
    function alignRows(padLeft = false) {
        // Find the maximum row length
        let maxLength = 0;
        for (const row of tapeRows) {
            if (row.length > maxLength) {
                maxLength = row.length;
            }
        }

        // Pad all rows to match the maximum length
        for (const row of tapeRows) {
            if (padLeft) {
                // When moving left, we pad on the left side
                while (row.length < maxLength) {
                    row.unshift("#");
                }
                // Adjust pointer since we added cells to the left
                pointerX += maxLength - row.length;
            } else {
                // Normal case - pad on the right side
                while (row.length < maxLength) {
                    row.push("#");
                }
            }
        }
    }

    function getCurrentCell() {
        return tapeRows[pointerY][pointerX];
    }

    function moveRight(isRewrite, rewriteValue = "#") {
        pointerX++;

        if (pointerX >= tapeRows[pointerY].length) {
            tapeRows[pointerY].push("#");
            alignRows(); // Pad other rows on the right
        }

        const readValue = getCurrentCell();
        if (isRewrite) {
            tapeRows[pointerY][pointerX] = rewriteValue;
        }
        return readValue;
    }

    function moveLeft(isRewrite, rewriteValue = "#") {
        pointerX--;

        if (pointerX < 0) {
            // Add new cell to the left of current row
            tapeRows[pointerY].unshift("#");
            pointerX = 0;
            // Pad all other rows on the LEFT to maintain alignment
            alignRows(true);
        }

        const readValue = getCurrentCell();
        if (isRewrite) {
            tapeRows[pointerY][pointerX] = rewriteValue;
        }
        return readValue;
    }

    /**
     * Moves the pointer up
     * @param {boolean} isRewrite
     * @param {String} rewriteValue
     * @returns {String} The value before rewriting (if rewriting)
     */
    function moveUp(isRewrite, rewriteValue = "#") {
        pointerY--;

        // Add a new row at the top if needed
        if (pointerY < 0) {
            const newRowLength = tapeRows[0].length;
            const newRow = Array(newRowLength).fill("#");
            tapeRows.unshift(newRow);
            pointerY = 0;
        }

        const readValue = getCurrentCell();
        if (isRewrite) {
            tapeRows[pointerY][pointerX] = rewriteValue;
        }
        return readValue;
    }

    /**
     * Moves the pointer down
     * @param {boolean} isRewrite
     * @param {String} rewriteValue
     * @returns {String} The value before rewriting (if rewriting)
     */
    function moveDown(isRewrite, rewriteValue = "#") {
        console.log("CLALED MOVE DOWN");
        pointerY++;

        // Add a new row at the bottom if needed
        if (pointerY >= tapeRows.length) {
            const newRowLength = tapeRows[0].length;
            const newRow = Array(newRowLength).fill("#");
            tapeRows.push(newRow);
        }

        const readValue = getCurrentCell();
        if (isRewrite) {
            tapeRows[pointerY][pointerX] = rewriteValue;
        }
        return readValue;
    }

    /**
     * Rewrites the current cell
     * @param {String} rewriteValue
     */
    function rewritePointer(rewriteValue) {
        tapeRows[pointerY][pointerX] = rewriteValue;
    }

    return {
        /**
         * Initializes the tape with input string on the first row
         * @param {String} inputString
         */
        initializeTape(inputString) {
            // Reset tape
            pointerX = 0;
            pointerY = 0;
            tapeRows.length = 1
            tapeRows = [["#"]]
            // Clean input and ensure it starts with #
            const cleanInput = inputString.trim();
            tapeRows = [["#"].concat(cleanInput.split(""))];

            // Ensure we have at least one empty row below
            if (tapeRows.length < 2) {
                tapeRows.push(["#"]);
            }

            alignRows();
        },

        moveRight,
        moveLeft,
        moveUp,
        moveDown,

        /**
         * Prints the current tape state to console
         */
        printData() {
            console.log("Current Tape:");
            for (let y = 0; y < tapeRows.length; y++) {
                const row = tapeRows[y];
                const pointerIndicator =
                    y === pointerY ? " ".repeat(pointerX) + "^" : "";
                console.log(row.join("") + "  " + pointerIndicator);
            }
        },

        /**
         * Gets the current tape data as a 2D array
         * @returns {Array<Array<String>>}
         */
        get2DArray() {
            return tapeRows.map((row) => [...row]);
        },
        getData() {
            let tapeRowString = "";
            tapeRows.map((row) => {
                tapeRowString = tapeRowString.concat(row.join("") + "<br>")
            });
            console.log(tapeRowString)
            return tapeRowString

        },

        /**
         * Gets the current pointer position
         * @returns {{x: number, y: number}}
         */
        getPointerPosition() {
            return { x: pointerX, y: pointerY };
        },

        /**
         * Resets the tape to initial state
         */
        resetTape() {
            pointerX = 0;
            pointerY = 0;
            tapeRows = [["#"]];
        },

        rewritePointer,

        /**
         * Gets the current cell value
         * @returns {String}
         */
        getCurrentCell,
    };
}
