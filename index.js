const { Provider } = require('discord-akairo');

/**
 * Provider using the `Mongoose` library.
 * @param {Model} model - A Mongoose model.
 * @extends {Provider}
 */
class MongooseProvider extends Provider {
    constructor(model) {
        super();

        /**
         * Mongoose model.
         * @type {Model}
         */
        this.model = model;

        /**
         * Guild ID field
         * @type {Model}
         */
        this.id = Object.keys(model.schema.obj)[0];

        /**
         * Guild settings/data field
         * @type {Model}
         */
        this.settings = Object.keys(model.schema.obj)[1];
    }

    /**
     * Initializes the provider.
     * @returns {<void>}
     */
    async init() {
        try {
            const guilds = await this.model.find();
            for (const i in guilds) {
                const guild = guilds[i];
                this.items.set(guild[this.id], guild[this.settings]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Gets a value.
     * @param {string} id - guildID.
     * @param {string} key - The key to get.
     * @param {any} [defaultValue] - Default value if not found or null.
     * @returns {any}
     */
    get(id, key, defaultValue) {
        if (this.items.has(id)) {
            const value = this.items.get(id)[key];
            return value == null ? defaultValue : value;
        }
        return defaultValue;
    }

    /**
     * Sets a value.
     * @param {string} id - guildID.
     * @param {string} key - The key to set.
     * @param {any} value - The value.
     * @returns {Promise} - Mongoose query object|document
     */
    async set(id, key, value) {
        const data = this.items.get(id) || {};
        data[key] = value;
        this.items.set(id, data);
        try {
            const doc = await this.getDocument(id);
            doc[this.settings][key] = value;
            doc.markModified(this.settings);
            return await doc.save();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Deletes a value.
     * @param {string} id - guildID.
     * @param {string} key - The key to delete.
     * @returns {Promise} - Mongoose query object|document
     */
    async delete(id, key) {
        const data = this.items.get(id) || {};
        delete data[key];
        try {
            const doc = await this.getDocument(id);
            delete doc[this.settings][key];
            doc.markModified(this.settings);
            return await doc.save();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Removes a document.
     * @param {string} id - GuildID.
     * @returns {Promise<void>}
     */
    async clear(id) {
        this.items.delete(id);
        try {
            const doc = await this.getDocument(id);
            return await doc.remove();
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Gets a document by guildID.
     * @param {string} id - guildID.
     * @returns {Promise} - Mongoose query object|document
     */
    async getDocument(id) {
        try {
            let obj = await this.model.findOne({ [this.id]: id });
            if (!obj) {
                obj = await new this.model({ [this.id]: id, [this.settings]: {} }).save();
            }
            return obj;
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = MongooseProvider;
