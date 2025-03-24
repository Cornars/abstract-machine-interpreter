import { EditorView, basicSetup } from "codemirror";
import { EditorState, StateEffect } from "@codemirror/state";
import { initializeParser } from "./parser";
import { step } from "./step";

/// <reference path="../types/globals.d.ts" />

async function main() {
    /** @type {MachineState} */
    let machineState = {
        currentState: undefined,
        currentHeadIndex: 0,
        singleLineInputText: "",
        singleLineOutputText: "",
    };
    const parser = initializeParser();
    // RANDOM:
//     const initialText = `.LOGIC
// q0] SCAN (0,p2), (1, q1), (2,accept)
// q1] SCAN (0,p0), (1,p2), (2, q2)
// q2] SCAN LEFT (0,q1), (1,p0), (2, q0)

// p0] PRINT (B, q0)
// p1] PRINT (A, q1)
// p2] PRINT (C, q2)`;
    // SCAN alone
    //     const initialText = `.LOGIC
    // q0] SCAN (0,q2), (2,accept)
    // q1] SCAN (0,q0), (1,q2)
    // q2] SCAN (0,q1), (1,q0)
    // `;
    // const initialText = `.LOGIC
    // q0] SCAN (0,p2), (2,accept)
    // q1] SCAN (0,p0), (1,p2)
    // q2] SCAN (0,q1), (1,p0)

    // p0] PRINT (B, q0)
    // p1] PRINT (A, q1)
    // p2] PRINT (C, q2)
    // `;

    const initialText = `
.DATA
STACK S1
.LOGIC
A] WRITE(S1) (#,B)
B] SCAN (0,C), (1,D)
C] WRITE(S1) (#,B)
D] READ(S1) (#,E)
E] SCAN (1,D), (#,F)
F] READ(S1) (#,accept)
                `;
    const myView = new EditorView({
        doc: initialText,
        extensions: [basicSetup],
        parent: document.getElementById("text-editor"),
    });
    /** @type {Sections} */
    let sections = {
        dataSection: {},
        logicSection: {
            accept: {
                stateName: "accept",
                command: "HALT",
                transitions: undefined,
            },
            reject: {
                stateName: "reject",
                command: "HALT",
                transitions: undefined,
            },
        },
    };
    function getTextFromEditor() {
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

    function getSingleLineInput() {
        const inputElement = document.getElementById("singleLineInput");
        const singleLineDataDiv = document.getElementById("singleLineData");

        if (!singleLineDataDiv) {
            console.error("Missing elements: singleLineData");
            return;
        }

        // @ts-ignore
        machineState.singleLineInputText = `#${inputElement.value.trim()}#`;

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
        existingInputElement.textContent = machineState.singleLineInputText;
        updateHeadHighlight();
        updateOutputString();
    }

    function updateOutputString() {
        const outputID = "singleLineOutput"; // Unique ID for the output element
        let existingOutputElement = document.getElementById(outputID);
        existingOutputElement.textContent = machineState.singleLineOutputText;
    }

    function updateHeadHighlight() {
        if (machineState.currentHeadIndex < 0)
            machineState.currentHeadIndex = 0;
        if (
            machineState.currentHeadIndex >=
            machineState.singleLineInputText.length
        )
            machineState.currentHeadIndex =
                machineState.singleLineInputText.length - 1;

        // Apply red color to the character at `machineState.currentHeadIndex`
        const highlightedText = machineState.singleLineInputText
            .split("")
            .map((char, index) =>
                index === machineState.currentHeadIndex
                    ? `<span style="color: red;">${char}</span>`
                    : char
            )
            .join("");
        document.getElementById("singleLineEntry").innerHTML = highlightedText;
    }
    function singleLineStep() {
        console.group("Stepping")
        step(sections, machineState);
        updateHeadHighlight();
        updateOutputString();
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
    }
    function onEdit() {
        // Make editor editable
        myView.dispatch({
            effects: StateEffect.reconfigure.of([basicSetup]),
        });

        resetData();
        const errorHandlingArea = document.getElementById("errorHandlingArea");
        errorHandlingArea.textContent = "Compile when ready...";
        errorHandlingArea.style.color = "black";
        // Hide edit button and show compile button
        document.getElementById("editButton").style.display = "none";
        document.getElementById("compileButton").style.display = "inline-block";
        document.getElementById("singleLineStart").style.display = "none";
        document.getElementById("singleLineStep").style.display = "none";
        document.getElementById("singleLineData").style.display = "none";
        document.getElementById("resetButton").style.display = "none";
    }

    function onStart() {
        getSingleLineInput();
        // Show step and reset buttons
        document.getElementById("singleLineStep").style.display =
            "inline-block";
        document.getElementById("singleLineData").style.display = "";
        document.getElementById("singleLineStart").style.display = "none";
        document.getElementById("resetButton").style.display = "inline-block";
    }

    function onReset() {
        resetData();
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
        document.getElementById("singleLineStart").style.display =
            "inline-block";
    }

    function resetData() {
        machineState.currentHeadIndex = 0;
        machineState.currentState = undefined;
        machineState.singleLineInputText = "";
        machineState.singleLineOutputText = "";
    }
    document.getElementById("resetButton").addEventListener("click", onReset);
    document
        .getElementById("singleLineStart")
        .addEventListener("click", onStart);

    document.getElementById("editButton").addEventListener("click", onEdit);
    document
        .getElementById("singleLineStep")
        .addEventListener("click", singleLineStep);

    document
        .getElementById("singleLineStart")
        .addEventListener("click", getSingleLineInput);
    // Attach event listener to the compile button
    document
        .getElementById("compileButton")
        .addEventListener("click", getTextFromEditor);
}

main();
