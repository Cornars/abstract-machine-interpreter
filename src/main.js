import {
    onReset,
    onEdit,
    onStart,
    singleLineStep,
    getSingleLineInput,
    getTextFromEditor,
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
        .getElementById("singleLineStart")
        .addEventListener("click", getSingleLineInput);
    // Attach event listener to the compile button
    document
        .getElementById("compileButton")
        .addEventListener("click", getTextFromEditor);
}
main();
