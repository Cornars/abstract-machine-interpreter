import { EditorState, StateEffect } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { machineState, sections } from "./state.js";
import { editor as myView } from "./editor.js";
import { step } from "./step.js";
import { parser } from "./parser.js";
import { updateUI } from "./ui.js";
import { create as createTape } from "./tape.js";
// eventHandlers.js
export function onReset() {
    machineState.currentHeadIndex = 0;
    machineState.currentState = undefined;
    machineState.singleLineInputText = createTape();
    machineState.singleLineOutputText = "";
    sections.dataSection = {};

    // removes all the section-ids
    document
        .querySelectorAll("[id^='section-']")
        .forEach((element) => element.remove());

    // Recompile
    // @ts-ignore
    parser.compileString(myView.state.doc.text, sections, machineState);

    document.getElementById("singleLineEntry").textContent = "";
    document.getElementById("singleLineOutput").textContent = "";
    document.getElementById("singleLineCurrentState").textContent = "";
    document.getElementById("singleLineEntry").style.color = "black";
    document.getElementById("singleLineStep").style.display = "none";
    document.getElementById("resetButton").style.display = "none";
    // @ts-ignore
    document.getElementById("singleLineStep").disabled = false;
    document.getElementById("singleLineStart").style.display = "inline-block";
    updateUI();
}

export function onEdit() {
    myView.dispatch({
        effects: StateEffect.reconfigure.of([basicSetup]),
    });

    resetData();
    const errorHandlingArea = document.getElementById("errorHandlingArea");
    errorHandlingArea.textContent = "Compile when ready...";
    errorHandlingArea.style.color = "black";

    document.getElementById("editButton").style.display = "none";
    document.getElementById("compileButton").style.display = "inline-block";
    document.getElementById("singleLineStart").style.display = "none";
    document.getElementById("singleLineStep").style.display = "none";
    document.getElementById("singleLineData").style.display = "none";
    document.getElementById("resetButton").style.display = "none";
    updateUI()
}

export function onStart() {
    document.getElementById("singleLineStep").style.display = "inline-block";
    document.getElementById("singleLineData").style.display = "";
    document.getElementById("singleLineStart").style.display = "none";
    document.getElementById("resetButton").style.display = "inline-block";
    getSingleLineInput();
}

export function getTextFromEditor() {
    console.group("Starting Compilation...");
    const errorHandlingArea = document.getElementById("errorHandlingArea");
    try {
        // @ts-ignore
        parser.compileString(myView.state.doc.text, sections, machineState);
        console.log("COMPILED:", sections, machineState);
        errorHandlingArea.textContent = "Compile complete";
        errorHandlingArea.style.color = "green";
        // Make editor read-only
        myView.dispatch({
            effects: StateEffect.reconfigure.of([
                basicSetup,
                EditorState.readOnly.of(true), // Add read-only extension
            ]),
        });
        // Hide compile button and show edit button
        document.getElementById("compileButton").style.display = "none";
        document.getElementById("editButton").style.display =
            "inline-block";
        document.getElementById("singleLineStart").style.display =
            "inline-block";
    } catch (error) {
        errorHandlingArea.textContent = `Compile error: ${error.message}`;
        errorHandlingArea.style.color = "red";
    }
    console.groupEnd();
}
export function singleLineStep() {
    console.group("Stepping");
    step(sections, machineState);
    console.log("machine's current state:", machineState.currentState);
    // Check for accept/reject state
    if (
        machineState.currentState.stateName === "accept" ||
        machineState.currentState.stateName === "reject"
    ) {
        const singleLineEntry = document.getElementById("singleLineEntry");
        singleLineEntry.style.color =
            machineState.currentState.stateName === "accept"
                ? "green"
                : "red";
        document.getElementById("singleLineStep").style.display = "none";
    }
    document.getElementById(
        "singleLineCurrentState"
    ).textContent = `current state: ${machineState.currentState.stateName}`;
    console.groupEnd();
    updateUI();
}
function getSingleLineInput() {
    const inputElement = document.getElementById("singleLineInput");
    const singleLineDataDiv = document.getElementById("singleLineData");

    if (!singleLineDataDiv) {
        console.error("Missing elements: singleLineData");
        return;
    }

    // @ts-ignore
    // machineState.singleLineInputText = `#${inputElement.value.trim()}#`;
    machineState.singleLineInputText.initializeTape(inputElement.value.trim())

    const inputID = "singleLineEntry"; // Unique ID for the element
    let singleLineCurrentState = document.getElementById(
        "singleLineCurrentState"
    );
    if (!singleLineCurrentState) {
        singleLineCurrentState = document.createElement("div");
        singleLineCurrentState.id = "singleLineCurrentState";
        singleLineDataDiv.appendChild(singleLineCurrentState);
    }
    let existingInputElement = document.getElementById(inputID);
    if (!existingInputElement) {
        // If the element does not exist, create it
        existingInputElement = document.createElement("div");
        existingInputElement.id = inputID;
        singleLineDataDiv.appendChild(existingInputElement);
    }
    singleLineCurrentState.textContent = `current state: ${machineState.currentState.stateName}`;

    const outputID = "singleLineOutput"; // Unique ID for the output element
    let existingOutputElement = document.getElementById(outputID);
    if (!existingOutputElement) {
        // If the element does not exist, create it
        existingOutputElement = document.createElement("div");
        existingOutputElement.id = outputID;
        singleLineDataDiv.appendChild(existingOutputElement);
    }

    existingOutputElement.textContent = machineState.singleLineOutputText;
    existingInputElement.textContent = machineState.singleLineInputText.getDataString();

    // Create sections for each key in sections.dataSection
    if (sections && sections.dataSection) {
        Object.keys(sections.dataSection).forEach((key) => {
            const sectionID = `section-${key}`;
            console.log("section-id: ", sectionID);
            let sectionElement = document.getElementById(sectionID);

            if (!sectionElement) {
                sectionElement = document.createElement("div");
                sectionElement.id = sectionID;
                singleLineDataDiv.appendChild(sectionElement);
            }

            // Set text content in one line
            console.log("sections datasecion:", sections.dataSection[key])
            sectionElement.textContent = `${key}: ${sections.dataSection[
                key
            ].getData()}`;
        });
    }
    updateUI();
}

function resetData() {
    machineState.currentHeadIndex = 0;
    machineState.currentState = undefined;
    machineState.singleLineInputText = createTape();
    machineState.singleLineOutputText = "";
    sections.dataSection = {};
}