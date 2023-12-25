const fs = require("fs")

// Parse the input data
const input = fs.readFileSync("input.txt", "utf8").split("\r\n").filter(Boolean)

solve()
function solve() {
  let solution = 0
  let solution2 = 0

  const bricks = parseBricks()
  const occupation = initOccupation()
  dropBricks()
  const { above, below } = calculateAboveBelow()

  for (let brick of bricks) {
    if (saveToRemove(brick)) solution++
    solution2 += numberOfBricksFallingIfRemoved(brick)
  }

  console.log(solution)
  console.log(solution2)

  function parseBricks() {
    return input.map((line) => {
      let raw = line
        .split("~")
        .map((coordinates) =>
          coordinates.split(",").map((coordinate) => parseInt(coordinate))
        )
      return {
        start: { x: raw[0][0], y: raw[0][1], z: raw[0][2] },
        end: { x: raw[1][0], y: raw[1][1], z: raw[1][2] },
      }
    })
  }

  function dropBricks() {
    let step = true
    while (step) {
      step = false
      for (const brick of bricks) {
        if (canFall(brick)) {
          step = true
          drop(brick)
        }
      }
    }
  }

  function saveToRemove(brick) {
    for (let brickAbove of above.get(brick)) {
      if (below.get(brickAbove).size == 1) {
        return false
      }
    }
    return true
  }

  function numberOfBricksFallingIfRemoved(brick) {
    const gone = new Set()
    gone.add(brick)

    let foundNewOne = true
    while (foundNewOne) {
      foundNewOne = false
      for (const goneBrick of gone) {
        for (const other of above.get(goneBrick)) {
          if (
            !gone.has(other) &&
            Array.from(below.get(other)).every((x) => gone.has(x))
          ) {
            gone.add(other)
            foundNewOne = true
          }
        }
      }
    }
    return gone.size - 1
  }

  function calculateAboveBelow() {
    const above = new Map()
    const below = new Map()

    for (const brick of bricks) {
      above.set(brick, new Set())
      below.set(brick, new Set())
    }
    for (const brick of bricks) {
      for (let x = brick.start.x; x <= brick.end.x; x++) {
        for (let y = brick.start.y; y <= brick.end.y; y++) {
          for (let z = brick.start.z; z <= brick.end.z; z++) {
            let key = `${x},${y},${z + 1}`
            if (occupation.has(key)) {
              let other = occupation.get(key)
              if (other != brick) {
                above.get(brick).add(other)
                below.get(other).add(brick)
              }
            }
          }
        }
      }
    }
    return { above, below }
  }

  function initOccupation() {
    const occupation = new Map()
    for (const brick of bricks) {
      for (let x = brick.start.x; x <= brick.end.x; x++) {
        for (let y = brick.start.y; y <= brick.end.y; y++) {
          for (let z = brick.start.z; z <= brick.end.z; z++) {
            let key = `${x},${y},${z}`
            if (occupation.has(key)) {
              console.error("overlap")
            } else {
              occupation.set(key, brick)
            }
          }
        }
      }
    }
    return occupation
  }

  function drop(brick) {
    for (let x = brick.start.x; x <= brick.end.x; x++) {
      for (let y = brick.start.y; y <= brick.end.y; y++) {
        for (let z = brick.start.z; z <= brick.end.z; z++) {
          let key = `${x},${y},${z}`
          occupation.delete(key)
        }
      }
    }
    brick.start.z--
    brick.end.z--
    for (let x = brick.start.x; x <= brick.end.x; x++) {
      for (let y = brick.start.y; y <= brick.end.y; y++) {
        for (let z = brick.start.z; z <= brick.end.z; z++) {
          let key = `${x},${y},${z}`
          occupation.set(key, brick)
        }
      }
    }
  }

  function canFall(brick) {
    for (let x = brick.start.x; x <= brick.end.x; x++) {
      for (let y = brick.start.y; y <= brick.end.y; y++) {
        for (let z = brick.start.z; z <= brick.end.z; z++) {
          if (z - 1 <= 0) {
            return false
          } else {
            let key = `${x},${y},${z - 1}`
            if (occupation.has(key) && occupation.get(key) != brick) {
              return false
            }
          }
        }
      }
    }
    return true
  }
}
