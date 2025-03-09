import { create as createStack } from "./stack";
import { create as createQueue } from "./queue";
/**
 * Compiles the string. returns an Object with that looks like:
 * ```javascript
 * const sections = {
 *   data: {},
 *   logic: {},
 * };
 * ```
 */
const commands = [
    "SCAN LEFT",
    "SCAN RIGHT",
    "SCAN",
    "PRINT",
    "READ([a-zA-Z0-9_]{1,})",
    "WRITE([a-zA-Z0-9_]{1,})",
    "RIGHT([a-zA-Z0-9_]{1,})",
    "LEFT([a-zA-Z0-9_]{1,})",
    "UP([a-zA-Z0-9_]{1,})",
    "DOWN([a-zA-Z0-9_]{1,})",
];

/**
 *
 * @param {Array} editorArray - should be an array from myView.state.doc.text
 * @param {Object} sections
 */
const compileString = function (editorArray, sections, currentState) {
    // I worked on this code thinking it'll be a big text :(
    const editorText = editorArray.join("\n");
    // Split text into sections by finding the .DATA and .LOGIC keywords
    const dataSectionRegex = /\.DATA([\s\S]+?)\.LOGIC/;
    const matchData = editorText.match(dataSectionRegex);
    // Get the .data section
    if (matchData) {
        const dataSectionText = matchData[1].trim().split("\n");

        dataSectionText.forEach((dataVariable) => {
            const [varType, name] = dataVariable.split(" ");
            // TODO: make sure the varType is a data type
            sections.dataSection[name] = varType;
        });
    }

    const logicSectionText = editorText.split(".LOGIC")[1].trim().split("\n");
    logicSectionText.forEach((state) => {
        // skip no line states
        if (!state) return;
        const stateSplit = state.split(" ");
        const stateName = stateSplit[0].replace("]", "");
        const command = stateSplit[1];
        const transitionText = stateSplit.slice(2);
        if (transitionText.length == 0)
            throw Error(`No transition states found for state ${state}`);
        const transitions = Object.fromEntries(
            transitionText
                .join(" ") // Join the rest
                .match(/\((.*?)\)/g) // Extract content inside parentheses
                .map((pair) => pair.replace(/[()]/g, "").split(",")) // Clean and split
        );
        sections.logicSection[stateName] = {};
        sections.logicSection[stateName].command = command;
        sections.logicSection[stateName].transitions = transitions;
    });
    console.log(sections);
};

export function initializeParser() {
    let publicAPI = {
        compileString,
    };
    return publicAPI;
}
