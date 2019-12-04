const http = require('http');
const zlib = require('zlib');
const fs = require('fs');
const port = 5634;
const { pipeline } = require("stream");

const savePath = process.argv[2];

const requestHandler = (request, response) => {

  fs.mkdir(savePath, () => {
    const filename = request.headers['content-filename'];
    const writeStream = fs.createWriteStream(`${savePath}/${filename}`);

    pipeline(request, writeStream, (err) => {
      if (err) {
        console.error("Error writing received file");
      }

    });
    pipeline(request, zlib.createGzip(), response, (err) => {
      if (err) {
        console.error("Error seding zipped file");
      }
    });
  });
}

const server = http.createServer(requestHandler).on('error', (err) => {
  return console.error('Error on server occured:', err.code);
});


server.listen(port, () => {
  console.log(`Listening on PORT: ${port}`);
});