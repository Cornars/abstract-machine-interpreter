import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { initializeParser } from "./parser";
import { step } from "./step";

async function main() {
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
        // EditorState set to read only when pressing compile. maybe add an edit button to remove
        // extensions: [basicSetup, EditorState.readOnly.of(true)],
        extensions: [basicSetup],
        parent: document.getElementById("text-editor"),
    });
    let sections = {
        dataSection: {},
        logicSection: {},
    };
    function getTextFromEditor() {
        // TODO: add setting of initial state here
        parser.compileString(myView.state.doc.text, sections, currentState);
        console.log(sections);
        console.log(currentState);
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
        document.getElementById("singleLineEntry").innerHTML = highlightedText;
    }
    function singleLineStep() {
        currentHeadIndex = step(
            sections,
            currentState,
            singleLineInputText,
            currentHeadIndex
        );
        updateHeadHighlight();
    }
    const stepButton = document.getElementById("singleLineStep");
    stepButton.addEventListener("click", singleLineStep);
    const singleLineStartButton = document.getElementById("singleLineStart");
    singleLineStartButton.addEventListener("click", getSingleLineInput);
    // Attach event listener to the compile button
    const compileButton = document.getElementById("compileButton");
    compileButton.addEventListener("click", getTextFromEditor);
}

main();
