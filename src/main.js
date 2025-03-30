import {
    onReset,
    onEdit,
    onStart,
    singleLineStep,
    getTextFromEditor,
    instantEnd,
} from "./eventHandlers.js";

async function main() {
    document.getElementById("resetButton").addEventListener("click", onReset);
    document
        .getElementById("singleLineStart")
        .addEventListener("click", onStart);

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
