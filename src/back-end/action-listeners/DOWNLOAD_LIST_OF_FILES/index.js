const ACTIONS = require('../../../connector/actions');
const axios = require('axios');
const fs = require('fs');
const makePathOK = require('../../makePathOK');

const downloadSingleFile = async ({
  pathToFile,
  pathOnServer,
  onFileSizeKnown = () => 0,
  onProgressChanged = () => 0,
}) => new Promise(async (resolve, reject) => {
  let downloadedSize = 0;
  let fullSize = 0;
  let lockPathToFile = `${pathToFile}.lock`;

  const req = await axios({
    method: 'get',
    url: pathOnServer,
    responseType: 'stream',
  });

  const progressChangedCheckInterval = setInterval(() => {
    fs.stat(lockPathToFile, (err, stat) => {
      if (!err && stat.size > downloadedSize) {
        downloadedSize = stat.size;
        onProgressChanged(downloadedSize);
      }
    })
  }, 500);

  const writeStream = fs.createWriteStream(lockPathToFile);
  writeStream.on('pipe', src => {
    fullSize = parseInt(src.headers['content-length']);
    onFileSizeKnown(fullSize);
  });
  writeStream.on('error', err => {
    try {
      writer.close();
      clearInterval(progressChangedCheckInterval);
      onProgressChanged(0);
      reject(err);
    } catch (e) {
      return null;
    }
  });
  writeStream.on('close', () => {
    try {
      clearInterval(progressChangedCheckInterval);
      onProgressChanged(fullSize);
      resolve(true);
    } catch (e) {
      return null;
    }
  });

  req.data.pipe(writeStream);
});

const deleteOldFile = pathToFile => new Promise(
  (resolve, reject) => {
    fs.unlink(pathToFile, err => {
      if (err) reject (err);
      resolve(true);
    })
  }
);

const makeNewFileNameCorrect = pathToFile => new Promise(
  (resolve, reject) => {
    fs.rename(`${pathToFile}.lock`, `${pathToFile}`, err => {
      if (err) reject(err);
      resolve(true);
    })
  }
)

const downloadListOfFiles = async (event, listOfFiles, serverMeta) => {
  event.sender.send(ACTIONS.DOWNLOAD_LIST_OF_FILES, { action: 'started' });
  if (listOfFiles.length > 0) {
    let summaryFileSize = 0;
    const downloadedSizeMap = new Map();

    await Promise.all(
      listOfFiles.map(async fileName => {
        const pathToFile = makePathOK(fileName);
        await downloadSingleFile({
          pathToFile,
          pathOnServer: serverMeta[fileName].path,
          onFileSizeKnown: size => summaryFileSize += size,
          onProgressChanged: currentFileSize => {
            let summaryDownloadedSize = 0;
            downloadedSizeMap.set(fileName, currentFileSize);
            downloadedSizeMap.forEach(size => summaryDownloadedSize += size);
            try {
              event.sender.send(
                ACTIONS.DOWNLOAD_LIST_OF_FILES,
                {
                  action: 'ongoing',
                  progress: (summaryDownloadedSize / summaryFileSize).toFixed(5) * 100,
                  absoluteProgress: {
                    current: (summaryDownloadedSize / 1024 / 1024).toFixed(2),
                    end: (summaryFileSize / 1024 / 1024).toFixed(2),
                  },
                }
              );
            } catch (e) {}
          }
        });
        if (fs.existsSync(pathToFile)) await deleteOldFile(pathToFile);
        await makeNewFileNameCorrect(pathToFile);
      })
    );
  }
  event.sender.send(
    ACTIONS.DOWNLOAD_LIST_OF_FILES,
    {
      action: 'finished',
      progress: 100,
    }
  );

  return null;
}

module.exports = downloadListOfFiles;