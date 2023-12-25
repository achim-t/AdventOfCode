const fs = require("fs")

function isSymbol(char) {
  return char !== "." && isNaN(char)
}

function isPartNumber(schematic, i, j, numberLength) {
  const rows = schematic.length
  const cols = schematic[0].length

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const nx1 = i + dx,
        ny1 = j - numberLength + dy
      const nx2 = i + dx,
        ny2 = j - 1 + dy
      if (
        (nx1 >= 0 &&
          nx1 < rows &&
          ny1 >= 0 &&
          ny1 < cols &&
          isSymbol(schematic[nx1][ny1])) ||
        (nx2 >= 0 &&
          nx2 < rows &&
          ny2 >= 0 &&
          ny2 < cols &&
          isSymbol(schematic[nx2][ny2]))
      ) {
        return true
      }
    }
  }
  return false
}

function sumOfParts(schematic) {
  const rows = schematic.length
  const cols = schematic[0].length
  let total = 0

  for (let i = 0; i < rows; i++) {
    let number = ""
    for (let j = 0; j <= cols; j++) {
      if (j < cols && !isNaN(schematic[i][j])) {
        number += schematic[i][j]
      } else {
        if (number !== "" && isPartNumber(schematic, i, j, number.length)) {
          total += Number(number)
        }
        number = ""
      }
    }
  }
  return total
}

function getPartNumber(schematic, i, j) {
  if (isNaN(schematic[i][j])) return null
  let number = ""
  let start = j
  let positions = []
  // Go left to find the start of the number
  while (start >= 0 && !isNaN(schematic[i][start])) {
    start--
  }
  // Move one step right to the start of the number
  start++
  // Read right until the end of the number
  while (start < schematic[i].length && !isNaN(schematic[i][start])) {
    number += schematic[i][start]
    positions.push([i, start])
    start++
  }
  return { number: Number(number), positions }
}

function getGearRatio(schematic, i, j) {
  const directions = [
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
  ]
  const partNumbers = []
  const checkedPositions = new Set()

  for (const [dx, dy] of directions) {
    const nx = i + dx,
      ny = j + dy
    const key = `${nx},${ny}`
    if (!checkedPositions.has(key)) {
      const part = getPartNumber(schematic, nx, ny)
      if (part !== null) {
        partNumbers.push(part.number)
        part.positions.forEach(([x, y]) => checkedPositions.add(`${x},${y}`))
      }
    }
  }
  return partNumbers.length === 2 ? partNumbers[0] * partNumbers[1] : 0
}

function sumOfGearRatios(schematic) {
  const rows = schematic.length
  const cols = schematic[0].length
  let total = 0

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (schematic[i][j] === "*") {
        total += getGearRatio(schematic, i, j)
      }
    }
  }
  return total
}

fs.readFile("schematic.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err)
    return
  }
  const schematic = data.split("\n")
  console.log(sumOfParts(schematic))
  console.log(sumOfGearRatios(schematic))
})
