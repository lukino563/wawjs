const http = require('http');
const fs = require('fs');
const path = require('path');
const { pipeline } = require("stream");

module.exports = zipper_client;

function zipper_client(port, file) {

  const readStream = fs.createReadStream(file);
  const writeStream = fs.createWriteStream(`${file}.gz`);

  const req = http.request(
    { 
      host: 'localhost', 
      port, 
      method: 'POST',
    },
    response => {
      pipeline(response, writeStream, (err) => {
        if (err) {
          //console.debug("CLIENT: Error writing received file");
        }
      });
    }
  );

  fs.stat(file, (err, stats) => {
    if (err){
      //console.debug('CLIENT: Error openning file');
      return;
    }

    req.setHeader('Content-Length', stats.size);
    req.setHeader('Content-Filename', path.parse(file).base);

    pipeline(readStream, req, (err) => {
      if (err) {
        fs.unlinkSync(`${file}.gz`);
        //console.debug("CLIENT: Error sending file");
      }
    });
  });

  return req;
}
