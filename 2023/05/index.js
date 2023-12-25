const fs = require("fs")

// Parse the input
const data = fs.readFileSync("input.txt", "utf8")
const sections = data.split("\r\n\r\n").map((section) => section.split("\r\n"))

// Parse the seed ranges
const seedRanges = sections[0][0]
  .split(" ")
  .map(Number)
  .filter((num) => !isNaN(num))

// Parse the maps and sort the ranges
const maps = sections.slice(1).map((section) => {
  const ranges = []
  const lines = section.slice(1) // Skip the title line
  for (let line of lines) {
    const [destStart, srcStart, length] = line.split(" ").map(Number)
    ranges.push({ destStart, srcStart, length })
  }
  ranges.sort((a, b) => a.srcStart - b.srcStart)
  return ranges
})

// Function to map a number through the categories
function mapNumber(num, maps) {
  for (const ranges of maps) {
    let mapped = num
    let left = 0,
      right = ranges.length - 1
    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      const { destStart, srcStart, length } = ranges[mid]
      if (num >= srcStart && num < srcStart + length) {
        mapped = destStart + (num - srcStart)
        break
      } else if (num < srcStart) {
        right = mid - 1
      } else {
        left = mid + 1
      }
    }
    num = mapped
  }
  return num
}

// Find the minimum location number
let minLocation = Infinity
for (let i = 0; i < seedRanges.length; i += 2) {
  console.log("seed range start")
  const start = seedRanges[i]
  const length = seedRanges[i + 1]
  for (let j = 0; j < length; j++) {
    const seed = start + j
    const location = mapNumber(seed, maps)
    if (location < minLocation) {
      minLocation = location
    }
  }
}

console.log(minLocation)
