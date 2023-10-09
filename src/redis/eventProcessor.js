const env = require('../config/env');

async function processRedisEvent(message, channel) {
    const channelSplit = channel.split(':');
    const appName = channelSplit[2];
    const eventName = channelSplit[3];

    if (appName == env.app.name) {
        console.log(`Event received on the same app`);
        return;
    }

    switch (eventName) {
        default:
            console.log(`No event processor for event '${eventName}'`);
            break;
    }

}

exports.processRedisEvent = processRedisEvent;