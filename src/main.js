import {
    onEditorEdit,
    compileEditor,
} from "./eventHandlers.js";
import { runMultiLineInput } from "./multiline.js";
import { onSingleLineReset } from "./singleline.js";
import { singleLineStep, instantEnd } from "./singleline.js";
import { onSingleLineStart } from "./singleline.js";

async function main() {
    document.getElementById("resetButton").addEventListener("click", onSingleLineReset);
    document
        .getElementById("singleLineStart")
        .addEventListener("click", onSingleLineStart);

    document.getElementById("editButton").addEventListener("click", onEditorEdit);
    document
        .getElementById("singleLineStep")
        .addEventListener("click", singleLineStep);

    document
        .getElementById("singleLineEnd")
        .addEventListener("click", instantEnd);
    // Attach event listener to the compile button
    document
        .getElementById("compileButton")
        .addEventListener("click", compileEditor);
    document
        .getElementById("multiLineStart")
        .addEventListener("click", runMultiLineInput);
}
main();
