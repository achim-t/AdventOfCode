const fs = require("fs")

// Read the file and parse into 2D array
const data = fs
  .readFileSync("input.txt", "utf8")
  .split("\r\n")
  .map((line) => line.split(""))

// Identify rows and columns with no galaxies
const emptyRows = data
  .map((row, i) => (row.includes("#") ? -1 : i))
  .filter((i) => i !== -1)
  .reverse()
const emptyCols = data[0]
  .map((_, i) => (data.some((row) => row[i] === "#") ? -1 : i))
  .filter((i) => i !== -1)
  .reverse()

// Double the size of identified rows and columns
// emptyRows.forEach((i) => data.splice(i, 0, new Array(data[0].length).fill(".")))
// emptyCols.forEach((i) => data.forEach((row) => row.splice(i, 0, ".")))

// Find all galaxies
const galaxies = []
data.forEach((row, i) =>
  row.forEach((cell, j) => {
    if (cell === "#") galaxies.push([i, j])
  })
)

// // Calculate the sum of the distances between every pair of galaxies
// let sum = 0
// for (let i = 0; i < galaxies.length; i++) {
//   for (let j = i + 1; j < galaxies.length; j++) {
//     sum +=
//       Math.abs(galaxies[i][0] - galaxies[j][0]) +
//       Math.abs(galaxies[i][1] - galaxies[j][1])
//   }
// }

// console.log(sum)

// Constants for the expansion size
console.log(calculateSumOfDistances(2)) // 9403026
console.log(calculateSumOfDistances(1000000))

function calculateSumOfDistances(EXPANSION_FACTOR) {
  EXPANSION_FACTOR--
  // Calculate the sum of the distances between every pair of galaxies
  let sum = 0
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      // Count the number of empty rows and columns
      const emptyRowsCount = emptyRows.filter(
        (row) =>
          row > Math.min(galaxies[i][0], galaxies[j][0]) &&
          row < Math.max(galaxies[i][0], galaxies[j][0])
      ).length
      const emptyColsCount = emptyCols.filter(
        (col) =>
          col > Math.min(galaxies[i][1], galaxies[j][1]) &&
          col < Math.max(galaxies[i][1], galaxies[j][1])
      ).length

      // Adjust the distances for the expanded rows and columns and add to the sum
      sum +=
        Math.abs(galaxies[i][0] - galaxies[j][0]) +
        Math.abs(galaxies[i][1] - galaxies[j][1])
      sum += (emptyColsCount + emptyRowsCount) * EXPANSION_FACTOR
    }
  }
  return sum
}
