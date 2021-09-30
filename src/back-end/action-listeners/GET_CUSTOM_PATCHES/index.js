const ACTIONS = require('../../../connector/actions');
const axios = require('../../request');

const getCustomPatches = async event => {
  event.sender.send(ACTIONS.GET_CUSTOM_PATCHES, { action: 'started' });

  const serverAddress = await axios.get('https://noblegarden.net/site/patches-ip').then(res => res.data);
  const customPatches = await axios.get(`http://${serverAddress}/custom-patches.json`).then(res => res.data);
  event.sender.send(ACTIONS.GET_CUSTOM_PATCHES, { action: 'finished', result: customPatches });

  return customPatches;
}

module.exports = getCustomPatches;