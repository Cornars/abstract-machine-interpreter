/// <reference path="../types/globals.d.ts" />
/**
 * step.js will be in charge of handling the steps of the machine.
 *
 * a step consists of the following:
 *  - changing transitioning to a new state
 *  - reading the data that is passed into it
 *
 * ideas to think about:
 *  - we pass the reference of the data structure, then change it. it should be changed
 * in the overall variable for the sections
 */

/**
 *
 * @param {Sections} sections
 * @param {MachineState} machineState
 */
export function step(sections, machineState) {
    // basedo on the input, what is the next state we are going to
    const command = machineState.currentState.command;
    if (command.startsWith("WRITE(")) {
        console.log("WRITE HAS BEEN CALLED");
        const dataVariableName = command.slice(6, -1);
        console.log(dataVariableName);
        write(sections, machineState, dataVariableName);
    }
    // if read:
    if (command.startsWith("READ(")) {
        console.log("READ HAS BEEN CALLED");
        const dataVariableName = command.slice(5, -1).trim();
        read(sections, machineState, dataVariableName);
    }
    if (command.startsWith("RIGHT(")) {
        const dataVariableName = command.slice(6, -1).trim();
        right(sections, machineState, dataVariableName);
    }
    if (command.startsWith("LEFT(")) {
        const dataVariableName = command.slice(5, -1);
        left(sections, machineState, dataVariableName);
    }
    if (command.startsWith("UP(")) {
        const dataVariableName = command.slice(3, -1);
        up(sections, machineState, dataVariableName);
    }
    if (command.startsWith("DOWN(")) {
        const dataVariableName = command.slice(5, -1);
        down(sections, machineState, dataVariableName);
    }
    switch (command) {
        // read right of input tape, then move head there. make sure to transition based on what was read
        case "SCAN":
        case "SCAN RIGHT":
            scan(sections, machineState);
            break;
        case "PRINT":
            print(sections, machineState);
            break;
        case "SCAN LEFT":
            scan_left(sections, machineState);
            break;
        default:
            console.log("INVALID COMMAND!, or it got parsed earlier pa lol:");
            console.log(command);
            break;
    }

    // No state it got transitioned to means it should be rejected
    if (machineState.currentState == undefined) {
        console.log("No State Transition, REJECT INPUT");
        machineState.currentState = sections.logicSection.reject;
    }
}
/**
 *
 * @param {Sections} sections
 * @param {MachineState} machineState
 */
function scan(sections, machineState) {
    console.group("Starting Scan (SCAN RIGHT)");
    let scanRightValue = machineState.singleLineInputText.moveRight(false);
    console.log("Value Scanned on Right: ", scanRightValue);
    let nextStateName =
        machineState.currentState.transitions[scanRightValue];
    if(nextStateName != undefined) nextStateName = nextStateName.trim()
    let nextStateObject = sections.logicSection[nextStateName];
    machineState.currentState = nextStateObject;
    console.log("TRANSITION STATE: ", machineState.currentState);
    console.groupEnd();
}
/**
 *
 * @param {Sections} sections
 * @param {MachineState} machineState
 */
function print(sections, machineState) {
    console.group("Starting Print");
    let characterToPrint = Object.keys(
        machineState.currentState.transitions
    )[0];
    console.log("Char: ", characterToPrint);
    let nextStateName =
        machineState.currentState.transitions[characterToPrint].trim();
    console.log("Next State:", nextStateName);
    let nextStateObject = sections.logicSection[nextStateName];
    console.log("Next State Object: ", nextStateObject);
    machineState.currentState = nextStateObject;
    machineState.singleLineOutputText += characterToPrint;
    console.groupEnd();
}
/**
 *
 * @param {Sections} sections
 * @param {MachineState} machineState
 */
function scan_left(sections, machineState) {
    console.group("Starting SCAN LEFT");
    let scanLeftValue = machineState.singleLineInputText.moveLeft(false);
    console.log("Value Scanned on Left: ", scanLeftValue);
    let nextStateName =
        machineState.currentState.transitions[scanLeftValue].trim();
    console.log("NEXT STATE:", nextStateName);
    let nextStateObject = sections.logicSection[nextStateName];
    machineState.currentState = nextStateObject;
    console.log("TRANSITION STATE: ", machineState.currentState);
    console.groupEnd();
}

/**
 *
 * @param {Sections} sections
 * @param {MachineState} machineState
 * @param {String} dataVariableName
 * TODO: add tape here
 */
function read(sections, machineState, dataVariableName) {
    // we want to read the value we pop, and actually delete it from the list as well
    console.group("Starting READ:");
    /** @type {Queue | Stack} */
    const dataVariable = sections.dataSection[dataVariableName];
    const readValue = dataVariable.dequeue();
    let nextStateName = machineState.currentState.transitions[readValue];
    let nextStateObject = sections.logicSection[nextStateName];
    machineState.currentState = nextStateObject;
    console.log("TRANSITION STATE: ", machineState.currentState);
    console.log("DATA NOW: ");
    sections.dataSection[dataVariableName].printData();
    console.groupEnd();
}

/**
 * @param {Sections} sections
 * @param {MachineState} machineState
 * @param {String} dataVariableName
 */
function write(sections, machineState, dataVariableName) {
    console.group("Starting WRITE");
    let characterToWrite = Object.keys(
        machineState.currentState.transitions
    )[0];
    console.log("Char: ", characterToWrite);
    let nextStateName =
        machineState.currentState.transitions[characterToWrite].trim();
    console.log("Next State:", nextStateName);
    let nextStateObject = sections.logicSection[nextStateName];
    console.log("Next State Object: ", nextStateObject);
    machineState.currentState = nextStateObject;
    /** @type {Queue | Stack} */
    sections.dataSection[dataVariableName].enqueue(characterToWrite);
    console.log("DATA NOW: ");
    sections.dataSection[dataVariableName].printData();
    console.groupEnd();
}

/**
 * @param {Sections} sections
 * @param {MachineState} machineState
 */
function right(sections, machineState, dataVariableName) {
    console.group("Starting RIGHT");
    console.log(dataVariableName)
    let rightReadValue = sections.dataSection[dataVariableName].moveRight(false)
    let isRewritten = false
    for (const key of Object.keys(machineState.currentState.transitions)){
        const [expectedHead ,rewriteValue] = key.split("/")
        console.log(rightReadValue, expectedHead)
        if (rightReadValue === expectedHead.trim()){
            console.log("HIT!")
            machineState.singleLineInputText.rewritePointer(rewriteValue.trim());
            console.log(machineState.currentState)
            let nextState = machineState.currentState.transitions[key]
            machineState.currentState = sections.logicSection[nextState]
            isRewritten = true
            break;
        }
        console.log("skipped")
    }
    if (!isRewritten) machineState.currentState = undefined
    // get the differnt parts of the string:
    // iterate through each key in currentState.transitions
    // do a .split()[0] to get the first index
    // if we find a match to the current value in the head
    // get the .split()[1] of it, and rewrite the current head
    // we use the key the original X/Y and get the transition there
    console.groupEnd();
}

/**
 * @param {Sections} sections
 * @param {MachineState} machineState
 */
function left(sections, machineState, dataVariableName) {
    console.group("Starting RIGHT");
    let leftReadValue = sections.dataSection[dataVariableName].moveLeft(false)
    let isRewritten = false
    for (const key of Object.keys(machineState.currentState.transitions)){
        const [expectedHead ,rewriteValue] = key.split("/")
        console.log(leftReadValue, expectedHead)
        if (leftReadValue === expectedHead.trim()){
            console.log("HIT!")
            machineState.singleLineInputText.rewritePointer(rewriteValue.trim());
            let nextState = machineState.currentState.transitions[key]
            machineState.currentState = sections.logicSection[nextState]
            isRewritten = true
            break;
        }
        console.log("skipped")
    }
    if (!isRewritten) machineState.currentState = undefined
    // get the differnt parts of the string:
    // iterate through each key in currentState.transitions
    // do a .split()[0] to get the first index
    // if we find a match to the current value in the head
    // get the .split()[1] of it, and rewrite the current head
    // we use the key the original X/Y and get the transition there
    console.groupEnd();
}
// TODO: maybe add internal functions that does the transitioning for us hehe
/**
 * @param {Sections} sections
 * @param {MachineState} machineState
 */
function up(sections, machineState, dataVariableName) {
    console.group("Starting UP");
    let upReadValue = sections.dataSection[dataVariableName].moveUp(false)
    let isRewritten = false
    for (const key of Object.keys(machineState.currentState.transitions)){
        const [expectedHead ,rewriteValue] = key.split("/")
        console.log(upReadValue, expectedHead)
        if (upReadValue === expectedHead.trim()){
            console.log("HIT!")
            machineState.singleLineInputText.rewritePointer(rewriteValue.trim());
            let nextState = machineState.currentState.transitions[key]
            machineState.currentState = sections.logicSection[nextState]
            isRewritten = true
            break;
        }
        console.log("skipped")
    }
    if (!isRewritten) machineState.currentState = undefined
    console.groupEnd();
}

/**
 * @param {Sections} sections
 * @param {MachineState} machineState
 */
function down(sections, machineState, dataVariableName) {
    console.group("Starting DOWN");
    let downReadValue = sections.dataSection[dataVariableName].moveDown(false)
    let isRewritten = false
    for (const key of Object.keys(machineState.currentState.transitions)){
        const [expectedHead ,rewriteValue] = key.split("/")
        console.log(downReadValue, expectedHead)
        if (downReadValue === expectedHead.trim()){
            console.log("HIT!")
            machineState.singleLineInputText.rewritePointer(rewriteValue.trim());
            let nextState = machineState.currentState.transitions[key]
            machineState.currentState = sections.logicSection[nextState]
            isRewritten = true
            break;
        }
        console.log("skipped")
    }
    if (!isRewritten) machineState.currentState = undefined
    console.groupEnd();
}