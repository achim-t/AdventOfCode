const fs = require("fs")

// Read the input file

// Split the input into workflows and parts
const [workflowInput, partsInput] = fs
  .readFileSync("input.txt", "utf8")
  .split("\r\n\r\n")

// Parse the workflows
const workflows = Object.fromEntries(
  workflowInput.split("\r\n").map((line) => {
    const [name, rules] = line.split("{").map((str) => str.trim())
    const parsedRules = rules
      .slice(0, -1)
      .split(",")
      .map((rule) => {
        const [condition, destination] = rule.includes(":")
          ? rule.split(":").map((str) => str.trim())
          : [null, rule.trim()]
        return { condition, destination }
      })
    return [name, parsedRules]
  })
)

// Parse the parts
const parts = partsInput.split("\r\n").map((line) => {
  const ratings = line
    .slice(1, -1)
    .split(",")
    .reduce((obj, rating) => {
      const [key, value] = rating.split("=")
      obj[key] = Number(value)
      return obj
    }, {})
  return ratings
})

// Function to process a part through a workflow
function processPart(part, workflowName) {
  if (workflowName === "A") return true
  if (workflowName === "R") return false
  const workflow = workflows[workflowName]
  for (let rule of workflow) {
    if (rule.condition) {
      const [key, operator, value] = rule.condition
        .match(/(\w)([<>])(\d+)/)
        .slice(1)
      if (
        (operator === ">" && part[key] > Number(value)) ||
        (operator === "<" && part[key] < Number(value))
      ) {
        return processPart(part, rule.destination)
      }
    } else {
      return processPart(part, rule.destination)
    }
  }
}

// Iterate over each part and process it
let total = 0
for (let part of parts) {
  if (processPart(part, "in")) {
    total += part.x + part.m + part.a + part.s
  }
}
console.log(total)

let totalCombinations = 0
function dfs(workflowName, ranges) {
  if (workflowName === "R") return
  if (workflowName === "A") {
    let combinations = 1
    for (let key in ranges) {
      const [start, end] = ranges[key]
      combinations *= end - start + 1
    }
    totalCombinations += combinations
  } else {
    const workflow = workflows[workflowName]
    for (let rule of workflow) {
      if (rule.condition) {
        let { acceptedRanges, rejectedRanges } = splitRanges(
          ranges,
          rule.condition
        )
        dfs(rule.destination, acceptedRanges)
        ranges = rejectedRanges
      } else {
        dfs(rule.destination, ranges)
      }
    }
  }
}

function copyRanges(ranges) {
  return {
    x: [...ranges.x],
    m: [...ranges.m],
    a: [...ranges.a],
    s: [...ranges.s],
  }
}

function splitRanges(ranges, condition) {
  const [key, operator, value] = condition.match(/(\w)([<>])(\d+)/).slice(1)
  let acceptedRanges = copyRanges(ranges)
  let rejectedRanges = copyRanges(ranges)

  if (operator === ">") {
    acceptedRanges[key][0] = Math.max(acceptedRanges[key][0], Number(value) + 1)
    rejectedRanges[key][1] = Math.min(rejectedRanges[key][1], Number(value))
  } else {
    acceptedRanges[key][1] = Math.min(acceptedRanges[key][1], Number(value) - 1)
    rejectedRanges[key][0] = Math.max(rejectedRanges[key][0], Number(value))
  }

  return { acceptedRanges, rejectedRanges }
}

dfs("in", { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] })

console.log(totalCombinations)
