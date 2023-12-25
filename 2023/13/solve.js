const fs = require("fs")
const readline = require("readline")

async function solvePuzzle() {
  const fileStream = fs.createReadStream("input.txt")
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })

  let total = 0
  let pattern = []
  for await (const line of rl) {
    if (line.trim() === "") {
      total += processPattern(pattern)
      pattern = []
    } else {
      pattern.push(line)
    }
  }
  total += processPattern(pattern) // Process the last pattern

  console.log(total)
}
function findMirrorLine(pattern) {
  const lenRow = pattern.length

  for (let i = 0; i < lenRow - 1; i++) {
    let isMirror = true
    let diffCount = 0
    for (let j = 0; j <= i && i + j + 1 < lenRow; j++) {
      const diff = pattern[i - j]
        .split("")
        .filter((c, idx) => c !== pattern[i + j + 1][idx]).length
      diffCount += diff
      if (diff > 1 || diffCount > 1) {
        isMirror = false
        break
      }
    }
    if (isMirror && diffCount === 1) {
      return i + 1 // +1 because rows are 1-indexed
    }
  }

  return 0
}

function transposePattern(pattern) {
  // Split each string into an array of characters
  const splitPattern = pattern.map((row) => row.split(""))

  // Transpose the array of character arrays
  const transposedSplitPattern = splitPattern[0].map((_, i) =>
    splitPattern.map((row) => row[i])
  )

  // Join each row back into a string
  const transposedPattern = transposedSplitPattern.map((row) => row.join(""))

  return transposedPattern
}

function processPattern(pattern) {
  let result = 100 * findMirrorLine(pattern)
  if (result === 0) {
    const transposedPattern = transposePattern(pattern)
    result = findMirrorLine(transposedPattern)
  }
  return result
}
solvePuzzle() // 34889 (Part 1) 34224 (Part 2)
