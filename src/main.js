import { EditorView, basicSetup } from "codemirror";
import { initializeParser } from "./parser";

let parser = initializeParser();
async function main() {
    window.getTextFromEditor = getTextFromEditor;
}

const initialText = `.DATA
STACK S1

.LOGIC
MANDINGO

`;
let myView = new EditorView({
    doc: initialText,
    extensions: [basicSetup],
    parent: document.getElementById("text-editor"),
});

let sections = {
    data: {},
    logic: {},
};

function getTextFromEditor() {
    sections = parser.compileString(myView.state.doc.text);
    console.log(myView.state.doc.text.data.split(".LOGIC"));
}

main();
