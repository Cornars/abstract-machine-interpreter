declare module "global-utils" {
    export function create(): Queue;
    export function create(): Tape;
}

interface MachineState {
    currentState: State;
    currentHeadIndex: number;
    singleLineInputText: Tape;
    singleLineOutputText: string;
    firstTapeName: string;
    isTape: boolean;
    is2DTape: boolean;
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

interface Tape{
    initializeTape:(inputString: string) => void;
    moveLeft: (isRead: boolean, rewriteValue?: string, ) => string;
    moveRight: (isRead: boolean, rewriteValue?: string, ) => string;
    printData(): void;
    getData(): string;
    getPointerIndex(): number;
    resetTape(): void;
    rewritePointer(rewriteValue: string): void;
}

