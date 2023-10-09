const { redisConfig } = require('../config/redis.config');
const { processRedisEvent } = require('./eventProcessor');

// As seen below currently it's all done using promises
// Doesn't look that good, so I think it's worth looking into how to change that
// (cue this staying the same for years)

function listenRedisEvents() {
    const eventListener = redisConfig.channels.eventListener;
    const eventChannelName = redisConfig.channelNames.eventChannelName;

    if (!eventListener.isOpen) {
        redisConfig.channels.eventListener.connect()
            .then(() => {
                console.log('Listening for redis events');
                eventListener.PSUBSCRIBE(`${eventChannelName}:*`, async (message, channel) => {
                    try {
                        console.log(`Event '${message}' received on channel '${channel}'. Processing event...`);
                        await processRedisEvent(message, channel);
                    } catch (error) {
                        console.log(`Error during processing of event '${message}' received on channel '${channel}'. Error: ${error}`);
                    }
                })
                    .then(() => {
                        console.log('Succesfully subscribed to listening pattern');
                    })
                    .catch((error) => {
                        console.log(`Failed to subscribe to listening pattern. Error: '${error}'`);
                    })
            })
            .catch((error) => {
                console.log(`Failed to connect to listening channel. Error: '${error}'`);
            });
    }
}

exports.listenRedisEvents = listenRedisEvents;