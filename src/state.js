import { create as createTape } from "./tape";

/** @type {MachineState} */
export const machineState = {
    currentState: undefined,
    currentHeadIndex: 0,
    singleLineInputText: createTape(),
    firstTapeName: "",
    singleLineOutputText: "",
    isTape: false,
    is2DTape: false,
};

/** @type {Sections} */
export const sections = {
    dataSection: {},
    logicSection: {
        accept: {
            stateName: "accept",
            command: "HALT",
            transitions: undefined,
        },
        reject: {
            stateName: "reject",
            command: "HALT",
            transitions: undefined,
        },
    },
};
