const server = require('../src/zip-server');
const client = require('../src/zip-client');

server('testdir');
client('testfile.bin');