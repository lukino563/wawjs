 const async = require("async");
 const fs = require("fs");
 const path = require("path")
 module.exports = saveSomewhere;

 function saveSomewhere(paths, data, cb) {
     const task = (filePath, cb) => fs.writeFile(filePath, data, (err) => {
         if (err) return cb(err);
         cb(null, filePath);
     });

     async.detect(paths, task, cb);

 }
