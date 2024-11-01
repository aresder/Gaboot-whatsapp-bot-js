const fs = require('fs');
const axios = require('axios');

const handleDownloadImageRandomAnime = async (url, filePath) => {
  const writer = fs.createWriteStream(filePath);

  const res = await axios.get(url, { responseType: 'stream' });

  return new Promise((resolve, reject) => {
    res.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

module.exports = handleDownloadImageRandomAnime;