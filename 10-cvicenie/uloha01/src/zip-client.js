const http = require('http');
const fs = require('fs');
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
      console.log(`Response code: ${response.statusCode}`);

      pipeline(response, writeStream, (err) => {
        if (err) {
          console.error("Error writing received file");
        }
      });

      writeStream.on('finish', ()=>{
        console.log('File received');
      });
    }
  );

  fs.stat(file, (err, stats) => {
    if (err){
      console.error('Error openning file');
      return;
    }

    req.setHeader('Content-Length', stats.size);
    req.setHeader('Content-Filename', file);

    pipeline(readStream, req, (err) => {
      if (err) {
        console.error("Error sending file");
      }
    });
  });

  return req;
}
