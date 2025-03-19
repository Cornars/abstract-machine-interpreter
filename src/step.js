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
    if (typeof machineState.currentState !== "string") {
        switch (machineState.currentState.command) {
            // read right of input tape, then move head there. make sure to transition based on what was read
            case "SCAN":
                scan(sections, machineState);
                break;
            case "PRINT":
                print(sections, machineState);
                break;
            default:
                console.log("INVALID COMMAND!:");
                console.log(machineState.currentState.command);
                break;
        }
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
    console.log("======== START OF SCAN ========");
    let scanRightValue =
        machineState.singleLineInputText[machineState.currentHeadIndex + 1];
    console.log("Value Scanned on Right: ", scanRightValue);
    let nextStateName = machineState.currentState.transitions[scanRightValue];
    let nextStateObject = sections.logicSection[nextStateName];
    machineState.currentState = nextStateObject;
    console.log("TRANSITION STATE: ", machineState.currentState);
    machineState.currentHeadIndex++;
    console.log("======== END OF SCAN ========");
}
/**
 *
 * @param {Sections} sections
 * @param {MachineState} machineState
 */
function print(sections, machineState) {
    console.log("======== START OF PRINT ========");
    let characterToPrint = Object.keys(
        machineState.currentState.transitions
    )[0];
    console.log("Char: ", characterToPrint);
    let nextStateName = machineState.currentState.transitions[characterToPrint].trim();
    console.log("Next State:", nextStateName)
    let nextStateObject = sections.logicSection[nextStateName];
    console.log("Next State Object: ", nextStateObject)
    machineState.currentState = nextStateObject;
    machineState.singleLineOutputText += characterToPrint
    let printValue = console.log("======== END OF PRINT ========");
}
