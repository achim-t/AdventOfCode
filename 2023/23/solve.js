const fs = require("fs")

const input = fs
  .readFileSync("sample.txt", "utf-8")
  .split("\r\n")
  .filter(Boolean)
const height = input.length
const width = input[0].length

const map = input.map((line) => line.split(""))
let memo = []

const dx = { "^": -1, v: 1, ">": 0, "<": 0, ".": 0, "#": 0 }
const dy = { "^": 0, v: 0, ">": 1, "<": -1, ".": 0, "#": 0 }

function getNeighbors(x, y, withSlopes = true) {
  if (withSlopes) {
    const nx = x + dx[map[x][y]]
    const ny = y + dy[map[x][y]]
    if (nx + ny - (x + y) !== 0) return [[nx, ny]]
  }
  const neighbors = []
  for (let [nx, ny] of [
    [x - 1, y],
    [x + 1, y],
    [x, y - 1],
    [x, y + 1],
  ]) {
    if (
      nx >= 0 &&
      nx < height &&
      ny >= 0 &&
      ny < width &&
      map[nx][ny] !== "#"
    ) {
      neighbors.push([nx, ny])
    }
  }
  return neighbors
}
function longestPath(x, y, withSlopes = true, visited = new Set()) {
  let length = 0
  let current = [x, y]
  // const visitedKey = new String(visited[visited.length - 1])

  // if (memo[x] && memo[x][y] && memo[x][y][visitedKey] !== undefined)
  //   return memo[x][y][visitedKey]

  while (true) {
    const [cx, cy] = current
    const key = `${cx},${cy}`
    if (visited.has(key)) return -Infinity
    visited.add(key)
    length++

    if (cx === height - 1) return length

    const neighbors = getNeighbors(cx, cy, withSlopes)
    const unvisitedNeighbors = neighbors.filter(
      ([nx, ny]) => !visited.has(`${nx},${ny}`)
    )
    if (unvisitedNeighbors.length !== 1) break

    current = unvisitedNeighbors[0]
  }

  let max = length
  const neighbors = getNeighbors(current[0], current[1], withSlopes)
  for (let [nx, ny] of neighbors) {
    if (!visited.has(`${nx},${ny}`)) {
      let newLength
      newLength = longestPath(nx, ny, withSlopes, new Set(visited))
      if (newLength + length > max) {
        max = newLength + length
      }
      if (newLength > l) {
        l = newLength
        console.log("_" + l)
      }
    }
  }
  if (max === length) return [-Infinity, []]
  // memo[x] = memo[x] || {}
  // memo[x][y] = memo[x][y] || {}
  // memo[x][y][visitedKey] = max
  return max
}

const startX = 0
const startY = map[0].indexOf(".")
let l = 0
let length = longestPath(startX, startY)
console.log(length - 1)
// length = longestPath(startX, startY, false)
memo = []
l = 0
// length = longestPath(startX, startY, false)
// console.log(length - 1)

// Step 1: Parse the input into a 2D array

// Step 2: Identify the nodes
let nodes = new Set()
for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[0].length; x++) {
    if (map[y][x] === "." && getNeighbors(x, y).length > 2) {
      nodes.add([x, y].toString())
    }
  }
}

// Step 3: Build the graph
let graph = {}
for (let node of nodes) {
  let [x, y] = node.split(",").map(Number)
  for (let neighbor of getNeighbors(x, y, false)) {
    if (nodes.has(neighbor.toString())) {
      graph[node] = graph[node] || {}
      graph[node][neighbor] = 1
    } else {
      let path = [neighbor]
      while (true) {
        let [cx, cy] = path[path.length - 1]
        const neighbors = getNeighbors(cx, cy, false)
        let nextCells = neighbors.filter(
          (n) => n.toString() !== node && !path.includes(n)
        )
        if (nextCells.length !== 1) break
        path.push(nextCells[0])
      }
      for (let end of nextCells) {
        if (nodes.has(end.toString())) {
          graph[node] = graph[node] || {}
          graph[node][end] = path.length
        }
      }
    }
  }
}

// Step 4: Find the longest path in the graph
function longestPathGraph(node, visited = new Set()) {
  let lengths = []
  for (let neighbor in graph[node]) {
    if (!visited.has(neighbor)) {
      lengths.push(
        longestPathGraph(neighbor, new Set(visited).add(node)) +
          graph[node][neighbor]
      )
    }
  }
  return Math.max(0, ...lengths)
}

console.log(longestPathGraph(Array.from(nodes)[0]))
