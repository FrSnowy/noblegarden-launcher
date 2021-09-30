const ACTIONS = require('../../../connector/actions');
const axios = require('../../request');

const getOnlineCount = async event => {
  event.sender.send(ACTIONS.GET_ONLINE_COUNT, { action: 'started' });

  const response = await axios.get('https://noblegarden.net/armory/online');
  const count = parseInt(response.data, 10);

  event.sender.send(ACTIONS.GET_ONLINE_COUNT, { action: 'finished', result: count });

  return count;
}

module.exports = getOnlineCount;