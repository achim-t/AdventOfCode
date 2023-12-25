const fs = require("fs")

// Read the file
const garden = fs.readFileSync("input.txt", "utf-8").split("\r\n")

// let deser = (str) => str.split(",").map((x) => +x)
// let mod = (a, b) => ((a % b) + b) % b
// let locs = {}
// let gd = (y, x) => {
//   //if (y<0 || y>=inp.length || x<0 || x>=inp[y].length) return "#";
//   return garden[mod(y, garden.length)][mod(x, garden.length)]
// }
// let seen = {}
// let cnts = []
// let ret = 0
// for (let y = 0; y < garden.length; y++) {
//   for (let x = 0; x < garden[y].length; x++) {
//     if (garden[y][x] == "S") locs[y + "," + x] = true
//   }
// }
// for (let i = 1; i <= 131 * 3 + 65; i++) {
//   //131*6+65
//   let nlocs = {}
//   let cfa = (y, x) => {
//     if (seen[y + "," + x]) return
//     if (gd(y, x) == "#") return
//     locs[y + "," + x] = 0
//   }
//   for (let l in locs) {
//     let [y, x] = deser(l)
//     if (gd(y - 1, x) != "#") nlocs[y - 1 + "," + x] = true
//     if (gd(y + 1, x) != "#") nlocs[y + 1 + "," + x] = true
//     if (gd(y, x - 1) != "#") nlocs[y + "," + (x - 1)] = true
//     if (gd(y, x + 1) != "#") nlocs[y + "," + (x + 1)] = true
//   }
//   if (i == 64) {
//     let cnt = 0
//     for (let l in nlocs) cnt++
//     console.log("part 1", cnt)
//   }
//   if (i % 131 == 65) {
//     let cnt = 0
//     for (let l in nlocs) cnt++
//     console.log(cnt)
//   }
//   locs = nlocs
// }

function f(n) {
  // coefficients from above code
  let a0 = 3744 // reachable in 65 steps
  let a1 = 33417 // reachable in 131 + 65 steps
  let a2 = 92680 // reachable in 131*2 + 65 steps

  let b0 = a0
  let b1 = a1 - a0
  let b2 = a2 - a1
  return b0 + b1 * n + ((n * (n - 1)) / 2) * (b2 - b1)
}

let goal = 26501365
console.log(Math.floor(goal / garden.length))
console.log(f(Math.floor(goal / garden.length)))

// Part 1
// const moves = [
//   [-1, 0],
//   [1, 0],
//   [0, -1],
//   [0, 1],
// ] // north, south, west, east
// let startX, startY
// const memo = []
// // Find the starting position
// for (let i = 0; i < garden.length; i++) {
//   memo[i] = []
//   for (let j = 0; j < garden[i].length; j++) {
//     memo[i][j] = []
//     if (garden[i][j] === "S") {
//       startX = i
//       startY = j
//     }
//   }
// }

// console.log(startX, startY)

// function bfs(x, y, steps, visited = new Set()) {
//   if (steps === 129) {
//     visited.add(`${x},${y}`)

//     return visited
//   }

//   if (memo[x][y][steps]) {
//     return memo[x][y][steps]
//   }

//   for (let move of moves) {
//     let newX = x + move[0]
//     let newY = y + move[1]

//     if (isValidMove(newX, newY)) {
//       bfs(newX, newY, steps + 1).forEach((v) => visited.add(v))
//     }
//   }
//   memo[x][y][steps] = visited
//   return visited
// }

// function isValidMove(x, y) {
//   return (
//     x >= 0 &&
//     y >= 0 &&
//     x < garden.length &&
//     y < garden[0].length &&
//     garden[x][y] !== "#"
//   )
// }
// let result = bfs(startX, startY, 0)
// console.log(result.size)
