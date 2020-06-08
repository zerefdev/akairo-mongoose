# Discord-Akairo MongooseProvider

## About

A mongoose provider for [discord-akairo](https://github.com/discord-akairo/discord-akairo).

## Installation

make sure you have mongoose installed and please take a look at the [model example](https://github.com/Zerefdev/akairo-mongoose#model-example)

```bash
npm i akairo-mongoose
```

# Using Mongoose Provider

### Storing Prefixes

Let's implement per-guild prefixes.  
First, create a new MongooseProvider.

```js
const mongoose = require('mongoose');
const { AkairoClient } = require('discord-akairo');
const MongooseProvider = require('akairo-mongoose');

const model = require('./path/to/model'); // see Model Example below

class CustomClient extends AkairoClient {
  constructor() {
    super({
      /* Options here */
    });
    // Mongoose Provider
    this.settings = new MongooseProvider(model);
  }
}

// connect to db and start the bot
mongoose
  .connect(/* DATABASE URI HERE */, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('✅ Connected to database');
    const client = new CustomClient();
    client.login(token);
  })
  .catch((err) => console.log(err));
```

Before you can actually use the provider, you would have to run the `init` method.  
For example:

```js
class CustomClient extends AkairoClient {
    /* ... */
    async login(token) {
        await this.settings.init();
        return super.login(token);
    }
}
```

Now, the provider can be used like so:

```js
class CustomClient extends AkairoClient {
    constructor() {
        super({
            prefix: (message) => {
                if (message.guild) {
                    // The third param is the default.
                    return this.settings.get(message.guild.id, 'prefix', '!');
                }
                return '!';
            }
        });
        /* ... */
    }
}
```

### Model Example

```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guildSchema = new Schema({
    // 'id' field must be first - you can name it whatever you want
    id: {
        type: String,
        required: true
    },
    // 'data' field must be second - you can name it whatever you want
    data: {
        type: Object,
        required: true
    }
});

module.exports = mongoose.model('Guild', guildSchema);
```

# Full example here

https://github.com/Zerefdev/akairo-mongoose/tree/master/example

## License

MIT © [Zerefdev](https://github.com/Zerefdev)
