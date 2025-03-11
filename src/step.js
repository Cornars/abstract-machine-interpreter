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
            console.log("machine:", machineState);

            let scanRightValue =
                machineState.singleLineInputText[
                    machineState.currentHeadIndex + 1
                ];
            console.log("SCAN RIGHT: ", scanRightValue);
            let nextStateName =
                machineState.currentState.transitions[scanRightValue];
            let nextStateObject = sections.logicSection[nextStateName];
            machineState.currentState = nextStateObject;
            console.log("TRANSITIONS: ", machineState.currentState.transitions);
            machineState.currentHeadIndex++;
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
 * @param {Object} inputTape
 * @param {*} currentIndex
 * @param {*} currentState
 * @param {*} transitionState
 */
export function scan(inputTape, currentIndex, currentState, transitions) {
    head = inputTape[currentIndex];
    const clone = structuredClone(currentState); // it just copy pastes the object, and doesn't pass a reference
    console.log("clone");
}
