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
const tapeCreated = 
`
.DATA
TAPE T1
TAPE T2
.LOGIC
A] SCAN LEFT (#, B)
B] SCAN LEFT (#, C)
C] SCAN RIGHT (#, A) 
`
const movingTapes =
`
.DATA
TAPE T1
.LOGIC
A] RIGHT(T1) (0/X,B), (Y/Y,D), (1/1,reject)
B] RIGHT(T1) (0/0,B), (Y/Y,B), (1/Y,C)
C] LEFT(T1) (0/0,C), (Y/Y,C), (X/X,A)
D] RIGHT(T1) (Y/Y,D), (#/#,accept), (1/1,reject)
`

const two_dtapes =
`
.DATA
2D_TAPE T1
.LOGIC
A] RIGHT(T1) (0/X,B), (Y/Y,D), (1/1,reject)
B] RIGHT(T1) (0/0,B), (Y/Y,B), (1/Y,C)
C] LEFT(T1) (0/0,C), (Y/Y,C), (X/X,A)
D] RIGHT(T1) (Y/Y,D), (#/#,E), (1/1,reject)
E] DOWN(T1) (#/1, E)
`

export const editor = createEditor(two_dtapes)