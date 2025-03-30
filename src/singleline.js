
/// <reference path="../types/globals.d.ts" />
import { sections, machineState } from "./state";
import { step } from "./step";
import { updateUI } from "./ui";



export function onSingleLineStart() {
    document.getElementById("singleLineStep").style.display = "inline-block";
    document.getElementById("singleLineEnd").style.display = "inline-block";
    document.getElementById("singleLineData").style.display = "";
    document.getElementById("singleLineStart").style.display = "none";
    document.getElementById("resetButton").style.display = "inline-block";
    getSingleLineInput();

}export function singleLineStep() {
    console.group("Stepping");
    step(sections, machineState);
    console.log("machine's current state:", machineState.currentState);
    // Check for accept/reject state
    if (machineState.currentState.stateName === "accept" ||
        machineState.currentState.stateName === "reject") {
        const singleLineEntry = document.getElementById("singleLineEntry");
        singleLineEntry.style.color =
            machineState.currentState.stateName === "accept"
                ? "green"
                : "red";
        document.getElementById("singleLineStep").style.display = "none";
        document.getElementById("singleLineEnd").style.display = "none";
    }
    document.getElementById(
        "singleLineCurrentState"
    ).textContent = `current state: ${machineState.currentState.stateName}`;
    console.groupEnd();
    updateUI();
}
export function getSingleLineInput() {
    const inputElement = document.getElementById("singleLineInput");
    const singleLineDataDiv = document.getElementById("singleLineData");

    if (!singleLineDataDiv) {
        console.error("Missing elements: singleLineData");
        return;
    }

    // @ts-ignore
    // machineState.singleLineInputText = `#${inputElement.value.trim()}#`;
    machineState.singleLineInputText.initializeTape(inputElement.value.trim());

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
    existingInputElement.textContent = machineState.singleLineInputText.getData();

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
            console.log("sections datasecion:", sections.dataSection[key]);
            sectionElement.textContent = `${key}: ${sections.dataSection[key].getData()}`;
        });
    }
    updateUI();
}

export function instantEnd() {
    while (!(machineState.currentState.stateName == "reject" || machineState.currentState.stateName == "accept")) {
        singleLineStep();
    }
}

