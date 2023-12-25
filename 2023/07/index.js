const cardValues = {
  A: 14,
  K: 13,
  Q: 12,
  J: 1,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
}

const HandTypes = {
  HIGH_CARD: 1,
  ONE_PAIR: 2,
  TWO_PAIR: 3,
  THREE_OF_A_KIND: 4,
  FULL_HOUSE: 5,
  FOUR_OF_A_KIND: 6,
  FIVE_OF_A_KIND: 7,
}

function handType(hand) {
  const cards = hand.split("")
  const sortedCards = [...cards].sort((a, b) => cardValues[b] - cardValues[a])
  const counts = new Map(Array.from(sortedCards, (x) => [x, 0]))
  for (const card of sortedCards) counts.set(card, counts.get(card) + 1)
  const jokers = counts.get("J") || 0
  counts.delete("J")
  const pairs = Array.from(counts.values()).sort((a, b) => b - a)
  if (jokers === 5 || pairs[0] + jokers === 5)
    return [HandTypes.FIVE_OF_A_KIND, cards]
  if (pairs[0] + jokers === 4) return [HandTypes.FOUR_OF_A_KIND, cards]
  if (pairs[0] + jokers === 3 && pairs[1] === 2)
    return [HandTypes.FULL_HOUSE, cards]
  if (pairs[0] + jokers === 3) return [HandTypes.THREE_OF_A_KIND, cards]
  if (pairs[0] === 2 && pairs[1] === 2) return [HandTypes.TWO_PAIR, cards]
  if (pairs[0] + jokers === 2) return [HandTypes.ONE_PAIR, cards]
  return [HandTypes.HIGH_CARD, cards]
}

function compareHands(a, b) {
  const [typeA, cardsA] = handType(a)
  const [typeB, cardsB] = handType(b)
  if (typeA !== typeB) return typeB - typeA
  for (let i = 0; i < 5; i++) {
    if (cardsA[i] !== cardsB[i])
      return cardValues[cardsB[i]] - cardValues[cardsA[i]]
  }
}

const fs = require("fs")

function calculateWinnings(filename) {
  const lines = fs.readFileSync(filename, "utf-8").split("\n").filter(Boolean)
  const hands = lines.map((line) => {
    const [hand, bid] = line.split(" ")
    return [hand, Number(bid)]
  })
  const handSet = new Set(hands.map(([hand]) => hand))
  hands.sort((a, b) => compareHands(b[0], a[0]))
  return hands.reduce((sum, [hand, bid], i) => sum + bid * (i + 1), 0)
}

console.log(calculateWinnings("sample.txt"))
console.log(calculateWinnings("input.txt"))
