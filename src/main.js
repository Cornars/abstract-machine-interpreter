import { EditorView, basicSetup } from "codemirror";
import { initializeParser } from "./parser";

async function main() {
    const parser = initializeParser();
    const initialText = `.DATA
STACK S1

.LOGIC
A] WRITE(S1) (#,B)
B] SCAN (0,C), (1,D)
C] WRITE(S1) (#,B)
D] READ(S1) (#,E)
E] SCAN (1,D), (#,F)
F] READ(S1) (#,accept)
MANDINGO

`;
    const myView = new EditorView({
        doc: initialText,
        extensions: [basicSetup],
        parent: document.getElementById("text-editor"),
    });

    let sections = {
        data: {},
        logic: {},
    };
    function getTextFromEditor() {
        parser.compileString(myView.state.doc.text, sections);
    }

    let singleLineInputText = "";
    let currentHeadIndex = 0;
    function getSingleLineInput() {
        const inputElement = document.getElementById("singleLineInput");
        const singleLineDataDiv = document.getElementById("singleLineData");

        if (!singleLineDataDiv) {
            console.error("Missing elements: singleLineData");
            return;
        }

        const uniqueId = "singleLineEntry"; // Unique ID for the element

        singleLineInputText = `#${inputElement.value.trim()}#`;
        let existingElement = document.getElementById(uniqueId);

        if (!existingElement) {
            // If the element does not exist, create it
            existingElement = document.createElement("div");
            existingElement.id = uniqueId;
            singleLineDataDiv.appendChild(existingElement);
        }

        // Update the existing element's content
        existingElement.textContent = singleLineInputText;
        updateHeadHighlight();
    }

    function updateHeadHighlight() {
        if (currentHeadIndex < 0) currentHeadIndex = 0;
        if (currentHeadIndex >= singleLineInputText.length)
            currentHeadIndex = singleLineInputText.length - 1;

        // Apply red color to the character at `currentHeadIndex`
        const highlightedText = singleLineInputText
            .split("")
            .map((char, index) =>
                index === currentHeadIndex
                    ? `<span style="color: red;">${char}</span>`
                    : char
            )
            .join("");
        document.getElementById("singleLineEntry").innerHTML = highlightedText;
    }
    const singleLineStartButton = document.getElementById("singleLineStart");
    singleLineStartButton.addEventListener("click", getSingleLineInput);
    // Attach event listener to the compile button
    const compileButton = document.getElementById("compileButton");
    compileButton.addEventListener("click", getTextFromEditor);
}

main();

/*
import { EditorView, basicSetup } from "codemirror";

const initialText = `
.DATA
STACK S1
TAPE T1
.LOGIC
q0] SCAN (0,q0), (1, q1), (1,accept)
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
    let currentLineIndex = 0;
    let currentLineString = parsedText[currentLineIndex];

    // SKIPPING EVERYTHING BEFORE .DATA
    // We shouldn't parse any .LOGIC or .DATA before seeing the first .DATA
    while (!(currentLineString == ".DATA" || currentLineString == ".LOGIC")) {
        // We don't want code before any headers are called out
        if (currentLineString != "") {
            throw "Code before any Headers are written!";
        }
        currentLineIndex++;
        currentLineString = parsedText[currentLineIndex];
    }
    // PARSING .DATA
    if (currentLineString == ".DATA") {
        currentLineIndex++;
        currentLineString = parsedText[currentLineIndex];
        while (currentLineString != ".LOGIC") {
            // TODO: Throw an error for non logic strings. For now I'll do it bruteforce
            if (currentLineString != "") {
                const [dataType, dataName] = currentLineString.split(" ");
                console.log(dataType, dataName);
            }
            currentLineIndex++;
            currentLineString = parsedText[currentLineIndex];
        }
    }
};

window.getTextFromEditor = getTextFromEditor;

// Split text into sections by finding the .DATA and .LOGIC keywords
const dataSectionRegex = /\.DATA([\s\S]+?)\.LOGIC/;

const matchData = initialText.match(dataSectionRegex);
// Get the .data section
if (matchData) {
    const dataSectionText = matchData[1].trim().split("\n");

    dataSectionText.forEach((dataVariable) => {
        const [varType, name] = dataVariable.split(" ");
        // TODO: make sure the varType is a data type
        sections.data[name] = varType;
    });
}

const logicSectionText = initialText.split(".LOGIC")[1].trim().split("\n");
logicSectionText.forEach((state) => {
    if (!state) return;
    const stateSplit = state.split(" ");
    const stateName = stateSplit[0].replace("]", "");
    const command = stateSplit[1];
    const transitions = stateSplit
        .slice(2)
        .join(" ") // Join the rest
        .match(/\((.*?)\)/g) // Extract content inside parentheses
        .map((pair) => pair.replace(/[()]/g, "").split(",")); // Clean and split
    console.log(stateName, command, transitions);
});


*/
