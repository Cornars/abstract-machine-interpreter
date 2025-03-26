/// <reference path="../types/globals.d.ts" />
export function create() {
    let queue = [];
    let publicAPI = {
        enqueue(value) {
            console.log(`enqueued ${value}`);
            queue.push(value);
        },
        dequeue() {
            // TODO: MAKE SURE THIS IS RIGHT.
            return queue.shift();
        },
        getFirstElement() {
            return queue[0];
        },
        printData() {
            console.log(queue);
        },
        getData() {
            return queue;
        },
    };
    return publicAPI;
}
