const ACTIONS = require('../../../connector/actions');
const axios = require('../../request');

const getLastNews = async event => {
  event.sender.send(ACTIONS.GET_LAST_NEWS, { action: 'started' });

  const response = await axios.get('https://noblegarden.net/site/articles');
  const news = response.data;

  event.sender.send(ACTIONS.GET_LAST_NEWS, { action: 'finished', result: news });

  return news;
}

module.exports = getLastNews;