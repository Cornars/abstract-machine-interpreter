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
        write(sections, machineState, dataVariableName)
    }
    // if read:
    if (command.startsWith("READ(")) {
        console.log("READ HAS BEEN CALLED");
        const dataVariableName = command.slice(5, -1);
        read(sections, machineState, dataVariableName)
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
    let scanRightValue =
        machineState.singleLineInputText[machineState.currentHeadIndex + 1];
    console.log("Value Scanned on Right: ", scanRightValue);
    let nextStateName =
        machineState.currentState.transitions[scanRightValue].trim();
    let nextStateObject = sections.logicSection[nextStateName];
    machineState.currentState = nextStateObject;
    console.log("TRANSITION STATE: ", machineState.currentState);
    machineState.currentHeadIndex++;
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
    let scanLeftValue =
        machineState.singleLineInputText[machineState.currentHeadIndex - 1];
    console.log("Value Scanned on Left: ", scanLeftValue);
    let nextStateName = machineState.currentState.transitions[scanLeftValue];
    let nextStateObject = sections.logicSection[nextStateName];
    machineState.currentState = nextStateObject;
    console.log("TRANSITION STATE: ", machineState.currentState);
    machineState.currentHeadIndex--;
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
    console.group("Starting READ:")
    /** @type {Queue | Stack} */
    const dataVariable = sections.dataSection[dataVariableName]
    const readValue = dataVariable.dequeue();
    let nextStateName = machineState.currentState.transitions[readValue];
    let nextStateObject = sections.logicSection[nextStateName];
    machineState.currentState = nextStateObject;
    console.log("TRANSITION STATE: ", machineState.currentState);
    console.log("DATA NOW: ")
    sections.dataSection[dataVariableName].printData()
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
    sections.dataSection[dataVariableName].enqueue(characterToWrite)
    console.log("DATA NOW: ")
    sections.dataSection[dataVariableName].printData()
    console.groupEnd();
}

/**
 * @param {Sections} sections
 * @param {MachineState} machineState
 * @param {String} tapeName
 */
function right(sections, machineState, tapeName) {
    console.group("Starting RIGHT");

    console.groupEnd();
}
// TODO: maybe add internal functions that does the transitioning for us hehe