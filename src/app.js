import { EditorView, basicSetup } from "codemirror";

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

const getTextFromEditor = function () {
  let parsedText = myView.state.doc.text;
  let currentLineIndex = 0
  let currentLineString = parsedText[currentLineIndex]

  // SKIPPING EVERYTHING BEFORE .DATA
  // We shouldn't parse any .LOGIC or .DATA before seeing the first .DATA
  while (!(currentLineString == ".DATA" || currentLineString == ".LOGIC")) {
    // We don't want code before any headers are called out
    if (currentLineString != "") {
      throw "Code before any Headers are written!"
    }
    currentLineIndex++;
    currentLineString = parsedText[currentLineIndex];
  }
  // PARSING .DATA
  if (currentLineString == ".DATA") {
    currentLineIndex++;
    currentLineString = parsedText[currentLineIndex]
    while (currentLineString != ".LOGIC") {
      // TODO: Throw an error for non logic strings. For now I'll do it bruteforce
      if (currentLineString != "") {
        const [dataType, dataName] = currentLineString.split(" ");
        console.log(dataType, dataName)
      }
      currentLineIndex++;
      currentLineString = parsedText[currentLineIndex]
    }
  }

};

window.getTextFromEditor = getTextFromEditor;


