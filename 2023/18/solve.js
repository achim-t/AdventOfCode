const fs = require("fs")

// Define the regular expression
const regex = /([RDLU]) \d+ \((#[0-9a-fA-F]{6})\)/

// Read the lines from the file
const lines = fs
  .readFileSync("input.txt", "utf-8")
  .split("\n")
  .filter((line) => line.length > 0)

const instructions = lines.map((line) => {
  const [direction, steps] = line.split(" ")
  return { direction, steps: parseInt(steps) }
})

const instructions2 = lines.map((line) => {
  const match = line.match(regex)
  if (match) {
    const hexCode = match[2]
    const steps = parseInt(hexCode.slice(1, 6), 16)
    const direction = ["R", "D", "L", "U"][parseInt(hexCode.slice(6), 16)]

    return { direction, steps }
  } else {
    throw new Error(`Invalid line format: ${line}`)
  }
})

console.log(calculateArea(instructions))
console.log(calculateArea(instructions2))

function calculateArea(instructions) {
  let x = 0,
    y = 0

  const sections = [[x, y]]
  let area = 0
  let length = 0

  for (const instruction of instructions) {
    switch (instruction.direction) {
      case "U":
        y -= instruction.steps
        break
      case "D":
        y += instruction.steps
        break
      case "L":
        x -= instruction.steps
        break
      case "R":
        x += instruction.steps
        break
    }
    length += instruction.steps
    sections.push([x, y])
  }

  let j = sections.length - 1
  for (let i = 0; i < sections.length; i++) {
    area +=
      (sections[j][0] + sections[i][0]) * (sections[j][1] - sections[i][1])
    j = i
  }

  // The absolute value of the total area is the area enclosed by the trench
  return Math.abs(area / 2) + length / 2 + 1
}
