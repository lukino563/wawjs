const http = require('http');
const zlib = require('zlib');
const fs = require('fs');
const port = 5634;
const { pipeline } = require("stream");

module.exports = zipper_server;

function zipper_server(path) {

  let zip = zlib.createDeflate({flush : zlib.constants.Z_SYNC_FLUSH});

  const requestHandler = (request, response) => {

    fs.mkdir(path, () => {
      const filename = request.headers['content-filename'];
      const writeStream = fs.createWriteStream(`${path}/${filename}`, {encoding : 'binary'});

      pipeline(request, writeStream, (err) => {
        if (err) {
          console.error("Error writing received file");
        }
      });

      pipeline(request, zip, response,(err) => {
        if (err) {
          console.error("Error sending zipped file");
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

}