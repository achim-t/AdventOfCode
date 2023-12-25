const fs = require("fs")

function solve(races) {
  let total = 1
  for (const race of races) {
    let t_max = race.time / 2
    if (t_max * (race.time - t_max) <= race.record) {
      continue
    }
    let t1 = Math.ceil(
      (race.time - Math.sqrt(race.time * race.time - 4 * race.record)) / 2
    )
    let t2 = Math.floor(
      (race.time + Math.sqrt(race.time * race.time - 4 * race.record)) / 2
    )
    total *= t2 - t1 + 1
  }
  return total
}

// Read the input from the file and call solve
fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  let lines = data.split("\r\n")
  let times = lines[0]
    .split(":")[1]
    .split(" ")
    .map(Number)
    .filter((x) => !isNaN(x) && x > 0)
  let records = lines[1]
    .split(":")[1]
    .split(" ")
    .map(Number)
    .filter((x) => !isNaN(x) && x > 0)
  let races = times.map((time, i) => ({ time, record: records[i] }))
  console.log(solve(races))
})

fs.readFile("input.txt", "utf8", (err, data) => {
  let lines = data.split("\r\n")
  let time = Number(lines[0].split(":")[1].replaceAll(" ", ""))
  let record = Number(lines[1].split(":")[1].replaceAll(" ", ""))
  let races = [{ time, record }]
  console.log(solve(races))
})
