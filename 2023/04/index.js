const fs = require("fs")

function winnings(filename) {
  const data = fs.readFileSync(filename, "utf8").split("\n")
  let sum = 0

  for (let game of data) {
    let score = 0
    let [gameId, rest] = game.split(": ")
    rest = rest.trim()
    // console.log(gameId)
    let [winningNumbers, myNumbers] = rest.split(" | ")
    myNumbers = myNumbers.split(" ").filter((n) => n !== "")
    for (let number of winningNumbers.split(" ")) {
      if (myNumbers.includes(number)) {
        score++
      }
    }
    // console.log(score)
    if (score > 0) {
      sum += Math.pow(2, score - 1)
    }
  }
  return sum
}
function winnings2(filename) {
  const data = fs.readFileSync(filename, "utf8").split("\n")
  let sum = 0
  let i = 0
  let multis = Array(data.length).fill(1)

  for (let game of data) {
    let score = 0
    let [gameId, rest] = game.split(": ")
    rest = rest.trim()
    let [winningNumbers, myNumbers] = rest.split(" | ")
    myNumbers = myNumbers.split(" ").filter((n) => n !== "")
    for (let number of winningNumbers.split(" ")) {
      if (myNumbers.includes(number)) {
        score++
      }
    }
    for (let j = 0; j < score; j++) {
      multis[i + j + 1] += multis[i]
    }
    i++
  }
  return multis.reduce((a, b) => a + b, 0)
}

console.log(winnings("input.txt"))
console.log(winnings2("input.txt"))
