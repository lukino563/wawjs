 const async = require("async");
 const fs = require("fs");
 module.exports = saveSomewhere;

 function saveSomewhere(paths, data, cb) {
     const tasks = []
     let task = (path, data, cb) => fs.writeFile(path, data, (err) => {
         if (err) return cb(err);
         cb(null, path);
     });
     for (var path of paths) {
     	tasks.push(task.bind(null, path, data));
     }
     async.tryEach(tasks, cb);
 }
