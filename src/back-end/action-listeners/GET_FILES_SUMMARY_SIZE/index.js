const ACTIONS = require('../../../connector/actions');
const axios = require('../../request');

const getFileSummarySize = async (event, fileList, serverMeta) => {
  event.sender.send(ACTIONS.GET_FILES_SUMMARY_SIZE, { action: 'started' });
  let summarySize = 0;
  let progress = 0;

  for (const index in fileList) {
    const fileName = fileList[index];
    const remotePath = serverMeta[fileName].path;

    try {
      const res = await axios.head(remotePath);
      summarySize += +res.headers['content-length'];
      progress += 1;

      event.sender.send(
        ACTIONS.GET_FILES_SUMMARY_SIZE,
        {
          action: 'ongoing',
          progress: (progress / fileList.length).toFixed(5) * 100,
          absoluteProgress: {
            current: progress,
            end: fileList.length,
          },
        }
      );
    } catch (e) {
      console.log(e);
      console.error(`Can not get filesize of ${fileName}`);
    }
  }

  event.sender.send(
    ACTIONS.GET_FILES_SUMMARY_SIZE,
    {
      action: 'finished',
      progress: 100,
      result: summarySize,
    }
  );

  return summarySize;
}

module.exports = getFileSummarySize;