import { create as createStack } from "./stack";
import { create as createQueue } from "./queue";
/**
 * Compiles the string. returns an Object with that looks like:
 * ```javascript
 * const sections = {
 *   data: {},
 *   logic: {},
 * };
 * ```
*/
export function compileString(editorText) {
    let sections = {
        data: {},
        logic: {},
    }
    let currentLineIndex = 0
    let currentLineString = editorText[currentLineIndex]

    // SKIPPING EVERYTHING BEFORE .DATA
    // We shouldn't parse any .LOGIC or .DATA before seeing the first .DATA
    while (!(currentLineString == ".DATA" || currentLineString == ".LOGIC")) {
        // We don't want code before any headers are called out
        if (currentLineString != "") {
            throw "Code before any Headers are written!"
        }
        currentLineIndex++;
        currentLineString = editorText[currentLineIndex];
    }
    // PARSING .DATA
    if (currentLineString == ".DATA") {
        currentLineIndex++;
        currentLineString = editorText[currentLineIndex]
        while (currentLineString != ".LOGIC") {
            // TODO: Throw an error for non logic strings. For now I'll do it bruteforce
            if (currentLineString != "") {
                const [dataType, dataName] = currentLineString.split(" ");
                switch (dataType) {
                    case "STACK":
                        sections.data[dataName] = createStack();
                        break;
                    case "QUEUE":
                        sections.data[dataName] = createQueue();
                        break;
                }
            }
            currentLineIndex++;
            currentLineString = editorText[currentLineIndex]
        }
    }
    console.log(sections)
    return sections
}
