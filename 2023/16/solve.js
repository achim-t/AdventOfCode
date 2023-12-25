const fs = require("fs")

// Read the input
const input = fs.readFileSync("input.txt", "utf8").split("\r\n")

// Initialize the grid and the set of energized tiles
const grid = input.map((line) => line.split(""))

// Function to simulate a beam
const simulate = (x, y, dx, dy) => {
  const energizedGrid = grid.map((row) => row.map(() => "."))
  const computed = new Set()
  const queue = [[x, y, dx, dy]]
  while (queue.length > 0) {
    ;[x, y, dx, dy] = queue.shift()
    const key = `${x},${y},${dx},${dy}`

    if (
      computed.has(key) ||
      x < 0 ||
      x >= grid.length ||
      y < 0 ||
      y >= grid[0].length
    ) {
      continue
    }
    computed.add(key)

    energizedGrid[x][y] = "#"

    switch (grid[x][y]) {
      case "\\":
        queue.push([x + dy, y + dx, dy, dx])
        break
      case "/":
        queue.push([x - dy, y - dx, -dy, -dx])
        break
      case "|":
        if (dy !== 0) {
          queue.push([x - 1, y, -1, 0])
          queue.push([x + 1, y, 1, 0])
        } else {
          queue.push([x + dx, y + dy, dx, dy])
        }
        break
      case "-":
        if (dx !== 0) {
          queue.push([x, y - 1, 0, -1])
          queue.push([x, y + 1, 0, 1])
        } else {
          queue.push([x + dx, y + dy, dx, dy])
        }
        break
      default:
        queue.push([x + dx, y + dy, dx, dy])
        break
    }
  }
  return energizedGrid.flat().filter((tile) => tile === "#").length
}

console.log(simulate(0, 0, 0, 1))

// Part 2
let maxEnergized = 0

// Top row
for (let y = 0; y < grid[0].length; y++) {
  const energized = simulate(0, y, 1, 0)
  maxEnergized = Math.max(maxEnergized, energized)
}

// Bottom row
for (let y = 0; y < grid[0].length; y++) {
  const energized = simulate(grid.length - 1, y, -1, 0)
  maxEnergized = Math.max(maxEnergized, energized)
}

// Leftmost column
for (let x = 0; x < grid.length; x++) {
  const energized = simulate(x, 0, 0, 1)
  maxEnergized = Math.max(maxEnergized, energized)
}

// Rightmost column
for (let x = 0; x < grid.length; x++) {
  const energized = simulate(x, grid[0].length - 1, 0, -1)
  maxEnergized = Math.max(maxEnergized, energized)
}

console.log(maxEnergized)
