import { EditorView, basicSetup } from "codemirror";
import { EditorState, StateEffect } from "@codemirror/state";
import { initializeParser } from "./parser";
import { step } from "./step";

async function main() {
    const reconfigureEffect = StateEffect.define();
    let singleLineInputText = "";
    let currentHeadIndex = 0;
    let currentState = { current: undefined };
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
            parser.compileString(myView.state.doc.text, sections, currentState);
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

        singleLineInputText = `#${inputElement.value.trim()}#`;
        let existingElement = document.getElementById(uniqueId);

        if (!existingElement) {
            // If the element does not exist, create it
            existingElement = document.createElement("div");
            existingElement.id = uniqueId;
            singleLineDataDiv.appendChild(existingElement);
        }

        // Update the existing element's content
        existingElement.textContent = singleLineInputText;
        updateHeadHighlight();
    }

    function updateHeadHighlight() {
        if (currentHeadIndex < 0) currentHeadIndex = 0;
        if (currentHeadIndex >= singleLineInputText.length)
            currentHeadIndex = singleLineInputText.length - 1;

        // Apply red color to the character at `currentHeadIndex`
        const highlightedText = singleLineInputText
            .split("")
            .map((char, index) =>
                index === currentHeadIndex
                    ? `<span style="color: red;">${char}</span>`
                    : char
            )
            .join("");
        // document.getElementById("singleLineEntry").innerHTML = highlightedText;
    }
    function singleLineStep() {
        currentHeadIndex = step(
            sections,
            currentState,
            singleLineInputText,
            currentHeadIndex
        );
        updateHeadHighlight();

        console.log(currentState.current);
        // Check for accept/reject state
        if (
            currentState.current === "ACCEPT" ||
            currentState.current === "REJECT"
        ) {
            const singleLineEntry = document.getElementById("singleLineEntry");
            singleLineEntry.style.color =
                currentState.current === "ACCEPT" ? "green" : "red";
            document.getElementById("singleLineStep").disabled = true;
        }
    }
    function onEdit() {
        // Make editor editable
        myView.dispatch({
            effects: StateEffect.reconfigure.of([basicSetup]),
        });

        // Reset single step
        currentHeadIndex = 0;
        updateHeadHighlight();

        // Hide edit button and show compile button
        document.getElementById("editButton").style.display = "none";
        document.getElementById("compileButton").style.display = "inline-block";
        document.getElementById("singleLineStart").style.display = "none";
    }

    function onStart() {
        getSingleLineInput();
        // Show step and reset buttons
        document.getElementById("singleLineStep").style.display =
            "inline-block";
        document.getElementById("resetButton").style.display = "inline-block";
    }

    function onReset() {
        currentHeadIndex = 0;
        currentState.current = undefined;
        singleLineInputText = "";
        document.getElementById("singleLineEntry").textContent = "";
        document.getElementById("singleLineStep").style.display = "none";
        document.getElementById("resetButton").style.display = "none";
        document.getElementById("singleLineStep").disabled = false;
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
