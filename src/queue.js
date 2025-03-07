export function create() {
    let queue = [];
    let isQueueEmpty = () => queue == undefined || queue == 0;
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
