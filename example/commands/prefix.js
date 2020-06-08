const { Command } = require('discord-akairo');
class PrefixCommand extends Command {
    constructor() {
        super('prefix', {
            aliases: ['prefix'],
            category: 'stuff',
            args: [
                {
                    id: 'prefix'
                }
            ],
            channel: 'guild'
        });
    }
    async exec(message, args) {
        // tests
        if (args.prefix === 'get') {
            const p = this.client.settings.get(message.guild.id, 'prefix');
            return console.log(p);
        }
        // tests
        if (args.prefix === 'clear') {
            const p = await this.client.settings.clear(message.guild.id);
            return console.log(p);
        }

        // tests
        if (args.prefix === 'delete') {
            const p = await this.client.settings.delete(message.guild.id, 'prefix');
            return console.log(p);
        }

        await this.client.settings.set(message.guild.id, 'prefix', args.prefix);
        return message.reply(`Prefix changed to ${args.prefix}`);
    }
}
module.exports = PrefixCommand;
