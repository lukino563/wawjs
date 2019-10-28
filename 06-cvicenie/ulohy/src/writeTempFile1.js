module.exports = writeTempFile;

const fs = require("fs");
const os = require("os");
const path = require("path");


function writeTempFile(fileName, ...args) {
  const cb = args.pop();

  const tmpDir = path.join(os.tmpdir(), `${process.pid}-`);
  fs.mkdtemp(tmpDir, (err, folder) => {
      if (err) return cb(err)

      const tmpFile = path.resolve(folder, fileName);
      try {
          fs.writeFile(tmpFile, ...args, (err) => {
              if (err) return cb(err)
              cb(null, tmpFile)
          })
      } catch (ex) {
        cb(ex)
      }
  })
}