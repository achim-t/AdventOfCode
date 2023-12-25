const fs = require("fs")

let highPulses = 0,
  lowPulses = 0,
  counter = 0
const pulseQueue = []
const { modules, buttonPressCounts, rxPredecessorPredecessors } = readFile()

while (relevantModulesHaveNotBeenHighThreeTimes()) {
  counter++

  pushButton()
  while (pulseQueue.length > 0) {
    const pulse = pulseQueue.shift()
    pulse.type === "high" ? highPulses++ : lowPulses++
    const moduleName = pulse.destination
    const module = modules[moduleName]
    const nextPulseType = processPulseInModule(module, pulse, moduleName)
    if (nextPulseType)
      forwardPulses(nextPulseType, module.destinations, moduleName)
  }
  if (counter === 1000) {
    // Part 1
    console.log(highPulses * lowPulses)
  }
}

throwIfNoCycles()

// Part 2
console.log(calculateResult()) // LCM

function throwIfNoCycles() {
  for (const [input, counts] of Object.entries(buttonPressCounts)) {
    if (2 * counts[0] !== counts[1] || 3 * counts[0] !== counts[2]) {
      throw new Error(
        `The number of button presses does not stay the same for input ${input}`
      )
    }
  }
}

function readFile(filename = "input.txt") {
  const input = fs.readFileSync(filename, "utf-8").trim().split("\r\n")
  const modules = parseInput(input)
  const inputs = buildInputsMap(modules)
  initializeConjunctionModules(modules, inputs)
  const { rxPredecessor, rxPredecessorPredecessors } = getRxPredecessors(inputs)
  const buttonPressCounts = initializeButtonPressCounts(inputs, rxPredecessor)
  return { modules, buttonPressCounts, rxPredecessorPredecessors }
}

function parseInput(input) {
  const modules = {}
  for (const line of input) {
    const [name, destinations] = line.split(" -> ")
    const type = getType(name)
    const moduleName = name.replace(/[%&]/, "")
    const destinationModules = destinations.split(", ")
    modules[moduleName] = {
      type,
      state: "off",
      destinations: destinationModules,
    }
  }
  return modules
}

function buildInputsMap(modules) {
  const inputs = {}
  for (const [moduleName, module] of Object.entries(modules)) {
    for (const destination of module.destinations) {
      if (!inputs[destination]) {
        inputs[destination] = []
      }
      inputs[destination].push(moduleName)
    }
  }
  return inputs
}

function initializeConjunctionModules(modules, inputs) {
  for (const [moduleName, module] of Object.entries(modules)) {
    if (module.type === "conjunction") {
      module.state = inputs[moduleName].reduce(
        (acc, cur) => ({ ...acc, [cur]: "low" }),
        {}
      )
    }
  }
}

function getRxPredecessors(inputs) {
  const rxPredecessor = inputs["rx"][0]
  const rxPredecessorPredecessors = inputs[rxPredecessor]
  return { rxPredecessor, rxPredecessorPredecessors }
}

function initializeButtonPressCounts(inputs, rxPredecessor) {
  return inputs[rxPredecessor].reduce((acc, cur) => ({ ...acc, [cur]: [] }), {})
}

function calculateResult() {
  // Calculate the greatest common divisor of two numbers
  const gcd = (a, b) => (!b ? a : gcd(b, a % b))

  // Calculate the least common multiple of two numbers
  const lcm = (a, b) => (a * b) / gcd(a, b)

  // Calculate the LCM of the first recorded counter values
  const result = Object.values(buttonPressCounts)
    .map((counts) => counts[0])
    .reduce((a, b) => lcm(a, b))
  return result
}

function pushButton() {
  pulseQueue.push({ type: "low", destination: "broadcaster", source: "button" })
}

function getType(name) {
  if (name[0] === "%") return "flip-flop"
  if (name[0] === "&") return "conjunction"
  return "broadcaster"
}

function relevantModulesHaveNotBeenHighThreeTimes() {
  return Object.values(buttonPressCounts).some((counts) => counts.length < 3)
}

function forwardPulses(nextPulseType, destinations, moduleName) {
  for (const destination of destinations) {
    pulseQueue.push({
      type: nextPulseType,
      destination,
      source: moduleName,
    })
  }
}

function processPulseInModule(module, pulse, moduleName) {
  if (!module) return null
  switch (module.type) {
    case "flip-flop":
      return processFlipFlop(pulse, module, moduleName)
    case "conjunction":
      return processConjunction(module, pulse, moduleName)
    default:
      return pulse.type
  }
}

function processFlipFlop(pulse, module, _moduleName) {
  if (pulse.type === "high") return null
  module.state = module.state === "off" ? "on" : "off"
  return module.state === "on" ? "high" : "low"
}

function processConjunction(module, pulse, moduleName) {
  module.state[pulse.source] = pulse.type
  const allHigh = Object.values(module.state).every((state) => state === "high")
  if (rxPredecessorPredecessors.includes(moduleName) && !allHigh) {
    buttonPressCounts[moduleName].push(counter)
  }
  return allHigh ? "low" : "high"
}
