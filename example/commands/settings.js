const { Command } = require('discord-akairo');

class SettingsCommand extends Command {
    constructor() {
        super('settings', {
            aliases: ['settings']
        });
    }

    exec(message) {
        console.log(this.client.settings);
    }
}

module.exports = SettingsCommand;
