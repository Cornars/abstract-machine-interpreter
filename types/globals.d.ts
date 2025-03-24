declare module "global-utils" {
    export function create(): Queue;
}

interface MachineState {
    currentState: State;
    currentHeadIndex: number;
    singleLineInputText: string;
    singleLineOutputText: string;
}

interface Sections {
    dataSection: DataSection;
    logicSection: LogicSection;
}

interface DataSection {
    // data?: Record<string, Stack | Queue | Tape>;
    data?: Record<string, string>;
}

interface LogicSection {
    states?: Record<string, State>;
    accept: State;
    reject: State;
}

interface State {
    stateName: string;
    command: string;
    transitions: Object<string, string>;
}

interface Queue {
    enqueue(value: string): void;
    dequeue(): string;
    getFirstElement(): string;
}
interface Stack {
    enqueue(value: string): void;
    dequeue(): string;
    getFirstElement(): string;
}

