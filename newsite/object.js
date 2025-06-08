let person = {
    name: "John",
    age: 30,
    greet: function () {
        console.log(`Hello, my name is ${this.name}`);
    }
};

person.greet(); // Hello, my name is John 
let numbers = [1, 2, 3, 4, 5];
console.log(numbers[0]); // 1 numbers.push(6); 
console.log(numbers); // [1, 2, 3, 4, 5, 6]