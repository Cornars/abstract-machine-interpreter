/// <reference path="../types/globals.d.ts" />
export function create() {
    let queue = [];
    let publicAPI = {
        enqueue(value) {
            console.log(`enqueued ${value}`);
            queue.push(value);
        },
        dequeue() {
            return queue.pop(0);
        },
        getFirstElement() {
            return queue[0];
        },
    };
    return publicAPI;
}
