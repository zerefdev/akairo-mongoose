const mongoose = require('mongoose');
const { AkairoClient, CommandHandler } = require('discord-akairo');
const MongooseProvider = require('akairo-mongoose');

const model = require('./models/guild');

class CustomClient extends AkairoClient {
  constructor() {
    super(
      {
        ownerID: '264849432489492480'
      },
      {
        disableMentions: 'everyone'
      }
    );

    this.settings = new MongooseProvider(model);

    this.commandHandler = new CommandHandler(this, {
      directory: './commands/',
      prefix: (message) => {
        if (message.guild) {
          // The third param is the default.
          return this.settings.get(message.guild.id, 'prefix', '!');
        }

        return '!';
      }
    });

    this.commandHandler.loadAll();
  }

  login(token) {
    this.settings.init();
    return super.login(token);
  }
}

// connect to db and start the bot
mongoose
  .connect('mongodb://localhost:27017/example', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('✅ Connected to database');
    const client = new CustomClient();
    client.login(process.env.TOKEN);
  })
  .catch((err) => console.log(err));
