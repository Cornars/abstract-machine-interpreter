import {EditorView, basicSetup} from "codemirror"

const initialText = `.DATA
A] SCAN RIGHT (0, A), (1, B), (#, accept)


.LOGIC
`

let myView = new EditorView({
  doc: initialText,
  extensions: [basicSetup],
  parent: document.getElementById("text-editor")
})


const getTextFromEditor = function (){
    console.log(myView.state.doc.toString());
}
window.getTextFromEditor = getTextFromEditor 
