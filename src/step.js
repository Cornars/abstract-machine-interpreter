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
 * At this index, what is the symbol we read, and what kind of transition are we going to do?
 */
export function step(sections, machineState) {
    // basedo on the input, what is the next state we are going to
    switch (machineState.currentState.command) {
        // read right of input tape, then move head there. make sure to transition based on what was read
        case "SCAN":
            scan(sections, machineState);
        default:
            break;
    }
    // No state it got transitioned to means it should be rejected
    if (machineState.currentState == undefined) {
        console.log("No State Transition, REJECT INPUT");
        machineState.currentState = "REJECT";
    }
}
/**
 *
 * @param {Object} macineState
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
