const redis = require("redis");
const env = require("./env");

// Function that creates a redis channel with specified params
function createRedisChannel(host, port, password) {
    redis.createClient({
        socket: {
            host: host,
            port: port
        }
    })
}

// Event channels
const eventEmitter = createRedisChannel(env.redis.host, env.redis.port);
const eventListener = createRedisChannel(env.redis.host, env.redis.port);

// Channel names
const eventChannelName = "tabber:event";

const redisConfig = {
    channels: {
        eventEmitter: eventEmitter,
        eventListener: eventListener
    },
    channelNames: {
        eventChannelName: eventChannelName
    }
}

exports.redisConfig = redisConfig;