const fs = require("fs")

// Parse the input
const input = fs.readFileSync("input.txt", "utf-8").split("\r\n")
const instructions = input[0]
const nodes = {}
for (let i = 2; i < input.length; i++) {
  const [node, neighbors] = input[i].split(" = ")
  nodes[node] = neighbors.slice(1, -1).split(", ")
}

// Function to navigate the map
function navigateMap(start, end, instructions, nodes) {
  let current = start
  let steps = 0
  let instructionIndex = 0

  while (current !== end) {
    const direction = instructions[instructionIndex]
    current = nodes[current][direction === "L" ? 0 : 1]
    steps++
    instructionIndex = (instructionIndex + 1) % instructions.length
  }

  return steps
}

console.log(navigateMap("AAA", "ZZZ", instructions, nodes))
