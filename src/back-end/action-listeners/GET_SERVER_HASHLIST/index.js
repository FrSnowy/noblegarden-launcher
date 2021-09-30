const ACTIONS = require('../../../connector/actions');
const axios = require('../../request');

const getServerHashDictionary = async event => {
  let currentServerDictionary = null;
  event.sender.send(ACTIONS.GET_SERVER_HASHLIST, { action: 'started' });

  const serverAddress = await axios.get('https://noblegarden.net/site/patches-ip').then(res => res.data);
  const serverJSON = await axios.get(`http://${serverAddress}/patches.json`, {
    onUploadProgress: progressEvent => {
      progressEvent.lengthComputable && event.sender.send(
        ACTIONS.GET_SERVER_HASHLIST,
        {
          action: 'ongoing',
          progress: (progressEvent.loaded / progressEvent.total).toFixed(2) * 100
        }
      )
    }
  });

  currentServerDictionary = serverJSON.data;

  event.sender.send(
    ACTIONS.GET_SERVER_HASHLIST,
    {
      action: 'finished',
      progress: 100,
      result: currentServerDictionary,
    }
  );

  return currentServerDictionary;
}

module.exports = getServerHashDictionary;