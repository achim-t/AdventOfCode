const fs = require("fs")

const input = fs
  .readFileSync("input.txt", "utf-8")
  .split("\r\n")
  .filter(Boolean)

const grid = input.map((line) => line.split(""))

let isValid = (y, x) =>
  !(
    y < 0 ||
    y >= grid.length ||
    x < 0 ||
    x >= grid[0].length ||
    grid[y][x] == "#"
  )

const startX = 0
const startY = grid[startX].indexOf(".")
const endX = grid.length - 1
const endY = grid[endX].indexOf(".")
let nodes = [startX + "," + startY, endX + "," + endY] // use strings so we can use .includes
let nodedist = []
for (let i = 0; i < nodes.length; i++) {
  nodedist[i] = {}
  let node = nodes[i].split(",").map((x) => +x)
  let nav = (step, last, y, x) => {
    //dirs are ULDR
    if (!isValid(y, x)) return

    let valids = 0
    if (isValid(y - 1, x)) valids++
    if (isValid(y + 1, x)) valids++
    if (isValid(y, x - 1)) valids++
    if (isValid(y, x + 1)) valids++
    if (step > 0 && (valids > 2 || y < 1 || y >= grid.length - 1)) {
      if (!nodes.includes(y + "," + x)) nodes.push(y + "," + x)
      nodedist[i][nodes.indexOf(y + "," + x)] = step
      return
    }

    if (last != 2) nav(step + 1, 0, y - 1, x)
    if (last != 0) nav(step + 1, 2, y + 1, x)
    if (last != 3) nav(step + 1, 1, y, x - 1)
    if (last != 1) nav(step + 1, 3, y, x + 1)
  }

  nav(0, -1, node[0], node[1])
}

console.log(nodes, nodedist)

let longestp = []
let longests = 0
let nav2 = (steps, node, prev) => {
  if (node == 1) {
    if (steps > longests) {
      longestp = prev
      longests = steps
    }
    return
  }
  prev.push(node)
  for (let target in nodedist[node]) {
    if (prev.includes(+target)) continue
    let nprev = [...prev]
    nav2(steps + nodedist[node][target], +target, nprev)
  }
}
nav2(0, 0, [])
console.log(longestp, longests)
