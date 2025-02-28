import { EditorView, basicSetup } from "codemirror";
import { compileString } from "./parser";

const initialText = `
	.DATA
	STACK S1
	TAPE T1
	
	.LOGIC
	q0] SCAN (0,q0), (1,q1), (1,accept)
	q1] SCAN (0,q0), (1,q2)
	q2] SCAN (0,q0), (1,q1), (1,accept)
	
	`;

let myView = new EditorView({
	doc: initialText,
	extensions: [basicSetup],
	parent: document.getElementById("text-editor"),
});

const sections = {
	data: {},
	logic: {},
};

const headers = [".DATA", ".LOGIC"];

window.getTextFromEditor = getTextFromEditor;


function getTextFromEditor() {
	sections = compileString(myView.state.doc.text)
};
