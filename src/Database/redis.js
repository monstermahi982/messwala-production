const redis = require('redis');
const { createClient } = redis;

const mode = process.env.MODE;
if (mode === 'dev') {
    const client = createClient();
    client.on('connect', (error) => console.log('Redis Client successfully :- ' + mode));
    client.on('error', (err) => console.log('Redis Client Error-------sad', err));
    client.connect();

    module.exports = client;
} else if (mode === 'prod') {
    const client = createClient({ url: process.env.REDIS_URL });
    client.on('connect', (error) => console.log('Redis Client successfully :- ' + mode));
    client.on('error', (err) => console.log('Redis Client Error-------sad', err));
    client.connect();

    module.exports = client;
}
