const my_array = [7, 12, 9, 4, 11]
let minVal = my_array[0]

for (i in my_array) {
    if (my_array[i] < minVal) {
        minVal = my_array[i]
    }
}

console.log(minVal)

console.log(Math.min(...my_array))


// const myArray = ["Apple", "banana", "Cherry", "Date", "Elderberry"];
// const target = "cherry";  // The string you're searching for

// // Normalize the case for comparison and search
// const foundIndex = myArray.findIndex(
//   (item) => item.toLowerCase() === target.toLowerCase()
// );

// if (foundIndex !== -1) {
//   console.log(`Found '${target}' at index ${foundIndex}`);
// } else {
//   console.log(`'${target}' not found in the array`);
// }


const myArray = ["Apple", "banana", "Cherry", "Date", "Elderberry"];
const lowerCaseArray = myArray.map(item => item.toLowerCase());

const target = "cherry";
const foundIndex = lowerCaseArray.indexOf(target.toLowerCase());

console.log(foundIndex !== -1 ? `Found at '${target}' index ${foundIndex}` : 'Not found');


