const token = process.env.TELEGRAM_BOT_TOKEN;

const Bot = require('node-telegram-bot-api');
const api = require('./api');
let bot;

if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.BOT_URL + bot.token);
}
else {
  bot = new Bot(token, { polling: true });
}

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

bot.on('message', (msg) => {
  const name = msg.from.first_name;
  api.then((matches) => {
    bot.sendMessage(msg.chat.id, JSON.stringify(matches, null, '\t')).then(() => {
      // reply sent!
    });
  });
});

module.exports = bot;
