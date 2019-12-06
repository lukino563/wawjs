const http = require('http');
const zlib = require('zlib');
const fs = require('fs');
const { pipeline } = require("stream");

module.exports = zipper_server;

function zipper_server(path) {

  const requestHandler = (request, response) => {

    let gzip = zlib.createGzip();

    fs.mkdir(path, () => {
      const filename = request.headers['content-filename'];
      const writeStream = fs.createWriteStream(`${path}/${filename}`);

      pipeline(request, writeStream, (err) => {
        if (err) {
          console.debug("SERVER: Error writing received file");
        }
      });

      pipeline(request, gzip, response, (err)=>{
        if (err) {
          console.debug("SERVER: Error sending zipped file");
        }
      });
    });
  }

  return http.createServer(requestHandler).on('error', (err) => {
    return console.error('SERVER: Error on server occured:', err.code);
  });

}