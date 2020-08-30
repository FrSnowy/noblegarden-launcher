const ACTIONS = require('../../../connector/actions');
const axios = require('axios');

const getLauncherVersion = async event => {
  event.sender.send(ACTIONS.CHECK_LAUNCHER_VERSION, { action: 'started' });
  try {
    const response = await axios.get('http://95.216.176.164/launcher-version.json');
    event.sender.send(ACTIONS.CHECK_LAUNCHER_VERSION, { action: 'finished', result: response.data });
    return response.data;
  } catch (e) {
    event.sender.send(ACTIONS.CHECK_LAUNCHER_VERSION, { action: 'finished', result: 'not-working' });
  }
}

module.exports = getLauncherVersion;