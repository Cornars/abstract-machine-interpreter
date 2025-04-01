import { create as createStack } from "./stack";
import { create as createQueue } from "./queue";
import { create as createTape } from "./tape";
import { create as create2DTape } from "./2dtape"

/// <reference path="../types/globals.d.ts" />

/**
 *
 * @param {Array} editorArray - should be an array from myView.state.doc.text
 * @param {Sections} sections
 */
const compileString = function (editorArray, sections, machineState) {
    // I worked on this code thinking it'll be a big text :(
    const editorText = editorArray.join("\n");
    // Split text into sections by finding the .DATA and .LOGIC keywords
    const dataSectionRegex = /\.DATA([\s\S]+?)\.LOGIC/;
    const matchData = editorText.match(dataSectionRegex);
    console.group("parsing .DATA");
    // Get the .data section
    if (matchData) {
        const dataSectionText = matchData[1].trim().split("\n");

        dataSectionText.forEach((dataVariable) => {
            const [varType, name] = dataVariable.split(" ");
            // TODO: make sure the varType is a data type
            console.log("DATA TYPE: ", varType);
            switch (varType) {
                case "QUEUE":
                    sections.dataSection[name] = createQueue();
                    console.log("queue created named: ", name);
                    break;
                case "STACK":
                    console.log("stack created named: ", name);
                    sections.dataSection[name] = createStack();
                    break;
                case "TAPE":
                    console.log("tape created named: ", name);
                    /** @type {Tape} */
                    sections.dataSection[name] = createTape();
                    if (!machineState.isTape) {
                        machineState.singleLineInputText = sections.dataSection[name];
                        machineState.isTape = true;
                        console.log(
                            "DATA IN TAPE:",
                            sections.dataSection[name].getData()
                        );
                    }
                    break;
                case "2D_TAPE":
                    console.log("2D tape created named: ", name);
                    sections.dataSection[name] = create2DTape();
                    if (!machineState.is2DTape) {
                        machineState.singleLineInputText = sections.dataSection[name];
                        machineState.is2DTape = true;
                        machineState.isTape = true; // Mark as tape as well for compatibility
                        console.log(
                            "DATA IN 2D TAPE:",
                            sections.dataSection[name].getData()
                        );
                    }
                    break;
                default:
                    sections.dataSection[name] = varType;
                    console.log("DEFAULT, NO ASSIGNMENT");
                    break;
            }
        });
    }

    console.groupEnd();
    console.group("parsing .LOGIC");
    const logicSectionText = editorText.split(".LOGIC")[1].trim().split("\n");
    logicSectionText.forEach((state, index) => {
        // skip no line states
        if (!state) return;
        const stateSplit = state.split(/\s+/).map(s => s.trim());
        const stateName = stateSplit[0].replace("]", "").trim();
        // Detect two-word commands
        let command = stateSplit[1];
        if (stateSplit.length > 2 && /^[A-Z]+$/.test(stateSplit[2])) {
            command += " " + stateSplit[2]; // Combine two-word commands
        }
        const transitionText = stateSplit.slice(command.split(" ").length + 1);
        if (transitionText.length == 0)
            throw Error(`No transition states found for state ${state}`);
        const transitions = Object.fromEntries(
            transitionText
                .join(" ") // Join the rest
                .match(/\((.*?)\)/g) // Extract content inside parentheses
                .map((pair) => pair.replace(/[()]/g, "").split(",")) // Clean and split
        );
        sections.logicSection[stateName] = {};
        sections.logicSection[stateName].stateName = stateName.trim();
        sections.logicSection[stateName].command = command.trim();
        sections.logicSection[stateName].transitions = transitions;
        // set start state
        if (index == 0)
            machineState.currentState = sections.logicSection[stateName];
    });
    console.groupEnd();
};

export function initializeParser() {
    let publicAPI = {
        compileString,
    };
    return publicAPI;
}
export const parser = initializeParser();
