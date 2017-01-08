// first, get the input from the txt file
const fs = require("fs");
const text = fs.readFileSync("./input.txt").toString('utf-8');
const textArray = text.split('\n');

// we'll store info about the bots, which bots their high/lows go to,
// and what values they currently have in an array
let bots = [];

// go through text lines and parse out the instructions that assign VALUES
// and put that info into an object in bots
textArray.map(line => {
  // finds lines starting with "value" and push info to bots
  if (line.match(/^value/)) {
    const matches = line.match(/(\d+)/g).map(parseFloat);
    const botId = matches[1];
    const value = matches[0];

    // if a bot already in a bots with this botId, just update that object's values
    const foundBot = bots.filter(bot => (bot.botId === botId))[0];
    if (foundBot) {
      foundBot.values.push(value);
    } else {
    // if bot isn't there already in bots, add a new bot object
      bots.push({
        botId,
        values: [value],
      });
    }
  }
  // finds lines starting with "bot"
  // finds bots high/low bot assignments and add/update objects to bots
  if (line.match(/^bot/)) {
    const matches = line.match(/(\d+)/g).map(parseFloat);
    const botId = matches[0];
    const lowDestination = { type: line.match(/(?:low to )(\w+)/)[1], id: matches[1] };
    const highDestination = { type: line.match(/(?:high to )(\w+)/)[1], id: matches[2] };

    const foundBot = bots.filter(bot => (bot.botId === botId))[0];
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
        values: [],
        hasExchanged: false,
      });
    }
  }
})

// filters out ones in bots with 2 values AND they haven't exchanged chips yet.
function hasEligibleBots(bot) {
  return (bot.values.length === 2 && bot.hasExchanged === false);
}

// At the end, we can filter and find the bot that sorts 17 & 61
function findBot(values) {
  values = values.sort();
  const bot = bots.filter(bot => {
    return bot.values[0] === values[0] && bot.values[1] === values[1];
  })[0];

  return bot.botId;
}

// This runs recursively to keep exchanging chips until all bots with 2 chips have exchanged theirs.
function exchangeChips() {
  // find the bots with 2 microchips & that haven't exchanged them yet
  const botsToRun = bots.filter(hasEligibleBots);

  if (botsToRun.length > 0) {
    for (const bot of botsToRun) {
      // update the high destination values
      if (bot.highDestination.type === 'bot') {
        const high = bots.find(item => item.botId === bot.highDestination.id)
        high.values.push(Math.max(...bot.values));
      }
      // update the low destination values
      if (bot.lowDestination.type === 'bot') {
        const low = bots.find(item => item.botId === bot.lowDestination.id)
        low.values.push(Math.min(...bot.values));
      }
      bot.values.sort();
      bot.hasExchanged = true;
    }

    return exchangeChips();

  } else {
    return bots;
  }
}

exchangeChips();

console.log("BOT", findBot([17,61]), "SORTS 17 & 61");
