// editor.js
import { EditorView, basicSetup } from "codemirror";

export function createEditor(initialText) {
    return new EditorView({
        doc: initialText,
        extensions: [basicSetup],
        parent: document.getElementById("text-editor"),
    });
}
const initialText = `
.DATA
STACK S1
.LOGIC
A] WRITE(S1) (#,B)
B] SCAN (0,C), (1,D)
C] WRITE(S1) (#,B)
D] READ(S1) (#,E)
E] SCAN (1,D), (#,F)
F] READ(S1) (#,accept)
                `;
const initialInfinite =
`
.LOGIC
A] SCAN LEFT (#, B)
B] SCAN LEFT (#, C)
C] SCAN RIGHT (#, A)
`
export const editor = createEditor(initialInfinite)