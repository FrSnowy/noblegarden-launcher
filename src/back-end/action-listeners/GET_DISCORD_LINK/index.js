const ACTIONS = require('../../../connector/actions');
const axios = require('../../request');

const getDiscordLink = async event => {
  event.sender.send(ACTIONS.GET_DISCORD_LINK, { action: 'started' });
  try {
    const response = await axios.get('https://noblegarden.net/site/discord-link');
    event.sender.send(ACTIONS.GET_DISCORD_LINK, { action: 'finished', result: response.data });
    return response.data;
  } catch (e) {
    return null;
  }
}

module.exports = getDiscordLink;