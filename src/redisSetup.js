const redis = require("redis");

const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
client.auth('admin')
client.on('connect', function() {
    console.log('Redis Connected!');
});

module.exports = client