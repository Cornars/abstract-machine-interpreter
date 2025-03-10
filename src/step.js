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
export function step(sections, currentState, inputTape, currentIndex) {
    let head = inputTape[currentIndex];
    // basedo on the input, what is the next state we are going to
    switch (currentState.current.command) {
        // read right of input tape, then move head there. make sure to transition based on what was read
        case "SCAN":
            let scanRight = inputTape[currentIndex + 1];
            console.log("SCAN RIGHT: ", scanRight);
            let nextState = currentState.current.transitions[scanRight];
            let nextStateObject = sections.logicSection[nextState];
            currentState.current = nextStateObject;
            console.log("TRANSITIONS: ", currentState.current.transitions);
        default:
    }
    // Add inputTape here for times where it gets modified

    return currentIndex + 1;
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
