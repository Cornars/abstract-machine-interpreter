import { EditorState, StateEffect } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { machineState, sections, resetData } from "./state.js";
import { editor as myView } from "./editor.js";
import { parser } from "./parser.js";
import { create as createTape } from "./tape.js";

export function onEditorEdit() {
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
    document.getElementById("singleLineEnd").style.display = "none";
    document.getElementById("singleLineData").style.display = "none";
    document.getElementById("resetButton").style.display = "none";
    document.getElementById("multiLineStart").style.display = "none"
}

export function compileEditor() {
    console.group("Starting Compilation...");
    const errorHandlingArea = document.getElementById("errorHandlingArea");
    try {
        // @ts-ignore
        parser.compileString(myView.state.doc.text, sections, machineState);
        console.table(sections.logicSection)
        console.log(machineState)
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
        document.getElementById("multiLineStart").style.display = "inline-block"
    } catch (error) {
        errorHandlingArea.textContent = `Compile error: ${error.message}`;
        errorHandlingArea.style.color = "red";
        console.log(error)
    }
    console.groupEnd();
}

