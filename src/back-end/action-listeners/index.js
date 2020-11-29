const ACTIONS = require('../../connector/actions');
const CLOSE_LAUNCHER = require('./CLOSE_LAUNCHER');
const OPEN_LINK = require('./OPEN_LINK');
const GET_FILES_HASH = require('./GET_FILES_HASH');
const GET_SERVER_HASHLIST = require('./GET_SERVER_HASHLIST');
const GET_LIST_OF_CHANGED_FILES = require('./GET_LIST_OF_CHANGED_FILES');
const DOWNLOAD_LIST_OF_FILES = require('./DOWNLOAD_LIST_OF_FILES');
const GET_ONLINE_COUNT = require('./GET_ONLINE_COUNT');
const GET_LAST_NEWS = require('./GET_LAST_NEWS');
const START_EXE = require('./START_EXE');
const GET_VK_LINK = require('./GET_VK_LINK');
const GET_DISCORD_LINK = require('./GET_DISCORD_LINK');
const CHECK_LAUNHCER_VERSION = require('./CHECK_LAUNCHER_VERSION');
const TOGGLE_SETTINGS = require('./TOGGLE_SETTINGS');

module.exports = {
  [ACTIONS.CHECK_LAUNCHER_VERSION]: CHECK_LAUNHCER_VERSION,
  [ACTIONS.CLOSE_LAUNCHER]: CLOSE_LAUNCHER,
  [ACTIONS.OPEN_LINK]: OPEN_LINK,
  [ACTIONS.TOGGLE_SETTINGS]: TOGGLE_SETTINGS,
  [ACTIONS.GET_FILES_HASH]: GET_FILES_HASH,
  [ACTIONS.GET_SERVER_HASHLIST]: GET_SERVER_HASHLIST,
  [ACTIONS.GET_LIST_OF_CHANGED_FILES]: GET_LIST_OF_CHANGED_FILES,
  [ACTIONS.DOWNLOAD_LIST_OF_FILES]: DOWNLOAD_LIST_OF_FILES,
  [ACTIONS.GET_ONLINE_COUNT]: GET_ONLINE_COUNT,
  [ACTIONS.GET_LAST_NEWS]: GET_LAST_NEWS,
  [ACTIONS.START_EXE]: START_EXE,
  [ACTIONS.GET_VK_LINK]: GET_VK_LINK,
  [ACTIONS.GET_DISCORD_LINK]: GET_DISCORD_LINK,
};