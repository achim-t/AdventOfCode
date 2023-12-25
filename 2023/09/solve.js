const fs = require("fs")

function getDifferences(arr) {
  let differences = []
  for (let i = 1; i < arr.length; i++) {
    differences.push(arr[i] - arr[i - 1])
  }
  return differences
}

function extrapolateNextValue(history) {
  let sequences = [history]
  while (sequences[sequences.length - 1].some((val) => val !== 0)) {
    sequences.push(getDifferences(sequences[sequences.length - 1]))
  }
  for (let i = sequences.length - 2; i >= 0; i--) {
    sequences[i].push(
      sequences[i][sequences[i].length - 1] +
        sequences[i + 1][sequences[i + 1].length - 1]
    )
  }
  return sequences[0][sequences[0].length - 1]
}

function sumExtrapolatedValues(input) {
  let histories = input.split("\n").map((line) => line.split(" ").map(Number))
  return histories.reduce(
    (sum, history) => sum + extrapolateNextValue(history),
    0
  )
}

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(sumExtrapolatedValues(data))
})

function extrapolatePreviousValue(history) {
  let sequences = [history]
  while (sequences[sequences.length - 1].some((val) => val !== 0)) {
    sequences.push(getDifferences(sequences[sequences.length - 1]))
  }
  for (let i = sequences.length - 2; i >= 0; i--) {
    sequences[i].unshift(sequences[i][0] - sequences[i + 1][0])
  }
  return sequences[0][0]
}

function sumExtrapolatedPreviousValues(input) {
  let histories = input.split("\n").map((line) => line.split(" ").map(Number))
  return histories.reduce(
    (sum, history) => sum + extrapolatePreviousValue(history),
    0
  )
}

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(sumExtrapolatedPreviousValues(data))
})
