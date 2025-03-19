/// <reference path="../types/globals.d.ts" />

export function create() {
    let stack = [];
    let publicAPI = {
        enqueue(value) {
            console.log(`enqueued ${value}`);
            stack.push(value);
        },
        dequeue() {
            return stack.pop();
        },
        getFirstElement() {
            return stack[0];
        },
    };
    return publicAPI;
}
