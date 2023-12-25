const fs = require("fs")

// Parse the input
const input = fs.readFileSync("input.txt", "utf-8").split("\r\n")
const instructions = input[0]
const nodes = {}
const startNodes = []
const endNodes = []
for (let i = 2; i < input.length; i++) {
  const [node, neighbors] = input[i].split(" = ")
  nodes[node] = neighbors.slice(1, -1).split(", ")
  if (node.endsWith("A")) startNodes.push(node)
  if (node.endsWith("Z")) endNodes.push(node)
}

// Function to navigate the map
function navigateMap(start, endNodes, instructions, nodes) {
  let current = start
  let steps = 0
  let instructionIndex = 0

  while (!endNodes.includes(current)) {
    const direction = instructions[instructionIndex]
    current = nodes[current][direction === "L" ? 0 : 1]
    steps++
    instructionIndex = (instructionIndex + 1) % instructions.length
  }

  return steps
}

// Function to calculate the LCM of an array of numbers
function lcm(numbers) {
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b))
  let result = 1
  for (let number of numbers) {
    result *= number / gcd(result, number)
  }
  return result
}

// Calculate the step count for each start node and find the LCM
const stepCounts = startNodes.map((node) =>
  navigateMap(node, endNodes, instructions, nodes)
)
console.log(lcm(stepCounts))
