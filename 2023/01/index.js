const fs = require("fs")

function sumOfTwoDigitNumbers(filePath, ignoreSpelledOut) {
  const numberMapping = {
    zero: "0",
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
  }

  function findFirstDigit(line) {
    for (let i = 0; i < line.length; i++) {
      if (/\d/.test(line[i])) {
        return line[i]
      }
      if (!ignoreSpelledOut) {
        for (let word in numberMapping) {
          if (line.startsWith(word, i)) {
            return numberMapping[word]
          }
        }
      }
    }
    return null
  }

  function findLastDigit(line) {
    for (let i = line.length - 1; i >= 0; i--) {
      if (/\d/.test(line[i])) {
        return line[i]
      }
      if (!ignoreSpelledOut) {
        for (let word in numberMapping) {
          if (line.endsWith(word, i + word.length)) {
            return numberMapping[word]
          }
        }
      }
    }
    return null
  }

  let sum = 0
  const data = fs.readFileSync(filePath, "utf8")
  const lines = data.split("\n")

  for (let line of lines) {
    let firstDigit = findFirstDigit(line)
    let lastDigit = findLastDigit(line)

    if (firstDigit !== null && lastDigit !== null) {
      let twoDigitNumber = 10 * parseInt(firstDigit) + parseInt(lastDigit)
      sum += twoDigitNumber
    }
  }

  return sum
}

const input = "input.txt"

console.log(sumOfTwoDigitNumbers(input, true))
console.log(sumOfTwoDigitNumbers(input, false))
