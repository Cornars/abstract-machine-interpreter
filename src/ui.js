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
    // if (machineState.currentHeadIndex < 0) machineState.currentHeadIndex = 0;
    // if (
    //     machineState.currentHeadIndex >= machineState.singleLineInputText.length
    // )
    //     machineState.currentHeadIndex =
    //         machineState.singleLineInputText.length - 1;

    const highlightedText = machineState.singleLineInputText.getData()
        .split("")
        .map((char, index) =>
            index === machineState.singleLineInputText.getPointerIndex()
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
            const newData = `${key}: ${sections.dataSection[key].getData()}`;

            if (!sectionElement) {
                sectionElement = document.createElement("div");
                sectionElement.id = sectionID;
                sectionElement.textContent = newData;
                singleLineDataDiv.appendChild(sectionElement);
            } else if (sectionElement.textContent !== newData) {
                sectionElement.textContent = newData;
            }
        });
    }
}
