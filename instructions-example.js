// first, get the input from the txt file
const fs = require("fs");
const text = fs.readFileSync("./input-example.txt").toString('utf-8');
const textArray = text.split('\n');

// we'll store info about the bots, which bots their high/lows go to,
// and what values they currently have in an array
let bots = [];
let outputs = [];

// finds lines starting with "value" and push info to bots
function addChipValue(line) {
  const matches = line.match(/(\d+)/g).map(parseFloat);
  const botId = matches[1];
  const chip = matches[0];

  // if a bot already in a bots with this botId, just update that object's values
  const foundBot = bots.find(bot => (bot.botId === botId));
  if (foundBot) {
    foundBot.chips.push(chip);
  } else {
  // if bot isn't there already in bots, add a new bot object
    bots.push({
      botId,
      chips: [chip],
    });
  }
}

// finds lines starting with "bot"
// finds a bot's high/low assignments and add/update the object
function addChipDestinations(line) {
  const matches = line.match(/(\d+)/g).map(parseFloat);
  const botId = matches[0];
  const lowDestination = { type: line.match(/(?:low to )(\w+)/)[1], id: matches[1] };
  const highDestination = { type: line.match(/(?:high to )(\w+)/)[1], id: matches[2] };

  const foundBot = bots.find(bot => (bot.botId === botId));
  // if a bot already in a bots with this botId, just update that object's values
  if (foundBot) {
    foundBot.lowDestination = lowDestination;
    foundBot.highDestination = highDestination;
    foundBot.hasExchanged = false;
  } else {
    // if bot isn't there already in bots, add a new bot object
    bots.push({
      botId,
      lowDestination,
      highDestination,
      chips: [],
      hasExchanged: false,
    });
  }
}

// filters out ones in bots with 2 chips AND they haven't exchanged chips yet.
function hasEligibleBots(bot) {
  return (bot.chips.length === 2 && bot.hasExchanged === false);
}

// This runs recursively to keep exchanging chips until all bots with 2 chips have exchanged theirs.
function exchangeChips() {
  // find the bots with 2 microchips & that haven't exchanged them yet
  const botsToRun = bots.filter(hasEligibleBots);

  if (botsToRun.length > 0) {
    for (const bot of botsToRun) {
      // update the high destination chips
      if (bot.highDestination.type === 'bot') {
        const high = bots.find(item => item.botId === bot.highDestination.id)
        high.chips.push(Math.max(...bot.chips));
      }
      // update the low destination values
      if (bot.lowDestination.type === 'bot') {
        const low = bots.find(item => item.botId === bot.lowDestination.id)
        low.chips.push(Math.min(...bot.chips));
      }
      // if destination is output, add the output ID and chip to outputs array
      if (bot.highDestination.type === 'output') {
        outputs.push({
          id: bot.highDestination.id,
          chip: Math.max(...bot.chips),
        });
      }
      if (bot.lowDestination.type === 'output') {
        outputs.push({
          id: bot.lowDestination.id,
          chip: Math.min(...bot.chips),
        });
      }

      bot.chips.sort();
      bot.hasExchanged = true;
    }
    return exchangeChips();
  } else {
    return bots;
  }
}

// Part 1, we can filter and find the bot that sorts chips 17 & 61
function findBot(chips) {
  chips = chips.sort();
  const bot = bots.filter(bot => {
    return bot.chips[0] === chips[0] && bot.chips[1] === chips[1];
  })[0];
  return bot.botId;
}

// Part 2, we multiply chips for outputs 0, 1, 2
function multiplyOutputs() {
  const filteredOutputs =  outputs.filter(output => {
    return (output.id === 0 || output.id === 1 || output.id === 2);
  })

  return filteredOutputs.reduce((acc, curr) => {
    return acc * curr.chip;
  }, 1)
}

// go through text lines and parse out the instructions
// that assign VALUES or CHIP DESTINATIONS
// and put that info in bots
textArray.map(line => {
  if (line.match(/^value/)) { addChipValue(line); }
  if (line.match(/^bot/)) { addChipDestinations(line); }
})

exchangeChips();

// PART 1 ANSWER
const sortingBot = findBot([3,5]);
console.log("PART 1: BOT", sortingBot, "SORTS 3 & 5");

/*
PART 2:
What do you get if you multiply together
the values of chips in each of outputs 0, 1, and 2?
*/
console.log("PART 2: Product of Output 0 * Output 1 * Output 2 = ", multiplyOutputs());
