
const [, ,
  URL = 'https://gazelle.ihe.net/sonar/api/rules/search?languages=js'
] = process.argv;

const async = require("async");
const { doWhilst } = require("async");
const request = require("request").defaults({ json: true });

function getTotal(cb) {
  const url = `${URL}&pageIndex=1`;
  request(url, (err, _, { total, ps }) => {
    cb(null, { total, ps });
  });
}

function getPage(url, cb) {
  request(url, (err, _, data) => {
    cb(null, data.rules);
  });
}

function getPages(pageSize, cb) {
  let urls = Array.from({length:pageSize+1},(_, i) => {
    return `${URL}&pageIndex=${i+1}`
  })
  let jobs=urls.map((url) => {
    return (cb) => getPage(url, cb);
  });
  async.parallel(jobs, (err, results) => {
    let a = [].concat(...results);
    cb(JSON.stringify(a, null, 2));
  })
}

function getPageCount(obj) {
  return parseInt(obj.total) / parseInt(obj.ps);
 
}

function print(args) {
  console.log(args);
}

async.waterfall([
  getTotal,
  async.asyncify(getPageCount),
  getPages
], print)
