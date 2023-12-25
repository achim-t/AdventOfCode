const fs = require("fs")

function tiltPlatform(grid) {
  const height = grid.length
  const width = grid[0].length

  for (let x = 0; x < width; x++) {
    let stack = 0
    for (let y = height - 1; y >= 0; y--) {
      if (grid[y][x] === "O") {
        stack++
        grid[y][x] = "."
      } else if (grid[y][x] === "#") {
        for (let i = 0; i < stack; i++) {
          grid[y + i + 1][x] = "O"
        }
        stack = 0
      }
    }
    for (let i = 0; i < stack; i++) {
      grid[i][x] = "O"
    }
  }

  return grid
}
function calculateLoad(grid) {
  const height = grid.length
  let totalLoad = 0

  for (let i = 0; i < height; i++) {
    const row = grid[height - 1 - i]
    const rocks = row.filter((cell) => cell === "O").length
    totalLoad += rocks * (i + 1)
  }

  return totalLoad
}

function rotateGrid(grid) {
  const height = grid.length
  const width = grid[0].length
  const newGrid = Array.from({ length: width }, () => Array(height).fill("."))

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      newGrid[x][height - y - 1] = grid[y][x]
    }
  }

  return newGrid
}

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err)
    return
  }

  let grid = data
    .trim()
    .split("\r\n")
    .map((row) => row.split(""))
  const cycleCount = 1000000000
  let cycle = 0
  let gridStates = new Map()

  while (cycle < cycleCount) {
    const gridJSON = JSON.stringify(grid)

    if (checkForSavedGrid(JSON.stringify(grid))) break

    gridStates.set(gridJSON, cycle)
    for (let i = 0; i < 4; i++) {
      grid = tiltPlatform(grid)
      grid = rotateGrid(grid)
    }

    cycle++

    if (cycle >= cycleCount) {
      break
    }
  }
  function checkForSavedGrid(gridJSON) {
    if (!gridStates.has(gridJSON)) return false
    const previousCycle = gridStates.get(gridJSON)
    const cycleDiff = cycle - previousCycle
    const remainingCycles = (cycleCount - cycle) % cycleDiff
    const targetCycle = previousCycle + remainingCycles

    for (const [gridState, cycleNumber] of gridStates) {
      if (cycleNumber === targetCycle) {
        grid = JSON.parse(gridState)
        return true
      }
    }
    throw new Error("found loop, but couldn't find target cycle")
  }
  console.log(calculateLoad(grid))
})
