export function create() {
    let stack = [];
    let isStackEmpty = () => (stack == undefined || stack == 0)
    let publicAPI = {
        enqueue(value) {
            console.log(`enqueued ${value}`)
            stack.push(value)
        },
        dequeue() {
            return stack.pop()
        },
        getFirstElement() {
            return stack[0]
        }
    };
    return publicAPI;
}
