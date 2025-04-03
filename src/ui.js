/// <reference path="../types/globals.d.ts" />

import { machineState, sections } from "./state.js";

export function updateUI() {
    updateDataTypes();
    updateOutputString();
    updateHeadHighlight();
}

function updateOutputString() {
    document.getElementById("singleLineOutput").textContent =
        machineState.singleLineOutputText;
}

function updateHeadHighlight() {
    const inputText = machineState.singleLineInputText;
    const tapeString = inputText.getFormattedData(); // This returns a string
    const highlightedText = tapeString
        .split("")
        .map((char, index) =>
            index === inputText.getPointerIndex()
                ? `<span style="color: red;">${char}</span>`
                : char
        )
        .join("");
    document.getElementById("singleLineEntry").innerHTML = highlightedText;
}

function updateDataTypes() {
    if (sections && sections.dataSection) {
        const singleLineDataDiv = document.getElementById("singleLineData");
        Object.keys(sections.dataSection).forEach((key) => {
            const sectionID = `section-${key}`;
            let sectionElement = document.getElementById(sectionID);
            const newData = `${key}:<br>${sections.dataSection[
                key
            ].getFormattedData()}`;
            if (!sectionElement) {
                sectionElement = document.createElement("div");
                sectionElement.id = sectionID;
                sectionElement.innerHTML = newData;
                singleLineDataDiv.appendChild(sectionElement);
            } else if (sectionElement.textContent !== newData) {
                sectionElement.innerHTML = newData;
            }
        });
    }
}
