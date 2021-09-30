const ACTIONS = require('../../../connector/actions');
const axios = require('../../request');

const getLauncherVersion = async event => {
  event.sender.send(ACTIONS.CHECK_LAUNCHER_VERSION, { action: 'started' });
  try {
    const serverAddress = await axios.get('https://noblegarden.net/site/patches-ip').then(res => res.data);
    const response = await axios.get(`http://${serverAddress}/launcher-version.json`);
    const { version } = response.data;
    event.sender.send(ACTIONS.CHECK_LAUNCHER_VERSION, { action: 'finished', result: version === '1.3.2' });
    return response.data;
  } catch (e) {
    event.sender.send(ACTIONS.CHECK_LAUNCHER_VERSION, { action: 'finished', result: 'not-working' });
  }
}

module.exports = getLauncherVersion;