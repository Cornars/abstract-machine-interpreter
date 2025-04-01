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
    
    // Handle 2D tape
    if (machineState.is2DTape) {
        const tapeData = inputText.getData(); // This returns a 2D array
        const pointerPos = inputText.getPointerPosition();
        
        // Convert 2D array to string representation with pointer highlight
        let highlightedText = '';
        for (let y = 0; y < tapeData.length; y++) {
            const row = tapeData[y];
            for (let x = 0; x < row.length; x++) {
                const char = row[x];
                if (x === pointerPos.x && y === pointerPos.y) {
                    highlightedText += `<span style="color: red;">${char}</span>`;
                } else {
                    highlightedText += char;
                }
            }
            highlightedText += '<br>'; // Add line break between rows
        }
        document.getElementById("singleLineEntry").innerHTML = highlightedText;
    } 
    // Handle regular tape
    else {
        const tapeString = inputText.getData(); // This returns a string
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
