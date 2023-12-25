const fs = require("fs")
const { init } = require("z3-solver")

// Parse the input
const input = fs.readFileSync("input.txt", "utf8")
// const input = fs.readFileSync("input.txt", "utf8")
const lines = input.split("\n").filter((line) => line.includes("@"))
const hailstones = lines.map((line) => {
  const [pos, vel] = line.split(" @ ")
  const [px, py, pz] = pos.split(", ").map(Number)
  const [vx, vy, vz] = vel.split(", ").map(Number)
  return { px, py, pz, vx, vy, vz }
})

// Calculate the intersection point of two lines
function intersection(h1, h2) {
  const dx = h2.px - h1.px
  const dy = h2.py - h1.py
  const det = h2.vx * h1.vy - h2.vy * h1.vx
  if (det === 0) return null // The lines are parallel
  const u = (dy * h2.vx - dx * h2.vy) / det
  const v = (dy * h1.vx - dx * h1.vy) / det
  if (u < 0 || v < 0) return null // The intersection point is in the past
  return { x: h1.px + u * h1.vx, y: h1.py + u * h1.vy }
}

function areParallel(h1, h2) {
  const ratioX = h1.vx / h2.vx
  const ratioY = h1.vy / h2.vy
  const ratioZ = h1.vz / h2.vz

  return ratioX === ratioY && ratioY === ratioZ
}

// const minXY = 7
// const maxXY = 27
const minXY = 200000000000000
const maxXY = 400000000000000
// Check if a point is within the test area
function inTestArea(x, y) {
  return x >= minXY && x <= maxXY && y >= minXY && y <= maxXY
}

// Count the number of intersections that fall within the test area
let count = 0
for (let i = 0; i < hailstones.length; i++) {
  for (let j = i + 1; j < hailstones.length; j++) {
    const point = intersection(hailstones[i], hailstones[j])
    if (point && inTestArea(point.x, point.y)) {
      // console.log(
      //   `hailstone ${hailstones[i].px},${hailstones[i].py} ${hailstones[i].vx},${hailstones[i].vy} collides with hailstone ${hailstones[j].px},${hailstones[j].py} ${hailstones[j].vx},${hailstones[j].vy} at ${point.x},${point.y}`
      // )
      count++
    }
  }
}

console.log(count)

const hailstones2 = lines.map((line) => {
  const [pos, vel] = line.split(" @ ")
  const posComponents = pos.split(", ").map(Number)
  const velComponents = vel.split(", ").map(Number)
  return [...posComponents, ...velComponents]
})

// find parallel hailstones
const parallelHailstones = []
for (let i = 0; i < hailstones.length; i++) {
  for (let j = i + 1; j < hailstones.length; j++) {
    if (areParallel(hailstones[i], hailstones[j])) {
      parallelHailstones.push([i, j])
    }
  }
}
console.log(parallelHailstones)

// async function solveSystem() {
//   const { Context } = await init()
//   const { Solver, Int } = new Context("main")
//   const solver = new Solver()
//   const x = Int.const("x")
//   const y = Int.const("y")
//   const z = Int.const("z")
//   const dx = Int.const("dx")
//   const dy = Int.const("dy")
//   const dz = Int.const("dz")
//   const t = hailstones2.map((_, i) => Int.const(`t${i}`))

//   hailstones2.forEach((h, i) => {
//     solver.add(t[i].mul(h[3]).add(h[0]).sub(x).sub(t[i].mul(dx)).eq(0))
//     solver.add(t[i].mul(h[4]).add(h[1]).sub(y).sub(t[i].mul(dy)).eq(0))
//     solver.add(t[i].mul(h[5]).add(h[2]).sub(z).sub(t[i].mul(dz)).eq(0))
//   })
//   await solver.check()
//   console.log("Part 2", Number(solver.model().eval(x.add(y).add(z)).value()))
// }
// solveSystem()
