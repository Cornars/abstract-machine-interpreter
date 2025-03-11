import { EditorView, basicSetup } from "codemirror";
import { EditorState, StateEffect } from "@codemirror/state";
import { initializeParser } from "./parser";
import { step } from "./step";

async function main() {
    let machineState = {
        currentState: undefined,
        currentHeadIndex: 0,
        singleLineInputText: "",
        statusMachine: "toCompile",
    };
    const parser = initializeParser();
    const initialText = `.LOGIC
q0] SCAN (0,q2), (2,accept)
q1] SCAN (0,q0), (1,q2)
q2] SCAN (0,q1), (1,q0)
`;
    const myView = new EditorView({
        doc: initialText,
        extensions: [basicSetup],
        parent: document.getElementById("text-editor"),
    });
    let sections = {
        dataSection: {},
        logicSection: {},
    };
    function getTextFromEditor() {
        const errorHandlingArea = document.getElementById("errorHandlingArea");
        try {
            parser.compileString(myView.state.doc.text, sections, machineState);
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
    }

    function getSingleLineInput() {
        const inputElement = document.getElementById("singleLineInput");
        const singleLineDataDiv = document.getElementById("singleLineData");

        if (!singleLineDataDiv) {
            console.error("Missing elements: singleLineData");
            return;
        }

        const uniqueId = "singleLineEntry"; // Unique ID for the element

        machineState.singleLineInputText = `#${inputElement.value.trim()}#`;
        let existingElement = document.getElementById(uniqueId);

        if (!existingElement) {
            // If the element does not exist, create it
            existingElement = document.createElement("div");
            existingElement.id = uniqueId;
            singleLineDataDiv.appendChild(existingElement);
        }

        // Update the existing element's content
        existingElement.textContent = machineState.singleLineInputText;
        updateHeadHighlight();
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
        step(sections, machineState);
        updateHeadHighlight();

        console.log("machine's current state:", machineState.currentState);
        // Check for accept/reject state
        if (
            machineState.currentState === "ACCEPT" ||
            machineState.currentState === "REJECT"
        ) {
            const singleLineEntry = document.getElementById("singleLineEntry");
            singleLineEntry.style.color =
                machineState.currentState === "ACCEPT" ? "green" : "red";
            document.getElementById("singleLineStep").style.display = "none";
        }
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
        parser.compileString(myView.state.doc.text, sections, machineState);
        document.getElementById("singleLineEntry").textContent = "";
        document.getElementById("singleLineEntry").style.color = "black";
        document.getElementById("singleLineStep").style.display = "none";
        document.getElementById("resetButton").style.display = "none";
        document.getElementById("singleLineStep").disabled = false;
        document.getElementById("singleLineStart").style.display =
            "inline-block";
    }

    function resetData() {
        machineState.currentHeadIndex = 0;
        machineState.currentState = undefined;
        machineState.singleLineInputText = "";
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
