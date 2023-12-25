const fs = require("fs")

function sumOfPossibleGames(filename, redCubes, greenCubes, blueCubes) {
  const data = fs.readFileSync(filename, "utf8").split("\n")
  let possibleGamesSum = 0

  for (let game of data) {
    let [gameId, ...sets] = game.split(": ")
    gameId = parseInt(gameId.split(" ")[1])
    let isPossible = true

    for (let set of sets[0].split("; ")) {
      let cubes = set.split(", ")
      let red = cubes
        .filter((cube) => cube.includes("red"))
        .reduce((sum, cube) => sum + parseInt(cube.split(" ")[0]), 0)
      let green = cubes
        .filter((cube) => cube.includes("green"))
        .reduce((sum, cube) => sum + parseInt(cube.split(" ")[0]), 0)
      let blue = cubes
        .filter((cube) => cube.includes("blue"))
        .reduce((sum, cube) => sum + parseInt(cube.split(" ")[0]), 0)

      if (red > redCubes || green > greenCubes || blue > blueCubes) {
        isPossible = false
        break
      }
    }

    if (isPossible) {
      possibleGamesSum += gameId
    }
  }

  return possibleGamesSum
}

function sumOfPowersOfMinimumSets(filename) {
  const data = fs.readFileSync(filename, "utf8").split("\n")
  let sumOfPowers = 0

  for (let game of data) {
    let [gameId, ...sets] = game.split(": ")
    gameId = parseInt(gameId.split(" ")[1])
    let minRed = 0,
      minGreen = 0,
      minBlue = 0

    for (let set of sets[0].split("; ")) {
      let cubes = set.split(", ")
      let red = cubes
        .filter((cube) => cube.includes("red"))
        .reduce((sum, cube) => Math.max(sum, parseInt(cube.split(" ")[0])), 0)
      let green = cubes
        .filter((cube) => cube.includes("green"))
        .reduce((sum, cube) => Math.max(sum, parseInt(cube.split(" ")[0])), 0)
      let blue = cubes
        .filter((cube) => cube.includes("blue"))
        .reduce((sum, cube) => Math.max(sum, parseInt(cube.split(" ")[0])), 0)

      minRed = Math.max(minRed, red)
      minGreen = Math.max(minGreen, green)
      minBlue = Math.max(minBlue, blue)
    }

    sumOfPowers += minRed * minGreen * minBlue
  }

  return sumOfPowers
}

// console.log(sumOfPowersOfMinimumSets("sample.txt"))
console.log(sumOfPowersOfMinimumSets("input.txt"))

// console.log(sumOfPossibleGames("input.txt", 12, 13, 14))
// console.log(sumOfPossibleGames("sample.txt", 12, 13, 14))
