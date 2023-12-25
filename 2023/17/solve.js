const fs = require("fs")
const { Heap } = require("heap-js")

// Parse the input
const input = fs.readFileSync("input.txt", "utf8").split("\r\n").filter(Boolean)
const grid = input.map((line) => line.split("").map(Number))

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
]

function inRange(pos, arr) {
  return (
    pos[0] >= 0 && pos[0] < arr.length && pos[1] >= 0 && pos[1] < arr[0].length
  )
}

function findMinHeatLoss(mindist, maxdist) {
  let heap = new Heap((a, b) => a[0] - b[0])
  heap.push([0, 0, 0, -1]) // cost, x, y, disallowedDirection
  let costs = {}

  while (heap.length > 0) {
    let [cost, x, y, disallowedDirection] = heap.pop()

    if (x === grid.length - 1 && y === grid[0].length - 1) return cost

    for (let direction = 0; direction < 4; direction++) {
      if (
        direction === disallowedDirection ||
        (direction + 2) % 4 === disallowedDirection
      )
        continue

      let costIncrease = 0
      for (let distance = 1; distance <= maxdist; distance++) {
        let newX = x + directions[direction][0] * distance
        let newY = y + directions[direction][1] * distance

        if (inRange([newX, newY], grid)) {
          costIncrease += grid[newX][newY]

          if (distance < mindist) continue

          let newCost = cost + costIncrease
          let newStateKey = `${newX},${newY},${direction}`
          if (costs[newStateKey] <= newCost) continue

          costs[newStateKey] = newCost
          heap.push([newCost, newX, newY, direction])
        }
      }
    }
  }
}

console.log(findMinHeatLoss(1, 3))
console.log(findMinHeatLoss(4, 10))
