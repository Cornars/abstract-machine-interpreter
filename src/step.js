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
