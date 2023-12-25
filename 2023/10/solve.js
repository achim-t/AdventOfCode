const fs = require("fs")

function findLoop(map) {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ] // up, down, left, right
  const pipeDirections = {
    "|": [directions[0], directions[1]],
    "-": [directions[2], directions[3]],
    7: [directions[1], directions[2]], // south and west
    J: [directions[0], directions[2]], // north and west
    L: [directions[0], directions[3]], // north and east
    F: [directions[1], directions[3]], // south and east
  }
  let start
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] === "S") {
        start = [i, j]
        break
      }
    }
    if (start) break
  }
  let [x, y] = start
  let direction = directions[0]

  let path = []
  while (true) {
    x += direction[0]
    y += direction[1]
    const key = `${x},${y}`
    path.push(key)
    if (map[x][y] === "S") break
    const newDirections = pipeDirections[map[x][y]]
    direction = newDirections.find(
      ([dx, dy]) => dx !== -direction[0] || dy !== -direction[1]
    )
  }
  return new Set(Array.from(path))
}

function countEnclosedTiles(map, loop) {
  const inside = map.map((row) => row.map(() => false))

  map.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (loop.has(`${i},${j}`)) return
      const count = row.slice(j).reduce((acc, cell, k) => {
        return acc + (loop.has(`${i},${j + k}`) && "F7|".includes(cell) ? 1 : 0)
      }, 0)
      inside[i][j] = count % 2 === 1
    })
  })

  outputMap(map, loop, inside)
  return inside.reduce((total, row) => total + row.filter(Boolean).length, 0)
}

function outputMap(map, loop, inside) {
  const outputMap = map.map((row, i) =>
    row.map((cell, j) => {
      if (loop.has(`${i},${j}`)) {
        const pipeSymbols = {
          L: "└",
          J: "┘",
          7: "┐",
          F: "┌",
          "-": "─",
          "|": "│",
        }
        return pipeSymbols[map[i][j]] || map[i][j]
      }
      return inside[i][j] ? "*" : "."
    })
  )

  fs.writeFileSync(
    "output.txt",
    outputMap.map((row) => row.join("")).join("\n")
  )
}

const mapStr = fs.readFileSync("input.txt", "utf-8")
const map = mapStr.split("\n").map((line) => line.split(""))
const loop = findLoop(map)

console.log(loop.size / 2)
console.log(countEnclosedTiles(map, loop))
