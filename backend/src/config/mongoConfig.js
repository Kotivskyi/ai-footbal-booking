class MongoConfig {
    constructor(env = process.env.NODE_ENV) {
        this.env = env;
    }

    getConnectionOptions() {
        const baseOptions = {};

        const envOptions = {
            development: {
                connectTimeoutMS: 30000,
                socketTimeoutMS: 30000,
                serverSelectionTimeoutMS: 30000,
            },
            production: {
                connectTimeoutMS: 30000,
                socketTimeoutMS: 30000,
                serverSelectionTimeoutMS: 30000,
            },
            test: {
                connectTimeoutMS: 3000,
                socketTimeoutMS: 3000,
                serverSelectionTimeoutMS: 3000,
            }
        };

        return {
            ...baseOptions,
            ...envOptions[this.env || 'development']
        };
    }
}

module.exports = MongoConfig;
