import {
    onReset,
    onEdit,
    getTextFromEditor,
} from "./eventHandlers.js";
import { singleLineStep, instantEnd } from "./singleline.js";
import { onSingleLineStart } from "./singleline.js";

async function main() {
    document.getElementById("resetButton").addEventListener("click", onReset);
    document
        .getElementById("singleLineStart")
        .addEventListener("click", onSingleLineStart);

    document.getElementById("editButton").addEventListener("click", onEdit);
    document
        .getElementById("singleLineStep")
        .addEventListener("click", singleLineStep);

    document
        .getElementById("singleLineEnd")
        .addEventListener("click", instantEnd);
    // Attach event listener to the compile button
    document
        .getElementById("compileButton")
        .addEventListener("click", getTextFromEditor);
}
main();
