const fs = require("fs")

// HASH algorithm
function hashAlgorithm(str) {
  let value = 0
  for (let i = 0; i < str.length; i++) {
    value += str.charCodeAt(i)
    value *= 17
    value %= 256
  }
  return value
}

// Initialize boxes
const boxes = Array(256)
  .fill(null)
  .map(() => [])

// Read the input
const input = fs.readFileSync("input.txt", "utf8")

// Split the input by commas
const steps = input.split(",")

// Run the HASH algorithm on each step and sum the results
let sum = 0
for (const step of steps) {
  sum += hashAlgorithm(step)
}

console.log(sum)
for (const step of steps) {
  const [label, operation, focalLength] = step
    .match(/(\w+)([-=])(\d*)/)
    .slice(1)
  const boxNumber = hashAlgorithm(label)
  const box = boxes[boxNumber]
  const lensIndex = box.findIndex((lens) => lens.label === label)

  if (operation === "-") {
    if (lensIndex !== -1) {
      box.splice(lensIndex, 1)
    }
  } else {
    const lens = { label, focalLength: Number(focalLength) }
    if (lensIndex !== -1) {
      box[lensIndex] = lens
    } else {
      box.push(lens)
    }
  }
}

// Calculate the focusing power
let focusingPower = 0
for (let i = 0; i < boxes.length; i++) {
  const box = boxes[i]
  for (let j = 0; j < box.length; j++) {
    const lens = box[j]
    focusingPower += (i + 1) * (j + 1) * lens.focalLength
  }
}

console.log(focusingPower)
