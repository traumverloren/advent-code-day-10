// first, get the input from the txt file
const fs = require("fs");
const text = fs.readFileSync("./input.txt").toString('utf-8');
const textArray = text.split("\n");

// we'll store info about the bots,
// which bots their high/lows go to,
// and what values they currently have
let bots = [];

// go through text lines and parse out values and bot info into array of objects
textArray.map(line => {
  // find bot values and push to bots array
  if (line.match(/^value/)) {
    const matches = line.match(/(\d+)/g).map(parseFloat);
    const botId = matches[0];
    const value = matches[1];

    bots.push({
      botId,
      values: [value],
    });
  }

  // find bots high/low bot assignments and add/update objects to bots array
  if (line.match(/^bot/)) {
    const matches = line.match(/(\d+)/g).map(parseFloat);
    const botId = matches[0];
    const lowBot = matches[1];
    const highBot = matches[2];

    const foundBot = bots.filter((bot) => (bot.botId === botId))[0];
    if (foundBot) {
      foundBot[lowBot] = lowBot;
      foundBot[highBot] = highBot;
    } else {
      bots.push({
        botId,
        lowBot,
        highBot,
        values: [],
      });
    }
  }
})

console.log(bots);
