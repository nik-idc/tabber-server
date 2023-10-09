const redis = require("redis");
const env = require("./env");

// Function that creates a redis channel with specified params
function createRedisChannel(host, port, password) {
    return redis.createClient({
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

// Event emitter function
async function emitRedisEvent(eventName, eventMessage) {
    if (!eventEmitter.isOpen) {
        await eventEmitter.connect();
    }
	await eventEmitter.publish(
        `${eventChannelName}:${env.app.name}:${eventName}`,
        JSON.stringify(eventMessage)
    );
}

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
exports.emitRedisEvent = emitRedisEvent;