const http = require('http');
const fs = require('fs');
const { pipeline } = require("stream");

module.exports = zipper_client;

function zipper_client(file) {

  const readStream = fs.createReadStream(file, {encoding : 'binary'});
  const writeStream = fs.createWriteStream(`${file}.gz`, {encoding : 'binary'});

  fs.stat(file, (err, stats) => {
    if (err){
      console.error('Error openning file');
      return;
    }

    const req = http.request(
      { 
        host: 'localhost', 
        port: '5634', 
        method: 'POST',
        headers: {
          'Content-Length': stats.size,
          'Content-Filename': file
        },
      },
      response => {
        console.log(`Response code: ${response.statusCode}`);

        pipeline(response, writeStream, (err) => {
          if (err) {
            console.error("Error writing received file");
          }
        });
      }
    );

    pipeline(readStream, req, (err) => {
      if (err) {
        console.error("Error sending file");
      }
    });

  });

}
