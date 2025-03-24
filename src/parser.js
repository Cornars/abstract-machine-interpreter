import { create as createStack } from "./stack";
import { create as createQueue } from "./queue";
import { create as createTape } from "./tape";

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
                        machineState.tape = sections.dataSection[name];
                        machineState.isTape = true;
                        console.log(
                            "DATA IN TAPE:",
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
        const stateSplit = state.split(" ");
        const stateName = stateSplit[0].replace("]", "");
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
