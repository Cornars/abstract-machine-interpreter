import {EditorView, basicSetup} from "codemirror"

const initialText = `.LOGIC
q0] SCAN (0,q0), (1,q1), (1,accept)
q1] SCAN (0,q0), (1,q2)
q2] SCAN (0,q0), (1,q1), (1,accept)
`

let myView = new EditorView({
  doc: initialText,
  extensions: [basicSetup],
  parent: document.getElementById("text-editor")
})

let text = ""
const getTextFromEditor = function (){
    console.log(myView.state.doc.text);
    text = myView.state.doc.text

  for (let i = 0; i < text.length; i++) {
    const element = text[i];  
    console.log(element)
  }
}
window.getTextFromEditor = getTextFromEditor 

// Get the string before the bracket
// we get the COMMAND
// then, we parse ea  

const sections = {
  'DATA': {},
  'LOGIC': {},
}

