const fs = require("fs")
/*
function calculateCountForRow(line) {
  const [pattern, groups] = line.split(" ")
  const groupSizes = groups.split(",").map(Number)
  let count = 0

  function generateLines(i, currentLine, currentGroupIndex, currentGroupSize) {
    // Check if the current line is a partial match
    if (
      currentGroupIndex < groupSizes.length &&
      currentGroupSize > groupSizes[currentGroupIndex]
    ) {
      return // If not, stop generating further lines from it
    }

    if (i === pattern.length) {
      const currentGroupSizes = getGroupSizes(currentLine)
      if (arraysEqual(currentGroupSizes, groupSizes)) {
        count++
      }
      return
    }

    if (pattern[i] === "?") {
      generateHashLine()
      generateDotLine()
    } else {
      pattern[i] === "." ? generateDotLine() : generateHashLine()
    }

    function generateHashLine() {
      generateLines(
        i + 1,
        currentLine + "#",
        currentGroupIndex,
        currentGroupSize + 1
      )
    }

    function generateDotLine() {
      generateLines(
        i + 1,
        currentLine + ".",
        currentGroupSize === 0 ? currentGroupIndex : currentGroupIndex + 1,
        0
      )
    }
  }
  function getGroupSizes(line) {
    return line
      .split(".")
      .filter((group) => group.length > 0)
      .map((group) => group.length)
  }

  function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index])
  }
  generateLines(0, "", 0, 0)
  return count
}
*/

function calculateCountForRow(line) {
  const [pattern, groups] = line.split(" ")
  const groupSizes = groups.split(",").map(Number)
  const cache = {}

  function generateLines(remainingPattern, remainingGroups) {
    const key = `${remainingPattern}-${remainingGroups.join(",")}`
    if (key in cache) {
      return cache[key]
    }
    let count = 0
    // If we've consumed all groups and the pattern, increment count
    if (remainingPattern.length === 0 && remainingGroups.length === 0) {
      count++
      return 1
    }

    if (remainingGroups.length === 0) {
      if (!remainingPattern.includes("#")) {
        count++
        return 1
      }
    }

    if (remainingPattern.length === 0 || remainingGroups.length === 0) {
      return 0
    }

    const firstGroupSize = remainingGroups[0]

    if (remainingPattern.startsWith(".")) {
      count += generateLines(trimDot(remainingPattern), remainingGroups)
    }
    if (remainingPattern.startsWith("?")) {
      count += generateLines("#" + remainingPattern.slice(1), remainingGroups)
      count += generateLines(remainingPattern.slice(1), remainingGroups)
    }
    if (remainingPattern.startsWith("#")) {
      if (
        !remainingPattern.substring(0, firstGroupSize).includes(".") &&
        ((remainingPattern.length >= firstGroupSize &&
          remainingPattern[firstGroupSize] !== "#") ||
          remainingPattern.length === firstGroupSize)
      ) {
        count += generateLines(
          trimDot(remainingPattern.slice(firstGroupSize + 1)),
          remainingGroups.slice(1)
        )
      }
    }
    cache[key] = count
    return count
  }

  function trimDot(pattern) {
    while (pattern.startsWith(".")) {
      pattern = pattern.slice(1)
    }
    return pattern
  }

  return generateLines(pattern, groupSizes)
}

function solve(input) {
  const lines = input.split("\r\n")
  let total = 0
  let total2 = 0

  const startTime = Date.now()

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const count = calculateCountForRow(line)
    total += count
    total2 += calculateCountForUnfoldedRow(line)
  }

  return [total, total2]
}

const assert = require("assert")

const input = fs.readFileSync("input.txt", "utf-8")
console.log(solve(input))

assert.strictEqual(calculateCountForRow("???.### 1,1,3"), 1)
assert.strictEqual(calculateCountForRow(".??..??...?##. 1,1,3"), 4)
assert.strictEqual(calculateCountForRow("?#?#?#?#?#?#?#? 1,3,1,6"), 1)
assert.strictEqual(calculateCountForRow("????.#...#... 4,1,1"), 1)
assert.strictEqual(calculateCountForRow("????.######..#####. 1,6,5"), 4)
assert.strictEqual(calculateCountForRow("?###???????? 3,2,1"), 10)

function calculateCountForUnfoldedRow(line) {
  let [pattern, groups] = line.split(" ")
  pattern = Array(5).fill(pattern).join("?") // unfold the pattern
  groups = groups
    .split(",")
    .map(Number)
    .concat(...Array(4).fill(groups.split(",").map(Number)))
    .flat()
    .join(",") // unfold the group sizes
  return calculateCountForRow(`${pattern} ${groups}`)
}
assert.strictEqual(calculateCountForUnfoldedRow("???.### 1,1,3"), 1)
assert.strictEqual(calculateCountForUnfoldedRow(".??..??...?##. 1,1,3"), 16384)
assert.strictEqual(calculateCountForUnfoldedRow("?#?#?#?#?#?#?#? 1,3,1,6"), 1)
assert.strictEqual(calculateCountForUnfoldedRow("????.#...#... 4,1,1"), 16)
assert.strictEqual(
  calculateCountForUnfoldedRow("????.######..#####. 1,6,5"),
  2500
)
assert.strictEqual(calculateCountForUnfoldedRow("?###???????? 3,2,1"), 506250)
