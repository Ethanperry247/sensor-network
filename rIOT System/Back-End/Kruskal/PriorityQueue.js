class Element {
    constructor(data, priority) {
        this.data = data;
        this.priority = priority;
    }
}

module.exports = class PriorityQueue {
    constructor() {
        this.elements = [];
        this.length = 0;
    }

    concatenate(queue) {
        this.elements = [...this.elements, ...queue.elements];
        this.length += queue.length;
    }

    enqueue(data, priority) {

        // If the queue is empty, simply add the element.
        if (this.length === 0) {
            this.elements.push(new Element(data, priority));
            this.length++;
            return;
        }

        // If the element has greater priority than the first element, insert at the front.
        if (this.elements[0].priority > priority) {
            this.elements.unshift(new Element(data, priority));
            this.length++;
            return;
        }

        // If the element has smaller priority than the last element, insert at the back.
        if (this.elements[this.elements.length - 1].priority < priority) {
            this.elements.push(new Element(data, priority));
            this.length++;
            return;
        }
        
        // Otherwise, sort appropriately.
        this.elements.every((element, index) => {
            if (element.priority <= priority && this.elements[index + 1] && this.elements[index + 1].priority > priority) {
                this.elements.splice(index + 1, 0, new Element(data, priority));
                this.length++;
                return false;
            }
            return true;
        });
    }

    front() {
        if (this.length === 0) {
            return undefined;
        }
        return this.elements[0];
    }

    dequeue() {
        if (this.length === 0) {
            return undefined;
        }
        return this.elements.shift();
    }

    print() {
        this.elements.forEach(element => {
            console.log(element);
        });
    }

    tojson() {
        return JSON.stringify({
            edges: this.elements.map(element => {
                return {
                    length: element.data.length,
                    points: Array.from(element.data.edge),
                };
            }),
        });
    }
};