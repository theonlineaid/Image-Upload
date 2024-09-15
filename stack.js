// Last In, First Out (LIFO) principle 
class Stack {
    constructor() {
        this.items = [];
    }

    // Add an element to the top of the stack
    in(element) {
        this.items.push(element);
    }

    // Remove and return the element from the top of the stack
    out() {
        if (this.blank()) {
            return "Stack is empty";
        }
        return this.items.pop();
    }

    // Return the element at the top of the stack without removing it
    see() {
        if (this.blank()) {
            return "Stack is empty";
        }
        return this.items[this.items.length - 1];
    }

    // Check if the stack is empty
    blank() {
        return this.items.length === 0;
    }

    // Return the number of elements in the stack
    size() {
        return this.items.length;
    }

    // Print the stack
    print() {
        console.log(this.items.toString());
    }
}

// Example usage:
const stack = new Stack();
stack.in(5);
stack.in(10);
stack.in(20);
stack.in(30);

console.log(stack.see()); // Output: 30
console.log(stack.out());  // Output: 30
console.log(stack.size()); // Output: 2
console.log(stack.out()); 
stack.print();            // Output: 10,20
